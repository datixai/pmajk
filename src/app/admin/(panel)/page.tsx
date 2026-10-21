import Link from "next/link";
import { Plus, ShieldAlert } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { byDateDesc, readDB } from "@/lib/store";
import { COLLECTIONS } from "@/lib/schema";
import { formatDate } from "@/lib/markdown";
import { PageHeader } from "@/components/admin/AdminNav";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  const { denied } = await searchParams;
  const db = await readDB();
  const news = byDateDesc(db.news).slice(0, 6);
  const tiles = [
    ["Press releases", db.news.length, "/admin/c/news"],
    ["Unread messages", db.messages.filter((m) => !m.read).length, "/admin/messages"],
    ["Gallery photos", db.gallery.length, "/admin/c/gallery"],
    ["Cabinet members", db.cabinet.length, "/admin/c/cabinet"],
  ] as const;
  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name}`}
        text="Manage everything on the public website from here."
        action={
          <Link href="/admin/c/news/new" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">
            <Plus className="size-4" /> Add press release
          </Link>
        }
      />
      <div className="space-y-8 p-6 lg:p-10">
        {denied && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">That page is for administrators only.</p>}
        {!user.twoFactor && (
          <Link href="/admin/account" className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100">
            <ShieldAlert className="size-5 shrink-0" />
            <span>
              <b>Protect your account:</b> turn on two-factor login so a stolen password alone cannot open the admin panel.
            </span>
          </Link>
        )}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map(([l, n, h]) => (
            <Link key={l} href={h} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-600">
              <p className="text-sm text-slate-500">{l}</p>
              <p className="mt-1 text-3xl font-bold">{n}</p>
            </Link>
          ))}
        </div>
        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white">
            <h2 className="border-b border-slate-200 px-5 py-4 font-semibold">Latest press releases</h2>
            <ul className="divide-y divide-slate-100">
              {news.map((n) => (
                <li key={n.id}>
                  <Link href={`/admin/c/news/${n.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50">
                    <span className="line-clamp-1 text-sm">{n.title}</span>
                    <span className="shrink-0 text-xs text-slate-500">{formatDate(n.date, { day: "numeric", month: "short", year: "numeric" })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white">
            <h2 className="border-b border-slate-200 px-5 py-4 font-semibold">Recent activity</h2>
            <ul className="divide-y divide-slate-100 text-sm">
              {db.audit.slice(0, 8).map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <span className="font-medium">{a.action}</span> {a.target && <span className="text-slate-500">{a.target.slice(0, 60)}</span>}
                  <span className="block text-xs text-slate-400">
                    {a.user}, {new Date(a.at).toLocaleString("en-GB")}
                  </span>
                </li>
              ))}
              {!db.audit.length && <li className="px-5 py-3 text-slate-500">No activity yet.</li>}
            </ul>
          </section>
        </div>
        <section>
          <h2 className="mb-3 font-semibold">All sections</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <Link key={c.key} href={`/admin/c/${c.key}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-600">
                <p className="font-semibold">{c.label}</p>
                <p className="mt-1 text-xs text-slate-500">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
