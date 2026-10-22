import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DATA_DIR } from "./store";
import { PENDING_COOKIE, SESSION_COOKIE } from "./cookie-names";
import type { PublicUser, Role, User } from "./types";

const USERS = path.join(DATA_DIR, "users.json");
export { SESSION_COOKIE };
const SESSION_HOURS = 8;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set in .env.local (at least 32 characters).");
  return s;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [, saltHex, hashHex] = stored.split("$");
  if (!saltHex || !hashHex) return false;
  const hash = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  return expected.length === hash.length && timingSafeEqual(hash, expected);
}

export async function readUsers(): Promise<User[]> {
  try {
    return JSON.parse(await fs.readFile(USERS, "utf8")) as User[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return [];
    const first: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      name: "Administrator",
      role: "admin",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    try {
      await writeUsers([first]);
    } catch {
      // Read-only hosting: keep the env admin in memory only.
    }
    return [first];
  }
}

export async function writeUsers(users: User[]) {
  await fs.writeFile(USERS, JSON.stringify(users, null, 1), "utf8");
}

export const toPublic = ({ passwordHash: _p, totpSecret, ...u }: User): PublicUser => ({ ...u, twoFactor: !!totpSecret });

// In-memory brute force protection, per account and per IP address:
// 5 failed attempts per account or 20 per IP lock out for 15 minutes.
const failures = new Map<string, { count: number; until: number }>();
const LIMITS = { account: 5, ip: 20 };

export function isLockedOut(key: string, limit = LIMITS.account): boolean {
  const f = failures.get(key);
  return !!f && f.count >= limit && f.until > Date.now();
}

export function noteFailure(key: string) {
  const f = failures.get(key);
  const until = Date.now() + 15 * 60 * 1000;
  failures.set(key, { count: f && f.until > Date.now() ? f.count + 1 : 1, until });
}

export const ipLocked = (ip: string) => isLockedOut(`ip:${ip}`, LIMITS.ip);
export const clearFailures = (key: string) => failures.delete(key);

// A fixed dummy hash keeps response time the same for unknown emails.
const DUMMY = hashPassword(randomBytes(12).toString("hex"));

export async function checkCredentials(email: string, password: string): Promise<User | null> {
  const key = email.toLowerCase();
  if (isLockedOut(key)) return null;
  const users = await readUsers();
  const user = users.find((u) => u.email === key);
  const ok = verifyPassword(password, user?.passwordHash ?? DUMMY);
  if (!user || !ok) {
    noteFailure(key);
    return null;
  }
  return user;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function createSession(user: User) {
  const payload = Buffer.from(
    JSON.stringify({ uid: user.id, v: user.sessionVersion ?? 0, exp: Date.now() + SESSION_HOURS * 3600_000 }),
  ).toString("base64url");
  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

// Between the password step and the authenticator code step we keep only a
// short-lived signed marker, never the password.

export async function createPending2fa(userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + 5 * 60_000 })).toString("base64url");
  (await cookies()).set(PENDING_COOKIE, `${payload}.${sign(`2fa.${payload}`)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 300,
  });
}

export async function readPending2fa(): Promise<User | null> {
  const jar = await cookies();
  const raw = jar.get(PENDING_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  const expected = sign(`2fa.${payload}`);
  if (!payload || !sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { uid: string; exp: number };
    if (exp < Date.now()) return null;
    return (await readUsers()).find((u) => u.id === uid) ?? null;
  } catch {
    return null;
  }
}

export async function clearPending2fa() {
  (await cookies()).delete({ name: PENDING_COOKIE, path: "/admin" });
}

export async function destroySession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/" });
}

export async function currentUser(): Promise<PublicUser | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { uid, v, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { uid: string; v: number; exp: number };
    if (exp < Date.now()) return null;
    const user = (await readUsers()).find((u) => u.id === uid);
    if (!user || (user.sessionVersion ?? 0) !== v) return null;
    return toPublic(user);
  } catch {
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireUser(role?: Role): Promise<PublicUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin?denied=1");
  return user;
}
