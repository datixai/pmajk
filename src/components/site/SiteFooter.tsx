import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { LinkItem, Settings } from "@/lib/types";
import { ChinarLeaf, Ornament } from "./ChinarLeaf";

function Social({ href, label, path }: { href: string; label: string; path: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold hover:text-gold-300">
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

export function SocialLinks({ settings }: { settings: Settings }) {
  return (
    <div className="flex gap-2">
      <Social href={settings.facebook} label="Facebook" path="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" />
      <Social href={settings.twitter} label="X" path="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
      <Social href={settings.youtube} label="YouTube" path="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-5.3.5-5.3ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" />
    </div>
  );
}

export function SiteFooter({ settings, links }: { settings: Settings; links: LinkItem[] }) {
  const year = new Date().getFullYear();
  const cols: [string, [string, string][]][] = [
    [
      "The Office",
      [
        ["The Prime Minister", "/prime-minister"],
        ["Former Prime Ministers", "/prime-minister#former"],
        ["The Cabinet", "/cabinet"],
        ["PM Office & organogram", "/pm-office"],
      ],
    ],
    [
      "Newsroom",
      [
        ["Press releases", "/newsroom"],
        ["Notifications", "/notifications"],
        ["Photo gallery", "/gallery"],
        ["Videos", "/videos"],
      ],
    ],
    [
      "Azad Kashmir",
      [
        ["AJK at a Glance", "/ajk-at-a-glance"],
        ["The Kashmir Cause", "/kashmir-cause"],
        ["Contact the PM Office", "/contact"],
        ["Search", "/search"],
      ],
    ],
  ];
  return (
    <footer className="relative overflow-hidden bg-pine-975 text-white">
      <div className="h-1 bg-[linear-gradient(90deg,#0f5a36_0_33%,#c9a45c_33%_67%,#c8431a_67%)]" aria-hidden="true" />
      <ChinarLeaf className="pointer-events-none absolute -right-24 -top-10 size-[420px] text-white/[0.03]" veins={false} />
      <div className="container-pm relative py-16">
        <div className="flex flex-col items-center text-center">
          <span className="relative size-20 rounded-full bg-white p-1 ring-2 ring-gold/60">
            <Image src="/images/site/seal.png" alt="Seal of the Azad Government of the State of Jammu & Kashmir" fill sizes="80px" className="object-contain p-1" />
          </span>
          <p className="mt-5 font-display text-2xl font-medium">{settings.siteName}</p>
          <p className="mt-2 font-urdu text-lg leading-loose text-white/70" lang="ur" dir="rtl">
            {settings.urduName}
          </p>
          <Ornament className="mt-4" tone="dark" />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="eyebrow text-gold-300">Prime Minister&apos;s Secretariat</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {settings.contactAddress && (
                <li className="flex gap-3">
                  <MapPin className="size-4 shrink-0 text-gold" /> {settings.contactAddress}
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex gap-3">
                  <Phone className="size-4 shrink-0 text-gold" />
                  <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex gap-3">
                  <Mail className="size-4 shrink-0 text-gold" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-6">
              <SocialLinks settings={settings} />
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {cols.map(([title, items]) => (
              <div key={title}>
                <p className="eyebrow text-gold-300">{title}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {items.map(([l, h]) => (
                    <li key={l}>
                      <Link href={h} className="text-white/75 transition hover:text-white">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow text-gold-300">Useful links</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {links.map((l) => (
                  <li key={l.id}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/75 transition hover:text-white">
                      {l.title} <ArrowUpRight className="size-3.5 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Flags">
          {[
            ["/images/flags/ajk.jpg", "Flag of Azad Jammu and Kashmir", "Azad Jammu Kashmir"],
            ["/images/flags/pakistan.svg", "Flag of Pakistan", "Pakistan"],
          ].map(([src, alt, label]) => (
            <li key={label} className="flex items-center gap-2.5 text-xs font-medium text-white/70">
              <Image src={src} alt={alt} width={30} height={20} unoptimized className="h-5 w-[30px] rounded-[3px] object-cover shadow-sm ring-1 ring-white/25" />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pm flex flex-col items-center gap-2 py-6 text-center text-xs text-white/55 md:flex-row md:justify-between md:text-left">
          <p>
            © {year} {settings.siteName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>{settings.footerNote}</span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:inline-block" />
            <span>
              Developed by{" "}
              <a href="https://datixai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 underline-offset-4 transition hover:text-gold-300 hover:underline">
                Datix AI
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-pine-950 pb-16 pt-40 text-center text-white sm:pb-20 sm:pt-48">
      {image && <Image src={image} alt="" fill priority quality={70} sizes="100vw" className="-z-20 object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pine-975/80 via-pine-950/70 to-pine-950" />
      <div className="container-pm flex flex-col items-center">
        <p className="eyebrow text-gold-300 animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-medium leading-[1.1] tracking-tight animate-rise sm:text-6xl">{title}</h1>
        <Ornament className="mt-6" tone="dark" />
        {text && <p className="mt-5 max-w-2xl text-lg text-white/75">{text}</p>}
      </div>
    </section>
  );
}
