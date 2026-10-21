"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Menu, Phone, Search, X } from "lucide-react";

type NavItem = { label: string; href: string; children?: { label: string; href: string; text: string }[] };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "The Prime Minister", href: "/prime-minister" },
  { label: "Cabinet", href: "/cabinet" },
  { label: "PM Office", href: "/pm-office" },
  {
    label: "Newsroom",
    href: "/newsroom",
    children: [
      { label: "Press releases", href: "/newsroom", text: "Statements and news from the PM Office" },
      { label: "Notifications", href: "/notifications", text: "Official notifications and directives" },
      { label: "Photo gallery", href: "/gallery", text: "Events and engagements in pictures" },
      { label: "Videos", href: "/videos", text: "Speeches and events on video" },
    ],
  },
  {
    label: "AJK",
    href: "/ajk-at-a-glance",
    children: [
      { label: "AJK at a Glance", href: "/ajk-at-a-glance", text: "The land, the people and key figures" },
      { label: "The Kashmir Cause", href: "/kashmir-cause", text: "The base camp of the freedom struggle" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

interface Props {
  shortName: string;
  urduName: string;
  phone: string;
  email: string;
  portalUrl: string;
  today: string;
}

export function SiteHeader({ shortName, urduName, phone, email, portalUrl, today }: Props) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Menus belong to the page they were opened on, so they close after navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [menuAt, setMenuAt] = useState<{ path: string; label: string } | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  const menu = menuAt?.path === path ? menuAt.label : null;
  const setMenu = (label: string | null) => setMenuAt(label ? { path, label } : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (item: NavItem) =>
    item.href === "/" ? path === "/" : path.startsWith(item.href) || !!item.children?.some((c) => path.startsWith(c.href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-pine-900">
        Skip to content
      </a>
      <div className={`hidden overflow-hidden border-b border-white/10 bg-pine-975 text-white/70 transition-all duration-300 md:block ${scrolled ? "max-h-0 border-transparent" : "max-h-12"}`}>
        <div className="container-pm flex h-10 items-center justify-between text-xs">
          <p>{today}</p>
          <div className="flex items-center gap-6">
            {phone && (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5 text-gold" /> {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail className="size-3.5 text-gold" /> {email}
              </a>
            )}
            <span lang="ur" dir="rtl" className="font-urdu text-sm leading-none text-white/80">
              {urduName}
            </span>
          </div>
        </div>
      </div>

      <div className={`transition-colors duration-300 ${scrolled || open ? "bg-pine-950/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,.5)] backdrop-blur" : "bg-gradient-to-b from-pine-975/70 to-transparent"}`}>
        <div className="container-pm flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-white xl:shrink-0" aria-label={`${shortName}, home`}>
            <span className="relative size-12 shrink-0 rounded-full bg-white p-0.5 ring-2 ring-gold/70">
              <Image src="/images/site/seal.png" alt="" fill sizes="48px" className="object-contain p-0.5" priority />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[0.95rem] font-medium sm:text-[1.15rem] sm:tracking-wide">Prime Minister&apos;s Office</span>
              <span className="block truncate text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-300 sm:text-[0.68rem] sm:tracking-[0.18em]">Azad Jammu &amp; Kashmir</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center whitespace-nowrap">
              {NAV.map((item) => (
                <li key={item.label} className="relative" onMouseEnter={() => item.children && setMenu(item.label)} onMouseLeave={() => setMenu(null)}>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={menu === item.label}
                      onClick={() => setMenu(menu === item.label ? null : item.label)}
                      className={`flex items-center gap-1 rounded-full px-3 py-2 text-[0.9rem] font-medium transition ${active(item) ? "text-gold-300" : "text-white/85 hover:text-white"}`}
                    >
                      {item.label} <ChevronDown className={`size-3.5 transition ${menu === item.label ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <Link href={item.href} aria-current={active(item) ? "page" : undefined} className={`block rounded-full px-3 py-2 text-[0.9rem] font-medium transition ${active(item) ? "text-gold-300" : "text-white/85 hover:text-white"}`}>
                      {item.label}
                    </Link>
                  )}
                  {item.children && menu === item.label && (
                    <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                      <ul className="overflow-hidden rounded-2xl border border-line bg-ivory p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-xl px-4 py-3 transition hover:bg-gold-50">
                              <span className="block font-semibold text-pine-900">{c.label}</span>
                              <span className="block text-xs text-muted">{c.text}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" aria-label="Search" className="grid size-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white">
              <Search className="size-[1.15rem]" />
            </Link>
            {portalUrl && (
              <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="hidden rounded-full border border-gold/70 px-4 py-2 text-sm font-semibold text-gold-300 transition hover:bg-gold hover:text-pine-975 xl:inline-block whitespace-nowrap">
                Complaint Portal
              </a>
            )}
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10 xl:hidden">
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="h-[calc(100dvh-76px)] overflow-y-auto bg-pine-950 px-4 pb-10 text-white xl:hidden">
          <ul className="divide-y divide-white/10">
            {NAV.map((item) => (
              <li key={item.label} className="py-1">
                <Link href={item.href} className={`block py-3 font-display text-xl ${active(item) ? "text-gold-300" : ""}`}>
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-3 grid grid-cols-2 gap-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/85">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {portalUrl && (
            <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-full bg-gold px-6 py-3.5 text-center font-semibold text-pine-975">
              PM Complaint Portal
            </a>
          )}
          <p lang="ur" dir="rtl" className="mt-8 text-center font-urdu text-lg text-white/70">
            {urduName}
          </p>
        </div>
      )}
    </header>
  );
}
