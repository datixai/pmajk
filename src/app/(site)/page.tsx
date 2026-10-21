import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Eye, MessageSquareText, Quote } from "lucide-react";
import { byDateDesc, byOrder, readDB } from "@/lib/store";
import { excerpt, formatDate } from "@/lib/markdown";
import { HeroBackdrops } from "@/components/home/HeroBackdrops";
import { Ornament, SectionHeading } from "@/components/site/ChinarLeaf";
import { Img } from "@/components/site/Img";
import { NewsCard, NewsVisual } from "@/components/site/NewsCard";
import { Portrait } from "@/components/site/Portrait";
import { PriorityIcon } from "@/components/site/icons";
import { SocialLinks } from "@/components/site/SiteFooter";

const btnGold = "inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-pine-975 shadow-lg shadow-black/20 transition hover:bg-gold-300";
const btnGhost = "inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10";
const linkMore = "inline-flex items-center gap-2 rounded-full border border-pine-900/20 px-6 py-3 text-sm font-semibold text-pine-900 transition hover:border-pine-700 hover:bg-pine-900 hover:text-white";

export default async function Home() {
  const db = await readDB();
  const s = db.settings;
  const news = byDateDesc(db.news.filter((n) => n.published));
  const lead = news.find((n) => n.featured) ?? news[0];
  const others = news.filter((n) => n !== lead).slice(0, 3);
  const cabinet = byOrder(db.cabinet);
  const photos = byDateDesc(db.gallery.filter((g) => g.featured)).slice(0, 8);
  const fullName = [s.pmHonorific, s.pmName].filter(Boolean).join(" ");

  return (
    <>
      {/* Hero: the Prime Minister */}
      <section className="relative isolate flex min-h-[min(100svh,960px)] items-center overflow-hidden bg-pine-975 pb-20 pt-36 text-white sm:pt-40">
        <HeroBackdrops slides={byOrder(db.hero)} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,rgba(3,23,14,.55),rgba(3,23,14,.92)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-pine-975 to-transparent" />
        <div className="container-pm flex flex-col items-center text-center">
          <div className="relative animate-rise">
            <div className="portrait-halo absolute -inset-16" aria-hidden="true" />
            <div className="absolute -inset-4 rounded-full border border-dashed border-gold/40 animate-slowspin" aria-hidden="true" />
            <Portrait src={s.pmPortrait} name={fullName} size={248} className="relative ring-2 ring-gold shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] max-sm:!size-[200px]" />
          </div>
          <p className="eyebrow mt-10 text-gold-300 animate-rise [animation-delay:120ms]">
            {s.pmOrdinal}
            {s.pmSince && <span className="text-white/60"> &nbsp;|&nbsp; In office since {s.pmSince}</span>}
          </p>
          <h1 className="mt-4 font-display font-medium leading-[1.02] tracking-tight animate-rise [animation-delay:200ms]">
            {s.pmHonorific && <span className="block text-2xl italic text-gold-300 sm:text-3xl">{s.pmHonorific}</span>}
            <span className="block text-5xl sm:text-7xl lg:text-[5.4rem]">{s.pmName}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 animate-rise [animation-delay:280ms] sm:text-xl">{s.pmOffice}</p>
          <Ornament className="mt-7" tone="dark" />
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-rise [animation-delay:360ms]">
            <Link href="/prime-minister" className={btnGold}>
              The Prime Minister <ArrowRight className="size-4" />
            </Link>
            <Link href="/newsroom" className={btnGhost}>
              Latest from the Office
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction, mission and vision */}
      <section className="relative bg-ivory py-20 sm:py-28">
        <div className="container-pm">
          <div className="mx-auto max-w-4xl text-center">
            <Quote className="mx-auto size-9 text-gold" aria-hidden="true" />
            <p className="mt-6 font-display text-2xl font-normal leading-relaxed text-pine-900 sm:text-[1.9rem] sm:leading-[1.5]">{s.pmIntro}</p>
            <Ornament className="mt-8" />
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
            {[
              ["My Mission", s.mission, Compass],
              ["My Vision", s.vision, Eye],
            ].map(([title, text, Icon]) => {
              const I = Icon as typeof Compass;
              return (
                <article key={title as string} className="relative overflow-hidden rounded-3xl border border-line bg-paper p-8 text-center sm:p-10">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-pine-900 text-gold-300">
                    <I className="size-6" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl text-pine-900">{title as string}</h2>
                  <p className="mt-4 leading-relaxed text-muted">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-pm">
          <SectionHeading eyebrow="Agenda for the people" title="The Government's Priorities" text="The commitments the Prime Minister has set out for his government, from justice to jobs." />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {byOrder(db.priorities).map((p, i) => {
              const external = /^https?:/.test(p.link);
              const inner = (
                <>
                  <span className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gold-50 text-gold-600 ring-1 ring-gold/30 transition group-hover:bg-pine-900 group-hover:text-gold-300">
                      <PriorityIcon name={p.icon} className="size-6" />
                    </span>
                    <span className="font-display text-3xl text-pine-900/10">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-6 block font-display text-xl text-pine-900">{p.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">{p.text}</span>
                  {p.link && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700">
                      {external ? "Open" : "Read more"} {external ? <ArrowUpRight className="size-4" /> : <ArrowRight className="size-4 transition group-hover:translate-x-1" />}
                    </span>
                  )}
                </>
              );
              const cls = "group block h-full rounded-3xl border border-line bg-ivory p-7 transition hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl";
              return (
                <li key={p.id}>
                  {!p.link ? (
                    <div className={cls}>{inner}</div>
                  ) : external ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={p.link} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Newsroom */}
      {lead && (
        <section className="bg-ivory py-20 sm:py-28">
          <div className="container-pm">
            <SectionHeading eyebrow="Newsroom" title="From the Prime Minister's Office" />
            <Link href={`/newsroom/${lead.slug}`} className="group grid overflow-hidden rounded-3xl border border-line bg-paper transition hover:shadow-2xl lg:grid-cols-2">
              <NewsVisual item={lead} sizes="(min-width:1024px) 600px, 100vw" className="aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" />
              <span className="flex flex-col justify-center p-8 sm:p-12">
                <span className="eyebrow text-gold-600">
                  Lead story &nbsp;|&nbsp; {lead.location ? `${lead.location}, ` : ""}
                  {formatDate(lead.date)}
                </span>
                <span className="mt-4 font-display text-3xl leading-tight text-pine-900 group-hover:text-pine-600 sm:text-[2.1rem]">{lead.title}</span>
                <span className="mt-4 leading-relaxed text-muted">{excerpt(lead.body, 260)}</span>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-pine-700">
                  Read the full release <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
            {others.length > 0 && (
              <ul className="mt-6 flex flex-wrap justify-center gap-6">
                {others.map((n) => (
                  <li key={n.id} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                    <NewsCard item={n} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-12 text-center">
              <Link href="/newsroom" className={linkMore}>
                All press releases <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* The Kashmir cause */}
      <section className="relative isolate overflow-hidden bg-pine-975 py-24 text-white sm:py-32">
        <Img src="/images/site/hero-sharda.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pine-975 via-pine-975/75 to-pine-975" />
        <div className="container-pm flex flex-col items-center text-center">
          <p className="eyebrow text-gold-300">Azad Jammu &amp; Kashmir</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight sm:text-5xl">{s.causeTitle}</h2>
          <Ornament className="mt-6" tone="dark" />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">{s.causeText}</p>
          {s.causeQuote && (
            <figure className="mt-12 max-w-3xl border-y border-gold/30 py-10">
              <blockquote className="font-display text-2xl italic leading-relaxed text-gold-300 sm:text-3xl">&ldquo;{s.causeQuote}&rdquo;</blockquote>
              <figcaption className="eyebrow mt-5 text-white/60">{s.causeQuoteSource}</figcaption>
            </figure>
          )}
          <Link href="/kashmir-cause" className={`${btnGold} mt-12`}>
            The Kashmir Cause <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Cabinet */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-pm">
          <SectionHeading eyebrow="The executive" title="The AJK Cabinet" text="The Prime Minister leads the Cabinet of the Azad Government of the State of Jammu & Kashmir." />
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10">
            {cabinet.slice(0, 9).map((c) => (
              <li key={c.id} className="flex w-32 flex-col items-center text-center sm:w-36">
                <Portrait src={c.image} name={c.name} size={c.rank === "Prime Minister" ? 128 : 112} />
                <p className="mt-4 text-sm font-semibold leading-snug text-pine-900">{c.name}</p>
                <p className="mt-1 text-xs text-muted">{c.rank === "Prime Minister" ? "Prime Minister" : c.portfolio || "Cabinet Member"}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Link href="/cabinet" className={linkMore}>
              Meet the Cabinet <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="bg-pine-950 py-20 text-white sm:py-28">
          <div className="container-pm">
            <SectionHeading tone="dark" eyebrow="In pictures" title="Photo Gallery" text="Engagements, meetings and events of the Prime Minister's Office." />
            <ul className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
              {photos.map((p, i) => (
                <li key={p.id} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 ? "md:col-span-2" : ""}`}>
                  <Link href={`/gallery?album=${p.album}`} aria-label={p.title} className="absolute inset-0">
                    <Img src={p.image} alt={p.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-4 right-4 line-clamp-2 text-xs font-medium text-white/90">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <Link href="/gallery" className={btnGhost}>
                Open the gallery <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Complaint portal and social */}
      <section className="bg-ivory py-20 sm:py-28">
        <div className="container-pm grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-pine-900 p-8 text-white sm:p-12">
            <div className="bg-chinar-pattern absolute inset-0 opacity-[0.04]" aria-hidden="true" />
            <div className="relative">
              <span className="grid size-14 place-items-center rounded-2xl bg-gold text-pine-975">
                <MessageSquareText className="size-7" />
              </span>
              <h2 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">The Prime Minister Complaint Portal</h2>
              <p className="mt-4 max-w-xl text-white/80">
                Have a problem with any department of the Government of AJK? Register your complaint online. It goes directly to the Prime Minister&apos;s Office.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {s.complaintPortalUrl && (
                  <a href={s.complaintPortalUrl} target="_blank" rel="noopener noreferrer" className={btnGold}>
                    Register a complaint <ArrowUpRight className="size-4" />
                  </a>
                )}
                <Link href="/contact" className={btnGhost}>
                  Contact the Office
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-3xl border border-line bg-paper p-8 sm:p-10">
            <div>
              <p className="eyebrow text-gold-600">Stay informed</p>
              <h2 className="mt-3 font-display text-3xl text-pine-900">Follow the PM Office</h2>
              <p className="mt-3 text-muted">Official updates, speeches and events on social media.</p>
              <div className="mt-6 [&_a]:border-pine-900/15 [&_a]:text-pine-900 [&_a:hover]:border-gold [&_a:hover]:text-gold-600">
                <SocialLinks settings={s} />
              </div>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-8">
              {byOrder(db.stats)
                .slice(0, 4)
                .map((st) => (
                  <div key={st.id}>
                    <dt className="text-xs text-muted">{st.label}</dt>
                    <dd className="font-display text-2xl text-pine-900">
                      {st.value} <span className="text-sm text-muted">{st.unit}</span>
                    </dd>
                  </div>
                ))}
            </dl>
            <Link href="/ajk-at-a-glance" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pine-700">
              AJK at a Glance <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
