"use server";

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { audit, DATA_DIR, mutate } from "@/lib/store";
import {
  checkCredentials,
  clearFailures,
  clearPending2fa,
  createPending2fa,
  readPending2fa,
  createSession,
  destroySession,
  hashPassword,
  ipLocked,
  isLockedOut,
  noteFailure,
  readUsers,
  requireUser,
  writeUsers,
} from "@/lib/auth";
import { newSecret, otpauthUri, verifyTotp } from "@/lib/totp";
import { getCollection, SETTINGS_FIELDS, type Field } from "@/lib/schema";
import { slugify } from "@/lib/markdown";
import { youtubeId } from "@/lib/youtube";
import type { DB, Role, User } from "@/lib/types";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
  message?: string;
  needCode?: boolean;
  /** What the user submitted, returned on errors so the form keeps it. */
  values?: Record<string, unknown>;
};

const refresh = () => revalidatePath("/", "layout");

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

/* ---------- auth ---------- */

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 160);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const otp = String(form.get("code") ?? "").trim();
  const ip = await clientIp();

  // Step 2: authenticator code after a correct password.
  if (form.has("code")) {
    if (ipLocked(ip)) return { error: "Too many failed attempts. Try again in 15 minutes." };
    const pending = await readPending2fa();
    if (!pending?.totpSecret) return { error: "Your sign-in expired. Please start again." };
    if (isLockedOut(pending.email)) return { error: "Too many failed attempts. Try again in 15 minutes." };
    if (!verifyTotp(pending.totpSecret, otp)) {
      noteFailure(pending.email);
      noteFailure(`ip:${ip}`);
      await mutate((db) => audit(db, pending.email, "Failed two-factor code", ip)).catch(() => {});
      return { needCode: true, error: "That code is not correct. Use the current code from your authenticator app." };
    }
    await clearPending2fa();
    return finishLogin(pending, ip);
  }

  if (!email || !password) return { error: "Enter your email and password." };
  if (isLockedOut(email) || ipLocked(ip)) return { error: "Too many failed attempts. Try again in 15 minutes." };
  const users = await readUsers();
  if (!users.length) return { error: "No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local." };
  const user = await checkCredentials(email, password);
  if (!user) {
    noteFailure(`ip:${ip}`);
    await mutate((db) => audit(db, email, "Failed sign-in", ip)).catch(() => {});
    return { error: "Incorrect email or password." };
  }
  if (user.totpSecret) {
    await createPending2fa(user.id);
    return { needCode: true };
  }
  return finishLogin(user, ip);
}

async function finishLogin(user: User, ip: string): Promise<FormState> {
  clearFailures(user.email);
  await createSession(user);
  // Logging must not block sign-in on read-only demo hosting.
  await updateUser(user.id, (u) => (u.lastLoginAt = new Date().toISOString())).catch(() => {});
  await mutate((db) => audit(db, user.email, "Signed in", ip)).catch(() => {});
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

async function updateUser(id: string, fn: (u: User) => void) {
  const users = await readUsers();
  const u = users.find((x) => x.id === id);
  if (!u) return null;
  fn(u);
  await writeUsers(users);
  return u;
}

/** Ends every session of the current user, on all devices. */
export async function signOutEverywhere() {
  const me = await requireUser();
  await updateUser(me.id, (u) => (u.sessionVersion = (u.sessionVersion ?? 0) + 1));
  await mutate((db) => audit(db, me.email, "Signed out on all devices", ""));
  await destroySession();
  redirect("/admin/login");
}

/* ---------- two-factor login ---------- */

export async function startTwoFactor(): Promise<{ secret: string; qr: string }> {
  const me = await requireUser();
  const secret = newSecret();
  const qr = await QRCode.toDataURL(otpauthUri(secret, me.email), { margin: 1, width: 220 });
  return { secret, qr };
}

export async function enableTwoFactor(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser();
  const secret = String(form.get("secret") ?? "");
  const otp = String(form.get("code") ?? "");
  if (!/^[A-Z2-7]{32}$/.test(secret)) return { error: "Setup expired. Start again." };
  if (!verifyTotp(secret, otp)) return { error: "That code is not correct. Check the time on your phone and try again." };
  await updateUser(me.id, (u) => {
    u.totpSecret = secret;
    u.sessionVersion = (u.sessionVersion ?? 0) + 1;
  });
  const fresh = (await readUsers()).find((u) => u.id === me.id);
  if (fresh) await createSession(fresh);
  await mutate((db) => audit(db, me.email, "Turned on two-factor login", ""));
  revalidatePath("/admin/account");
  return { ok: true, message: "Two-factor login is on." };
}

export async function disableTwoFactor(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser();
  const users = await readUsers();
  const u = users.find((x) => x.id === me.id);
  if (!u?.totpSecret) return { error: "Two-factor login is already off." };
  if (!verifyTotp(u.totpSecret, String(form.get("code") ?? ""))) return { error: "That code is not correct." };
  u.totpSecret = "";
  await writeUsers(users);
  await mutate((db) => audit(db, me.email, "Turned off two-factor login", ""));
  revalidatePath("/admin/account");
  return { ok: true, message: "Two-factor login is off." };
}

/* ---------- field parsing ---------- */

const isUrl = (v: string) => /^https?:\/\/[^\s]+$/i.test(v);

function parseFields(fields: Field[], form: FormData) {
  const values: Record<string, string | boolean> = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    if (f.type === "boolean") {
      values[f.name] = form.get(f.name) === "on";
      continue;
    }
    const v = String(form.get(f.name) ?? "").trim();
    values[f.name] = v;
    if (f.required && !v) errors[f.name] = `${f.label} is required.`;
    else if (v && f.max && v.length > f.max) errors[f.name] = `Keep this under ${f.max} characters.`;
    else if (v && f.type === "url" && !isUrl(v)) errors[f.name] = "Enter a full web address starting with https://";
    else if (v && f.type === "youtube" && !youtubeId(v)) errors[f.name] = "This is not a valid YouTube link.";
    else if (v && f.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(v)) errors[f.name] = "Enter a valid date.";
    else if (v && f.type === "select" && f.options && !f.options.includes(v)) errors[f.name] = "Choose one of the options.";
    else if (v && (f.type === "image" || f.type === "file") && (!/^\/(images|media)\/[\w\-./]+$/.test(v) || v.includes(".."))) errors[f.name] = "Choose a file from the library or upload one.";
  }
  return { values, errors };
}

/* ---------- collections ---------- */

export async function saveItem(collection: string, id: string, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const def = getCollection(collection);
  if (!def) return { error: "Unknown section." };
  const { values, errors } = parseFields(def.fields, form);
  if (Object.keys(errors).length) return { error: "Please correct the highlighted fields.", fieldErrors: errors, values };

  const result = await mutate((db) => {
    const list = db[def.key] as unknown as Record<string, unknown>[];
    if ("slug" in values) {
      let slug = slugify(String(values.slug || values.title || ""));
      if (!slug) slug = `${def.prefix}-${Date.now()}`;
      if (list.some((x) => x.slug === slug && x.id !== id)) {
        if (collection === "pages") return { fieldErrors: { slug: "Another page already uses this address." } };
        slug = `${slug}-${randomUUID().slice(0, 4)}`;
      }
      values.slug = slug;
    }
    const now = new Date().toISOString();
    if (id === "new") {
      const order = list.reduce((m, x) => Math.max(m, Number(x.order ?? 0)), 0) + 1;
      const item = { id: `${def.prefix}-${randomUUID().slice(0, 8)}`, ...values, order, createdAt: now, updatedAt: now };
      list.push(item);
      audit(db, user.email, `Created ${def.singular.toLowerCase()}`, String(values[def.titleField] ?? ""));
      return { id: item.id };
    }
    const idx = list.findIndex((x) => x.id === id);
    if (idx < 0) return { error: "This item no longer exists." };
    list[idx] = { ...list[idx], ...values, updatedAt: now };
    audit(db, user.email, `Edited ${def.singular.toLowerCase()}`, String(values[def.titleField] ?? ""));
    return { id };
  });
  if ("error" in result || "fieldErrors" in result)
    return { error: (result as FormState).error ?? "Please correct the highlighted fields.", fieldErrors: (result as FormState).fieldErrors, values };
  refresh();
  redirect(`/admin/c/${collection}?saved=1`);
}

export async function deleteItem(collection: string, id: string) {
  const user = await requireUser();
  const def = getCollection(collection);
  if (!def) return;
  await mutate((db) => {
    const list = db[def.key] as unknown as Record<string, unknown>[];
    const item = list.find((x) => x.id === id);
    if (!item) return;
    (db as unknown as Record<string, unknown>)[def.key] = list.filter((x) => x.id !== id);
    audit(db, user.email, `Deleted ${def.singular.toLowerCase()}`, String(item[def.titleField] ?? ""));
  });
  refresh();
  redirect(`/admin/c/${collection}?deleted=1`);
}

export async function moveItem(collection: string, id: string, dir: -1 | 1) {
  const user = await requireUser();
  const def = getCollection(collection);
  if (!def) return;
  await mutate((db) => {
    const list = [...(db[def.key] as unknown as { id: string; order?: number }[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    list.forEach((x, k) => (x.order = k + 1));
    audit(db, user.email, `Reordered ${def.label.toLowerCase()}`, String((list[j] as Record<string, unknown>)[def.titleField] ?? ""));
  });
  refresh();
}

/* ---------- settings ---------- */

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const fields = SETTINGS_FIELDS.flatMap((s) => s.fields);
  const { values, errors } = parseFields(fields, form);
  if (Object.keys(errors).length) return { error: "Please correct the highlighted fields.", fieldErrors: errors, values };
  await mutate((db) => {
    db.settings = { ...db.settings, ...(values as Partial<DB["settings"]>) };
    audit(db, user.email, "Updated site settings", "");
  });
  refresh();
  return { ok: true, message: "Settings saved." };
}

/* ---------- media ---------- */

const ALLOWED: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: ".jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 },
  "image/png": { ext: ".png", magic: (b) => b.subarray(0, 4).toString("hex") === "89504e47" },
  "image/webp": { ext: ".webp", magic: (b) => b.subarray(8, 12).toString() === "WEBP" },
  "image/gif": { ext: ".gif", magic: (b) => b.subarray(0, 3).toString() === "GIF" },
  "application/pdf": { ext: ".pdf", magic: (b) => b.subarray(0, 4).toString() === "%PDF" },
};
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadMedia(form: FormData): Promise<{ url?: string; error?: string }> {
  const user = await requireUser();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload." };
  if (file.size > MAX_BYTES) return { error: "File is larger than 10 MB." };
  const kind = ALLOWED[file.type];
  const buf = Buffer.from(await file.arrayBuffer());
  if (!kind || !kind.magic(buf)) return { error: "Only JPG, PNG, WebP, GIF or PDF files are allowed." };
  const d = new Date();
  const dir = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const name = `${randomUUID()}${kind.ext}`;
  await fs.mkdir(path.join(DATA_DIR, "uploads", dir), { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, "uploads", dir, name), buf);
  const url = `/media/${dir}/${name}`;
  const now = d.toISOString();
  await mutate((db) => {
    db.media.unshift({ id: randomUUID(), url, name: file.name.slice(0, 200), size: file.size, type: file.type, uploadedBy: user.email, createdAt: now, updatedAt: now });
    audit(db, user.email, "Uploaded file", file.name);
  });
  revalidatePath("/admin/media");
  return { url };
}

export async function deleteMedia(id: string, force = false): Promise<{ error?: string; usedIn?: number }> {
  const user = await requireUser();
  const outcome = await mutate((db) => {
    const m = db.media.find((x) => x.id === id);
    if (!m) return { error: "File not found." };
    const { media: _m, audit: _a, ...content } = db;
    const uses = JSON.stringify(content).split(`"${m.url}"`).length - 1;
    if (uses > 0 && !force) return { usedIn: uses };
    db.media = db.media.filter((x) => x.id !== id);
    audit(db, user.email, "Deleted file", m.name);
    return { url: m.url };
  });
  if ("url" in outcome && outcome.url) {
    const file = path.resolve(DATA_DIR, "uploads", outcome.url.replace(/^\/media\//, ""));
    if (file.startsWith(path.join(DATA_DIR, "uploads") + path.sep)) await fs.rm(file, { force: true });
    revalidatePath("/admin/media");
    return {};
  }
  return outcome as { error?: string; usedIn?: number };
}

/* ---------- messages ---------- */

export async function setMessageRead(id: string, read: boolean) {
  await requireUser();
  await mutate((db) => {
    const m = db.messages.find((x) => x.id === id);
    if (m) m.read = read;
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const user = await requireUser();
  await mutate((db) => {
    db.messages = db.messages.filter((x) => x.id !== id);
    audit(db, user.email, "Deleted message", "");
  });
  revalidatePath("/admin/messages");
}

/* ---------- users ---------- */

function passwordProblem(p: string): string | null {
  if (p.length < 12 || p.length > 200) return "Password must be 12 to 200 characters long.";
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  if (kinds < 3) return "Use at least three of: lower case, upper case, numbers and symbols.";
  return null;
}

export async function createUser(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser("admin");
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 160);
  const password = String(form.get("password") ?? "");
  const role = (form.get("role") === "admin" ? "admin" : "editor") as Role;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a name and a valid email." };
  const weak = passwordProblem(password);
  if (weak) return { error: weak };
  const users = await readUsers();
  if (users.some((u) => u.email === email)) return { error: "A user with this email already exists." };
  users.push({ id: randomUUID(), name, email, role, passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
  await writeUsers(users);
  await mutate((db) => audit(db, me.email, `Added ${role}`, email));
  revalidatePath("/admin/users");
  return { ok: true, message: `${name} can now sign in.` };
}

export async function deleteUser(id: string) {
  const me = await requireUser("admin");
  if (id === me.id) return;
  const users = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return;
  if (target.role === "admin" && users.filter((u) => u.role === "admin").length < 2) return;
  await writeUsers(users.filter((u) => u.id !== id));
  await mutate((db) => audit(db, me.email, "Removed user", target.email));
  revalidatePath("/admin/users");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const weak = passwordProblem(next);
  if (weak) return { error: weak };
  if (!(await checkCredentials(me.email, current))) return { error: "Current password is incorrect." };
  const u = await updateUser(me.id, (x) => {
    x.passwordHash = hashPassword(next);
    x.sessionVersion = (x.sessionVersion ?? 0) + 1;
  });
  if (!u) return { error: "Account not found." };
  await createSession(u); // keep this device signed in, end all others
  await mutate((db) => audit(db, me.email, "Changed password", ""));
  return { ok: true, message: "Password changed. You have been signed out on all other devices." };
}
