"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { NewsItem } from "@/lib/types";
import { NewsCard } from "./NewsCard";

const PER_PAGE = 12;

/** Year filter and pages for the Newsroom, read in the browser so the page stays static. */
export function NewsList({ items }: { items: NewsItem[] }) {
  const sp = useSearchParams();
  return <NewsView items={items} wanted={sp.get("year") ?? ""} pageParam={sp.get("page") ?? ""} />;
}

/** The list for a given filter; also the static first paint before the address is read. */
export function NewsView({ items, wanted = "", pageParam = "" }: { items: NewsItem[]; wanted?: string; pageParam?: string }) {
  const years = [...new Set(items.map((n) => n.date.slice(0, 4)))];
  const year = years.includes(wanted) ? wanted : undefined;
  const list = year ? items.filter((n) => n.date.startsWith(year)) : items;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(pageParam) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const chip = (on: boolean) => `rounded-full px-5 py-2 text-sm font-semibold transition ${on ? "bg-pine-900 text-white" : "bg-ivory text-pine-900 ring-1 ring-line hover:ring-pine-500"}`;

  return (
    <>
      {years.length > 1 && (
        <nav aria-label="Filter by year" className="mb-10 flex flex-wrap justify-center gap-2">
          <Link href="/newsroom" scroll={false} className={chip(!year)}>
            All
          </Link>
          {years.map((y) => (
            <Link key={y} href={`/newsroom?year=${y}`} scroll={false} className={chip(year === y)}>
              {y}
            </Link>
          ))}
        </nav>
      )}
      {shown.length ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((n) => (
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
    </>
  );
}
