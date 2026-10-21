import type { Metadata } from "next";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { byOrder, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { VideoGallery } from "@/components/site/VideoGallery";

export const metadata: Metadata = { title: "Videos", description: "Speeches and events of the Prime Minister of Azad Jammu & Kashmir on video." };

export default async function VideosPage() {
  const db = await readDB();
  const videos = byOrder(db.videos);
  const channel = db.settings.youtube;
  return (
    <>
      <PageHero eyebrow="Newsroom" title="Videos" text="Speeches, addresses and events of the Prime Minister's Office." image="/images/site/hero-arang-kel.jpg" />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-pm">
          {videos.length > 0 && <VideoGallery videos={videos} />}
          <div className={`mx-auto max-w-2xl rounded-3xl bg-pine-900 p-10 text-center text-white ${videos.length ? "mt-16" : ""}`}>
            <CirclePlay className="mx-auto size-12 text-gold" />
            <h2 className="mt-5 font-display text-3xl">{videos.length ? "More on YouTube" : "Watch on YouTube"}</h2>
            <p className="mt-3 text-white/75">The official YouTube channel of the Prime Minister&apos;s Office carries speeches, press talks and coverage of events.</p>
            {channel && (
              <a href={channel} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-pine-975 hover:bg-gold-300">
                Open the channel <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
