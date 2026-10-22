import type { Metadata } from "next";
import { Suspense } from "react";
import { byDateDesc, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { NewsList, NewsView } from "@/components/site/NewsList";

export const metadata: Metadata = { title: "Newsroom", description: "Press releases and statements from the Prime Minister's Office, Azad Jammu & Kashmir." };

export default async function Newsroom() {
  const db = await readDB();
  const items = byDateDesc(db.news.filter((n) => n.published));
  return (
    <>
      <PageHero eyebrow="Newsroom" title="Press Releases" text="Statements, meetings and announcements from the Prime Minister's Office." image="/images/site/hero-neelum-valley.jpg" />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-pm">
          <Suspense fallback={<NewsView items={items} />}>
            <NewsList items={items} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
