import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { excerpt, formatDate } from "@/lib/markdown";
import { Img } from "./Img";

/** Photo for a press release, or an official seal plate when it has none. */
export function NewsVisual({ item, sizes, className = "" }: { item: NewsItem; sizes: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden bg-pine-900 ${className}`}>
      {item.image ? (
        <Img src={item.image} alt="" fill sizes={sizes} className="object-cover transition duration-700 group-hover:scale-105" />
      ) : (
        <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#0f5a36,#03170e)]">
          <span className="bg-chinar-pattern absolute inset-0 opacity-[0.05]" />
          <span className="relative flex flex-col items-center gap-3 px-6 text-center">
            <Image src="/images/site/seal.png" alt="" width={72} height={72} className="rounded-full bg-white/95 p-1 opacity-90 transition duration-700 group-hover:scale-105" />
            <span className="eyebrow text-gold-300">{item.location || "Press release"}</span>
          </span>
        </span>
      )}
    </span>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/newsroom/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ivory transition hover:-translate-y-1 hover:shadow-xl">
      <NewsVisual item={item} sizes="(min-width:1024px) 380px, 100vw" className="aspect-[16/10]" />
      <span className="flex flex-1 flex-col p-6">
        <span className="eyebrow text-gold-600">
          {item.location ? `${item.location}, ` : ""}
          {formatDate(item.date, { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="mt-3 font-display text-xl leading-snug text-pine-900 group-hover:text-pine-600">{item.title}</span>
        <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{excerpt(item.body, 170)}</span>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-pine-700">
          Read the release <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
