import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { byOrder, readDB } from "@/lib/store";
import { RichText } from "@/lib/markdown";
import { Ornament, SectionHeading } from "@/components/site/ChinarLeaf";
import { PageHero } from "@/components/site/SiteFooter";

export const metadata: Metadata = { title: "AJK at a Glance", description: "Key facts, figures and the history of the Azad Government of the State of Jammu & Kashmir." };

export default async function GlancePage() {
  const db = await readDB();
  const page = db.pages.find((p) => p.slug === "ajk-at-a-glance");
  const stats = byOrder(db.stats);
  const timeline = byOrder(db.timeline);

  return (
    <>
      <PageHero eyebrow="Azad Jammu & Kashmir" title={page?.title ?? "AJK at a Glance"} text={page?.subtitle} image={page?.heroImage || "/images/site/muzaffarabad-city.jpg"} />

      <section className="bg-ivory py-16 sm:py-20">
        <div className="container-pm">
          <p className="mx-auto max-w-4xl text-center font-display text-xl leading-relaxed text-pine-900 sm:text-2xl sm:leading-relaxed">{db.settings.glanceIntro}</p>
          <Ornament className="mt-8" />
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.id} className="bg-ivory px-5 py-8 text-center">
                <dd className="font-display text-4xl text-pine-900 sm:text-5xl">
                  {s.value}
                  {s.unit && <span className="ml-1.5 text-base text-gold-600">{s.unit}</span>}
                </dd>
                <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                {s.note && <p className="mt-1 text-xs text-muted/80">{s.note}</p>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {page && (
        <section className="bg-paper py-16 sm:py-24">
          <div className="container-pm">
            <div className="mx-auto max-w-3xl">
              <RichText text={page.body} className="prose-pm" />
              {page.source && <p className="mt-12 border-t border-line pt-6 text-sm text-muted">Source: {page.source}</p>}
            </div>
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="bg-pine-950 py-20 text-white sm:py-28">
          <div className="container-pm">
            <SectionHeading tone="dark" eyebrow="Milestones" title="The story of Jammu & Kashmir" />
            <ol className="relative mx-auto max-w-3xl border-l border-gold/40 pl-8">
              {timeline.map((t) => (
                <li key={t.id} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[41px] top-1 grid size-5 place-items-center rounded-full border border-gold bg-pine-950" aria-hidden="true">
                    <span className="size-2 rounded-full bg-gold" />
                  </span>
                  <p className="font-display text-2xl text-gold-300">{t.year}</p>
                  <p className="mt-1 text-lg font-semibold">{t.title}</p>
                  <p className="mt-2 leading-relaxed text-white/75">{t.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-14 text-center">
              <Link href="/kashmir-cause" className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-pine-975 hover:bg-gold-300">
                The Kashmir Cause <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
