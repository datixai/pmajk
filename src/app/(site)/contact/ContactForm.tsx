"use client";

import { useActionState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { sendMessage, type ContactState } from "./actions";

const field = "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-pine-500";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false });
  if (state.ok)
    return (
      <div className="rounded-3xl bg-pine-50 p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-pine-700 text-white">
          <Check className="size-7" />
        </span>
        <p className="mt-5 font-display text-2xl font-semibold text-pine-900">Thank you</p>
        <p className="mt-2 text-muted">Your message has been received by the Prime Minister&apos;s Secretariat.</p>
      </div>
    );
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="text-sm font-semibold text-pine-900">
        Full name *
        <input name="name" required maxLength={120} className={field} />
      </label>
      <label className="text-sm font-semibold text-pine-900">
        Email
        <input name="email" type="email" maxLength={160} className={field} />
      </label>
      <label className="text-sm font-semibold text-pine-900">
        Phone
        <input name="phone" type="tel" maxLength={40} className={field} />
      </label>
      <label className="text-sm font-semibold text-pine-900">
        Subject
        <input name="subject" maxLength={160} className={field} />
      </label>
      <label className="text-sm font-semibold text-pine-900 sm:col-span-2">
        Message *
        <textarea name="message" required rows={6} maxLength={4000} className={field} />
      </label>
      {state.error && <p className="text-sm font-semibold text-chinar sm:col-span-2">{state.error}</p>}
      <div className="sm:col-span-2">
        <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-pine-900 px-7 py-3.5 font-semibold text-white transition hover:bg-pine-800 disabled:opacity-60">
          {pending && <LoaderCircle className="size-4 animate-spin" />} Send message
        </button>
      </div>
    </form>
  );
}
