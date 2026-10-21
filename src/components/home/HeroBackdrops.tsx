"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Img } from "@/components/site/Img";

/** Landscape photos that cross-fade slowly behind the hero, with the place name. */
export function HeroBackdrops({ slides }: { slides: { id: string; title: string; image: string }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [slides.length]);
  if (!slides.length) return null;
  return (
    <>
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        {slides.map((s, k) => (
          <div key={s.id} className="hero-slide absolute inset-0" data-active={k === i}>
            <Img src={s.image} alt="" fill priority={k === 0} sizes="100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <p className="absolute bottom-6 right-4 z-10 hidden items-center gap-1.5 text-xs text-white/60 sm:flex sm:right-6" aria-live="polite">
        <MapPin className="size-3.5 text-gold" /> {slides[i].title}
      </p>
    </>
  );
}
