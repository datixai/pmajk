import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { excerpt, formatDate } from "@/lib/markdown";
import { PageHero } from "@/components/site/SiteFooter";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase().slice(0, 100);
  const db = await readDB();
  const has = (s: string) => s.toLowerCase().includes(term);
  const results: { href: string; kind: string; title: string; text: string }[] = [];
  if (term) {
    for (const p of db.pages.filter((p) => has(`${p.title} ${p.body}`))) results.push({ href: `/${p.slug}`, kind: "Page", title: p.title, text: excerpt(p.body, 200) });
    for (const n of byDateDesc(db.news.filter((n) => n.published && has(`${n.title} ${n.body} ${n.location}`))))
      results.push({ href: `/newsroom/${n.slug}`, kind: `Press release, ${formatDate(n.date)}`, title: n.title, text: excerpt(n.body, 200) });
    for (const c of db.cabinet.filter((c) => has(`${c.name} ${c.portfolio}`))) results.push({ href: "/cabinet", kind: "Cabinet", title: c.name, text: c.portfolio || c.rank });
    for (const o of db.office.filter((o) => has(`${o.name} ${o.designation} ${o.section}`))) results.push({ href: "/pm-office", kind: "PM Office", title: o.name || o.designation, text: `${o.designation}, ${o.section}` });
    for (const f of db.formerPms.filter((f) => has(`${f.name} ${f.party}`))) results.push({ href: "/prime-minister#former", kind: "Former Prime Minister", title: f.name, text: `${f.from} to ${f.to}` });
    for (const n of db.notices.filter((n) => has(`${n.title} ${n.summary}`))) results.push({ href: "/notifications", kind: "Notification", title: n.title, text: n.summary });
  }

  return (
    <>
      <PageHero eyebrow="Search" title="Search the website" />
      <section className="bg-paper py-14">
        <div className="container-pm max-w-3xl">
          <form action="/search" className="relative">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={q} maxLength={100} placeholder="Press releases, cabinet, officers..." aria-label="Search" className="h-14 w-full rounded-full border border-line bg-ivory pl-14 pr-32 text-lg outline-none focus:border-pine-500" />
            <button className="absolute right-2 top-2 h-10 rounded-full bg-pine-900 px-6 font-semibold text-white hover:bg-pine-800">Search</button>
          </form>
          {term && (
            <p className="mt-6 text-muted">
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>
          )}
          <ul className="mt-6 space-y-4">
            {results.map((r, i) => (
              <li key={`${r.href}-${i}`}>
                <Link href={r.href} className="block rounded-2xl border border-line bg-ivory p-5 hover:border-pine-500">
                  <p className="eyebrow text-gold-600">{r.kind}</p>
                  <p className="mt-1 text-lg font-semibold text-pine-900">{r.title}</p>
                  {r.text && <p className="mt-1 text-sm text-muted">{r.text}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
