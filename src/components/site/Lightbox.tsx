"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Img } from "./Img";

interface Photo {
  id: string;
  title: string;
  image: string;
  date: string;
}

const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Photo grid that opens a full-screen viewer; arrow keys move, Escape closes. */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const p = open === null ? null : photos[open];
  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3">
        {photos.map((ph, i) => (
          <li key={ph.id} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-pine-900" aria-label={`Open photo: ${ph.title}`}>
              <Img src={ph.image} alt={ph.title} width={600} height={400} sizes="(min-width:1024px) 25vw, 50vw" className="h-auto w-full transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 text-left text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">{ph.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {p && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-[#040806]" role="dialog" aria-modal="true" aria-label={p.title}>
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white/80">
            <p className="text-sm">
              {open! + 1} / {photos.length}
            </p>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="grid size-11 place-items-center rounded-full hover:bg-white/10">
              <X className="size-6" />
            </button>
          </div>
          <div className="relative flex-1">
            <Img key={p.id} src={p.image} alt={p.title} fill sizes="100vw" className="object-contain" />
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
              <ChevronLeft className="size-7" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
              <ChevronRight className="size-7" />
            </button>
          </div>
          <div className="px-4 py-5 text-center">
            <p className="font-display text-lg text-white">{p.title}</p>
            <p className="mt-1 text-xs text-white/60">{fmt(p.date)}</p>
          </div>
        </div>
      )}
    </>
  );
}
