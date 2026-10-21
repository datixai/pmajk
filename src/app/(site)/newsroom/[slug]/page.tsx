import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { excerpt, formatDate, RichText } from "@/lib/markdown";
import { Ornament } from "@/components/site/ChinarLeaf";
import { Img } from "@/components/site/Img";
import { NewsCard } from "@/components/site/NewsCard";
import { ShareButtons } from "@/components/site/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (await readDB()).news.find((x) => x.slug === slug && x.published);
  return n ? { title: n.title, description: excerpt(n.body, 160), openGraph: { title: n.title, type: "article", ...(n.image ? { images: [n.image] } : {}) } } : {};
}

export default async function Release({ params }: Props) {
  const { slug } = await params;
  const db = await readDB();
  const published = db.news.filter((n) => n.published);
  const item = published.find((n) => n.slug === slug);
  if (!item) {
    const moved = published.find((n) => n.oldSlugs?.includes(slug));
    if (moved) permanentRedirect(`/newsroom/${moved.slug}`);
    notFound();
  }
  const more = byDateDesc(published.filter((n) => n.id !== item.id)).slice(0, 3);

  return (
    <>
      <section className="bg-pine-975 pb-14 pt-40 text-center text-white sm:pt-48">
        <div className="container-pm flex flex-col items-center">
          <Link href="/newsroom" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> Newsroom
          </Link>
          <h1 className="mt-6 max-w-4xl font-display text-3xl font-medium leading-tight sm:text-5xl">{item.title}</h1>
          <Ornament className="mt-6" tone="dark" />
          <p className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
            {item.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-gold" /> {item.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> <time dateTime={item.date}>{formatDate(item.date)}</time>
            </span>
          </p>
        </div>
      </section>
      <article className="bg-ivory pb-20">
        {item.image && (
          <div className="container-pm -mb-4 pt-10">
            <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl bg-pine-900 shadow-xl">
              <Img src={item.image} alt="" fill priority sizes="(min-width:1024px) 900px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className="container-pm pt-14">
          <div className="mx-auto max-w-3xl">
            <RichText text={item.body} className="prose-pm drop-cap" />
            <div className="mt-12 border-t border-line pt-6">
              <ShareButtons title={item.title} />
            </div>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-paper py-16 sm:py-20">
          <div className="container-pm">
            <h2 className="text-center font-display text-3xl text-pine-900">More from the Newsroom</h2>
            <Ornament className="mb-10 mt-5" />
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((n) => (
                <li key={n.id}>
                  <NewsCard item={n} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
