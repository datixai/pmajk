import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { DB, AuditEntry } from "./types";

// File-based content store. Good for a local demo and small deployments; swap
// this module for a database (e.g. PostgreSQL) without touching the pages.
export const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT = path.join(DATA_DIR, "content.json");
const SEED = path.join(DATA_DIR, "seed.json");

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(CONTENT, "utf8")) as DB;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const seed = await fs.readFile(SEED, "utf8");
    try {
      await fs.writeFile(CONTENT, seed, "utf8");
    } catch {
      // Read-only hosting (e.g. Vercel): serve the seed content as is.
    }
    return JSON.parse(seed) as DB;
  }
}

async function save(db: DB) {
  if (process.env.VERCEL) throw new Error("Saving is disabled on this demo deployment. Run the site locally to edit content.");
  const tmp = `${CONTENT}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 1), "utf8");
  await fs.rename(tmp, CONTENT);
}

export async function readDB(): Promise<DB> {
  await queue.catch(() => {});
  return load();
}

/** Runs fn on a fresh copy of the data and saves it. Calls are serialised. */
export function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await save(db);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

export function audit(db: DB, user: string, action: string, target: string) {
  const entry: AuditEntry = { id: randomUUID(), at: new Date().toISOString(), user, action, target };
  db.audit.unshift(entry);
  db.audit = db.audit.slice(0, 500);
}

export function byOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function byDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
