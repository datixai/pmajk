"use client";

import { useEffect, useState } from "react";
import { CirclePlay, X } from "lucide-react";
import { youtubeEmbed, youtubeId, youtubeThumb } from "@/lib/youtube";

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
}

// YouTube videos load only when clicked (privacy-enhanced youtube-nocookie
// player), so the page stays fast and no tracking happens before a click.
export function VideoGallery({ videos, columns = 3 }: { videos: Video[]; columns?: 2 | 3 }) {
  const [playing, setPlaying] = useState<{ id: string; title: string } | null>(null);
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  const items = videos.map((v) => ({ ...v, yt: youtubeId(v.url) })).filter((v) => v.yt);

  return (
    <>
      <ul className={`grid gap-6 sm:grid-cols-2 ${columns === 3 && items.length > 2 ? "lg:grid-cols-3" : "mx-auto max-w-4xl"}`}>
        {items.map((v) => (
          <li key={v.id}>
            <button type="button" onClick={() => setPlaying({ id: v.yt!, title: v.title })} className="group block w-full text-left" aria-label={`Play video: ${v.title}`}>
              <span className="relative block aspect-video overflow-hidden rounded-2xl bg-pine-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={youtubeThumb(v.yt!)} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-white/95 text-chinar shadow-xl transition group-hover:scale-110 group-hover:bg-saffron group-hover:text-pine-950">
                    <CirclePlay className="size-8" />
                  </span>
                </span>
              </span>
              <span className="mt-3 block font-semibold text-pine-900 group-hover:text-pine-600">{v.title}</span>
              {v.description && <span className="mt-1 block text-sm text-muted">{v.description}</span>}
            </button>
          </li>
        ))}
      </ul>
      {playing && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4 animate-in fade-in" role="dialog" aria-modal="true" aria-label={playing.title}>
          <button type="button" className="absolute inset-0" aria-label="Close video" onClick={() => setPlaying(null)} />
          <div className="relative w-full max-w-5xl">
            <button type="button" onClick={() => setPlaying(null)} aria-label="Close video" className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-6" />
            </button>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe
                src={youtubeEmbed(playing.id)}
                title={playing.title}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p className="mt-3 text-white/85">{playing.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
