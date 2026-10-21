import type { Metadata } from "next";
import Link from "next/link";
import { byDateDesc, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { NewsCard } from "@/components/site/NewsCard";

export const metadata: Metadata = { title: "Newsroom", description: "Press releases and statements from the Prime Minister's Office, Azad Jammu & Kashmir." };

const PER_PAGE = 12;

export default async function Newsroom({ searchParams }: { searchParams: Promise<{ year?: string; page?: string }> }) {
  const sp = await searchParams;
  const db = await readDB();
  const all = byDateDesc(db.news.filter((n) => n.published));
  const years = [...new Set(all.map((n) => n.date.slice(0, 4)))];
  const year = years.includes(sp.year ?? "") ? sp.year : undefined;
  const list = year ? all.filter((n) => n.date.startsWith(year)) : all;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const items = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const chip = (on: boolean) => `rounded-full px-5 py-2 text-sm font-semibold transition ${on ? "bg-pine-900 text-white" : "bg-ivory text-pine-900 ring-1 ring-line hover:ring-pine-500"}`;

  return (
    <>
      <PageHero eyebrow="Newsroom" title="Press Releases" text="Statements, meetings and announcements from the Prime Minister's Office." image="/images/site/hero-neelum-valley.jpg" />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-pm">
          {years.length > 1 && (
            <nav aria-label="Filter by year" className="mb-10 flex flex-wrap justify-center gap-2">
              <Link href="/newsroom" className={chip(!year)}>
                All
              </Link>
              {years.map((y) => (
                <Link key={y} href={`/newsroom?year=${y}`} className={chip(year === y)}>
                  {y}
                </Link>
              ))}
            </nav>
          )}
          {items.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <li key={n.id}>
                  <NewsCard item={n} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center text-muted">No press releases yet.</p>
          )}
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, k) => k + 1).map((p) => (
                <Link key={p} href={`/newsroom?${new URLSearchParams({ ...(year ? { year } : {}), page: String(p) })}`} aria-current={p === page ? "page" : undefined} className={`grid size-10 place-items-center rounded-full text-sm font-semibold ${p === page ? "bg-pine-900 text-white" : "bg-ivory ring-1 ring-line"}`}>
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
