"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, ExternalLink, Image as ImageIcon, Inbox, KeyRound, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, TriangleAlert, Users, X } from "lucide-react";
import { logout } from "@/app/admin/actions";

interface Props {
  brand: React.ReactNode;
  groups: { title: string; links: { href: string; label: string; count: number }[] }[];
  unread: number;
  user: { name: string; email: string; role: string; twoFactor: boolean };
}

export function AdminNav({ brand, groups, unread, user }: Props) {
  const path = usePathname();
  // The menu belongs to the page it was opened on, so it closes after navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  const cls = (href: string, exact = false) =>
    `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
      (exact ? path === href : path.startsWith(href)) ? "bg-white/15 font-semibold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      <div className="space-y-0.5">
        <Link href="/admin" className={cls("/admin", true)}>
          <span className="flex items-center gap-2.5">
            <LayoutDashboard className="size-4" /> Dashboard
          </span>
        </Link>
        <Link href="/admin/messages" className={cls("/admin/messages")}>
          <span className="flex items-center gap-2.5">
            <Inbox className="size-4" /> Messages
          </span>
          {unread > 0 && <span className="rounded-full bg-amber-400 px-2 text-xs font-bold text-slate-900">{unread}</span>}
        </Link>
        <Link href="/admin/media" className={cls("/admin/media")}>
          <span className="flex items-center gap-2.5">
            <ImageIcon className="size-4" /> Media library
          </span>
        </Link>
        <Link href="/admin/settings" className={cls("/admin/settings")}>
          <span className="flex items-center gap-2.5">
            <Settings className="size-4" /> Site settings
          </span>
        </Link>
      </div>
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 text-[0.68rem] font-bold uppercase tracking-widest text-white/40">{g.title}</p>
          <div className="mt-1.5 space-y-0.5">
            {g.links.map((l) => (
              <Link key={l.href} href={l.href} className={cls(l.href)}>
                {l.label}
                <span className="text-xs text-white/40">{l.count}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="px-3 text-[0.68rem] font-bold uppercase tracking-widest text-white/40">Security</p>
        <div className="mt-1.5 space-y-0.5">
          {user.role === "admin" && (
            <Link href="/admin/users" className={cls("/admin/users")}>
              <span className="flex items-center gap-2.5">
                <Users className="size-4" /> Users & roles
              </span>
            </Link>
          )}
          <Link href="/admin/audit" className={cls("/admin/audit")}>
            <span className="flex items-center gap-2.5">
              <Activity className="size-4" /> Activity log
            </span>
          </Link>
          <Link href="/admin/account" className={cls("/admin/account")}>
            <span className="flex items-center gap-2.5">
              <KeyRound className="size-4" /> My account
            </span>
            {!user.twoFactor && <TriangleAlert className="size-4 text-amber-400" aria-label="Two-factor login is off" />}
          </Link>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 lg:hidden">
        {brand}
        <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" className="grid size-10 place-items-center rounded-lg text-white hover:bg-white/10">
          <Menu className="size-6" />
        </button>
      </div>
      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-slate-900 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          {brand}
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-9 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden">
            <X className="size-5" />
          </button>
        </div>
        {nav}
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-white/50">
            {user.twoFactor && <ShieldCheck className="size-3.5 text-emerald-400" />} {user.role} · {user.email}
          </p>
          <div className="mt-3 flex gap-2">
            <a href="/" target="_blank" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20">
              <ExternalLink className="size-3.5" /> View site
            </a>
            <form action={logout} className="flex-1">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-semibold text-white hover:bg-red-500/80">
                <LogOut className="size-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      </div>
      {action}
    </header>
  );
}
