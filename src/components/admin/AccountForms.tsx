"use client";

import { useActionState, useState, useTransition } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { changePassword, createUser, disableTwoFactor, enableTwoFactor, startTwoFactor, type FormState } from "@/app/admin/actions";

const input = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";
const btn = "inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60";

function Status({ state }: { state: FormState }) {
  if (state.error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</p>;
  if (state.ok) return <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{state.message}</p>;
  return null;
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block text-sm font-semibold">
        Current password
        <input name="current" type="password" required autoComplete="current-password" className={input} />
      </label>
      <label className="block text-sm font-semibold">
        New password
        <input name="next" type="password" required minLength={12} autoComplete="new-password" className={input} />
      </label>
      <Status state={state} />
      <button disabled={pending} className={btn}>
        {pending && <LoaderCircle className="size-4 animate-spin" />} Change password
      </button>
    </form>
  );
}

export function NewUserForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createUser, {});
  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block text-sm font-semibold">
        Full name
        <input name="name" required maxLength={120} className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Temporary password
        <input name="password" type="password" required minLength={12} autoComplete="new-password" className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Role
        <select name="role" className={input} defaultValue="editor">
          <option value="editor">Editor (content only)</option>
          <option value="admin">Administrator (everything)</option>
        </select>
      </label>
      <Status state={state} />
      <button disabled={pending} className={btn}>
        {pending && <LoaderCircle className="size-4 animate-spin" />} Add user
      </button>
    </form>
  );
}

export function TwoFactorPanel({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null);
  const [loading, start] = useTransition();
  const [enState, enAction, enPending] = useActionState<FormState, FormData>(enableTwoFactor, {});
  const [disState, disAction, disPending] = useActionState<FormState, FormData>(disableTwoFactor, {});

  if (enabled || enState.ok)
    return (
      <div className="mt-5 space-y-4">
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <ShieldCheck className="size-5" /> Two-factor login is on
        </p>
        {!disState.ok && (
          <form action={disAction} className="space-y-3">
            <label className="block text-sm font-semibold">
              To turn it off, enter a current code
              <input name="code" inputMode="numeric" pattern="\d{6}" maxLength={6} required className={`${input} font-mono tracking-widest`} />
            </label>
            <Status state={disState} />
            <button disabled={disPending} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">
              Turn off
            </button>
          </form>
        )}
        {disState.ok && <Status state={disState} />}
      </div>
    );

  if (!setup)
    return (
      <button type="button" disabled={loading} onClick={() => start(async () => setSetup(await startTwoFactor()))} className={`${btn} mt-5`}>
        {loading && <LoaderCircle className="size-4 animate-spin" />} Set up two-factor login
      </button>
    );

  return (
    <form action={enAction} className="mt-5 space-y-4">
      <input type="hidden" name="secret" value={setup.secret} />
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Open Google Authenticator or Microsoft Authenticator and add an account.</li>
        <li>Scan this QR code, or type the key below.</li>
        <li>Enter the 6-digit code the app shows.</li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={setup.qr} alt="QR code for your authenticator app" width={180} height={180} className="rounded-xl border border-slate-200" />
      <p className="break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs">{setup.secret.match(/.{1,4}/g)?.join(" ")}</p>
      <label className="block text-sm font-semibold">
        Code from the app
        <input name="code" inputMode="numeric" pattern="\d{6}" maxLength={6} required autoFocus className={`${input} font-mono tracking-widest`} />
      </label>
      <Status state={enState} />
      <button disabled={enPending} className={btn}>
        {enPending && <LoaderCircle className="size-4 animate-spin" />} Turn on
      </button>
    </form>
  );
}
