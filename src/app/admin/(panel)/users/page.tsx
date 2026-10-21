import { ShieldCheck, ShieldOff } from "lucide-react";
import { readUsers, requireUser, toPublic } from "@/lib/auth";
import { PageHeader } from "@/components/admin/AdminNav";
import { ConfirmButton } from "@/components/admin/Buttons";
import { NewUserForm } from "@/components/admin/AccountForms";
import { deleteUser } from "../../actions";

export default async function UsersPage() {
  const me = await requireUser("admin");
  const users = (await readUsers()).map(toPublic);
  const admins = users.filter((u) => u.role === "admin").length;
  return (
    <>
      <PageHeader title="Users & roles" text="Administrators can manage everything, including users. Editors can manage content but not users." />
      <div className="grid gap-8 p-6 lg:p-10 xl:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {u.name} {u.id === me.id && <span className="text-xs font-normal text-slate-500">(you)</span>}
                  </p>
                  <p className="truncate text-sm text-slate-500">{u.email}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${u.role === "admin" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>{u.role}</span>
                    {u.twoFactor ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="size-3.5" /> 2FA on
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <ShieldOff className="size-3.5" /> 2FA off
                      </span>
                    )}
                    {u.lastLoginAt && <span className="text-slate-400">Last sign-in {new Date(u.lastLoginAt).toLocaleString("en-GB")}</span>}
                  </p>
                </div>
                {u.id !== me.id && !(u.role === "admin" && admins < 2) && (
                  <ConfirmButton action={deleteUser.bind(null, u.id)} label="Remove" confirmText={`Remove ${u.email}? They will be signed out immediately.`} />
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Add a user</h2>
          <p className="mt-1 text-sm text-slate-500">Share the temporary password privately. Ask them to change it and turn on two-factor login.</p>
          <NewUserForm />
        </div>
      </div>
    </>
  );
}
