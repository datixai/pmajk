import type { Metadata } from "next";
import { Suspense } from "react";
import { byDateDesc, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { AlbumGallery, AlbumView } from "@/components/site/AlbumGallery";

export const metadata: Metadata = { title: "Photo Gallery", description: "Photos of the engagements and events of the Prime Minister's Office, Azad Jammu & Kashmir." };

export default async function GalleryPage() {
  const db = await readDB();
  const photos = byDateDesc(db.gallery).map(({ id, title, image, date, album }) => ({ id, title, image, date, album }));
  const albums = [...new Set(photos.map((g) => g.album))];

  return (
    <>
      <PageHero eyebrow="In pictures" title="Photo Gallery" text="Meetings, ceremonies and visits of the Prime Minister's Office, by album." image="/images/site/hero-banjosa-lake.jpg" />
      <section className="bg-paper py-14 sm:py-20">
        <div className="container-pm">
          <Suspense fallback={<AlbumView photos={photos} albums={albums} album={albums[0]} />}>
            <AlbumGallery photos={photos} albums={albums} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
