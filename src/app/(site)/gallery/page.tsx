import type { Metadata } from "next";
import Link from "next/link";
import { byDateDesc, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { PhotoGrid } from "@/components/site/Lightbox";

export const metadata: Metadata = { title: "Photo Gallery", description: "Photos of the engagements and events of the Prime Minister's Office, Azad Jammu & Kashmir." };

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ album?: string }> }) {
  const sp = await searchParams;
  const db = await readDB();
  const all = byDateDesc(db.gallery);
  const albums = [...new Set(all.map((g) => g.album))];
  const album = albums.includes(sp.album ?? "") ? sp.album! : albums[0];
  const photos = all.filter((g) => g.album === album).map(({ id, title, image, date }) => ({ id, title, image, date }));
  const count = (a: string) => all.filter((g) => g.album === a).length;

  return (
    <>
      <PageHero eyebrow="In pictures" title="Photo Gallery" text="Meetings, ceremonies and visits of the Prime Minister's Office, by album." image="/images/site/hero-banjosa-lake.jpg" />
      <section className="bg-paper py-14 sm:py-20">
        <div className="container-pm">
          <nav aria-label="Albums" className="mb-10 flex flex-wrap justify-center gap-2">
            {albums.map((a) => (
              <Link key={a} href={`/gallery?album=${encodeURIComponent(a)}`} aria-current={a === album ? "page" : undefined} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${a === album ? "bg-pine-900 text-white" : "bg-ivory text-pine-900 ring-1 ring-line hover:ring-pine-500"}`}>
                {a} <span className="ml-1 opacity-60">{count(a)}</span>
              </Link>
            ))}
          </nav>
          {photos.length ? <PhotoGrid photos={photos} /> : <p className="py-16 text-center text-muted">No photos yet.</p>}
        </div>
      </section>
    </>
  );
}
