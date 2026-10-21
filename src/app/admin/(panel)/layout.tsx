import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { COLLECTIONS } from "@/lib/schema";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const db = await readDB();
  const unread = db.messages.filter((m) => !m.read).length;
  const groups = ["Newsroom", "Home page", "Government", "Information"].map((g) => ({
    title: g,
    links: COLLECTIONS.filter((c) => c.group === g).map((c) => ({ href: `/admin/c/${c.key}`, label: c.label, count: (db[c.key] as unknown[]).length })),
  }));
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[264px_1fr]">
      <AdminNav
        groups={groups}
        unread={unread}
        user={{ name: user.name, email: user.email, role: user.role, twoFactor: user.twoFactor }}
        brand={
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/images/site/seal.png" alt="" width={36} height={36} className="rounded-full bg-white" />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">PM Office AJK</span>
              <span className="block text-xs text-white/60">Content management</span>
            </span>
          </Link>
        }
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
