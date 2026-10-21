import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { readDB } from "@/lib/store";
import { RichText } from "@/lib/markdown";
import { PageHero } from "@/components/site/SiteFooter";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await readDB()).pages.find((p) => p.slug === slug);
  return page ? { title: page.title, description: page.subtitle } : {};
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const db = await readDB();
  const page = db.pages.find((p) => p.slug === slug);
  if (!page) {
    // Press releases of the old website lived at the root of the site.
    const moved = db.news.find((n) => n.published && n.oldSlugs?.includes(slug));
    if (moved) permanentRedirect(`/newsroom/${moved.slug}`);
    notFound();
  }
  const headings = page.body
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));

  return (
    <>
      <PageHero eyebrow={slug === "kashmir-cause" ? "Identity and struggle" : "Azad Jammu & Kashmir"} title={page.title} text={page.subtitle} image={page.heroImage} />
      <div className="bg-ivory">
        <div className="container-pm grid gap-12 py-16 lg:grid-cols-[250px_1fr] lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {headings.length > 1 && (
              <nav aria-label="On this page" className="rounded-2xl border border-line bg-paper p-5">
                <p className="eyebrow text-gold-600">On this page</p>
                <ol className="mt-3 space-y-2 text-sm text-pine-900">
                  {headings.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
          <article className="max-w-3xl">
            <RichText text={page.body} className="prose-pm" />
            {page.source && (
              <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
                Source: <span className="font-semibold text-pine-900">{page.source}</span>
              </p>
            )}
          </article>
        </div>
      </div>
    </>
  );
}
