import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { DB } from "./types";

const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

async function walk(dir: string, base: string): Promise<string[]> {
  let out: string[] = [];
  let entries: import("fs").Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const rel = `${base}/${e.name}`;
    if (e.isDirectory()) out = out.concat(await walk(path.join(dir, e.name), rel));
    else if (IMAGE.test(e.name)) out.push(rel);
  }
  return out;
}

/** Files an admin can pick: uploads (images and PDFs) plus the bundled site photos. */
export async function imageLibrary(db: DB) {
  const bundled = await walk(path.join(process.cwd(), "public", "images"), "/images");
  return [
    ...db.media.filter((m) => m.type.startsWith("image/") || m.type === "application/pdf").map((m) => ({ url: m.url, name: m.name })),
    ...bundled.filter((u) => !u.startsWith("/images/flags/")).map((u) => ({ url: u, name: u.replace(/^\/images\//, "") })),
  ];
}
