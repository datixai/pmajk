"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { mutate } from "@/lib/store";

export type ContactState = { ok: boolean; error?: string };

const recent = new Map<string, number[]>();

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  if (form.get("website")) return { ok: true }; // honeypot: bots fill hidden fields
  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const name = get("name", 120);
  const email = get("email", 160);
  const phone = get("phone", 40);
  const subject = get("subject", 160);
  const message = get("message", 4000);
  if (!name || !message) return { ok: false, error: "Please enter your name and message." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!email && !phone) return { ok: false, error: "Please give an email address or phone number so we can reply." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) return { ok: false, error: "Too many messages. Please try again later." };
  recent.set(ip, [...hits, now]);

  const at = new Date().toISOString();
  try {
    await mutate((db) => {
      db.messages.unshift({ id: randomUUID(), name, email, phone, subject, message, read: false, createdAt: at, updatedAt: at });
    });
  } catch {
    return { ok: false, error: "Messages cannot be sent from this demo. Please use the email address or phone number on this page." };
  }
  return { ok: true };
}
