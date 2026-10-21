"use client";

import { useActionState } from "react";
import { LoaderCircle, Lock } from "lucide-react";
import { login, type FormState } from "../actions";

const input = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      {!state.needCode && (
      <div>
        <label className="block text-sm font-semibold text-slate-800">
          Email
          <input name="email" type="email" required autoComplete="username" className={input} />
        </label>
        <label className="mt-5 block text-sm font-semibold text-slate-800">
          Password
          <input name="password" type="password" required autoComplete="current-password" className={input} />
        </label>
      </div>
      )}
      {state.needCode && (
        <label className="block text-sm font-semibold text-slate-800">
          Authenticator code
          <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus placeholder="123456" className={`${input} text-center font-mono text-2xl tracking-[0.4em]`} />
          <span className="mt-1.5 block text-xs font-normal text-slate-500">Open your authenticator app and enter the 6-digit code.</span>
        </label>
      )}
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Lock className="size-4" />} {state.needCode ? "Verify" : "Sign in"}
      </button>
      {state.needCode && (
        // A full page load (not client navigation) clears the half-finished sign-in state.
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/admin/login" className="block text-center text-sm text-slate-500 hover:text-slate-800">
          Start again
        </a>
      )}
    </form>
  );
}
