import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { PageHeader } from "@/components/admin/AdminNav";

export default async function AuditPage() {
  await requireUser();
  const db = await readDB();
  return (
    <>
      <PageHeader title="Activity log" text="Every sign-in, failed sign-in and change made in the admin panel (last 500 entries)." />
      <div className="p-6 lg:p-10">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Item / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {db.audit.map((a) => (
                <tr key={a.id} className={a.action.startsWith("Failed") ? "bg-red-50/60" : ""}>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{new Date(a.at).toLocaleString("en-GB")}</td>
                  <td className="px-4 py-2.5">{a.user}</td>
                  <td className="px-4 py-2.5 font-medium">{a.action}</td>
                  <td className="max-w-md truncate px-4 py-2.5 text-slate-500">{a.target}</td>
                </tr>
              ))}
              {!db.audit.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    No activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
