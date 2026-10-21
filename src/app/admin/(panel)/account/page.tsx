import { LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/AdminNav";
import { ChangePasswordForm, TwoFactorPanel } from "@/components/admin/AccountForms";
import { signOutEverywhere } from "../../actions";

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageHeader title="My account" text={`${me.name} · ${me.email} · ${me.role}`} />
      <div className="grid max-w-5xl gap-8 p-6 lg:grid-cols-2 lg:p-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Two-factor login</h2>
          <p className="mt-1 text-sm text-slate-500">
            After your password, you also enter a 6-digit code from an authenticator app (Google or Microsoft Authenticator) on your phone. A stolen password alone is then not enough.
          </p>
          <TwoFactorPanel enabled={me.twoFactor} />
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Change password</h2>
          <p className="mt-1 text-sm text-slate-500">At least 12 characters, using three of: lower case, upper case, numbers and symbols.</p>
          <ChangePasswordForm />
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Sign out on all devices</h2>
          <p className="mt-1 text-sm text-slate-500">Use this if you signed in on a shared computer or think someone else may have access to your account.</p>
          <form action={signOutEverywhere} className="mt-4">
            <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700 hover:bg-red-50">
              <LogOut className="size-4" /> Sign out everywhere
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
