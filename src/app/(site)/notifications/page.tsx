import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { formatDate } from "@/lib/markdown";
import { PageHero } from "@/components/site/SiteFooter";
import { Img } from "@/components/site/Img";

export const metadata: Metadata = { title: "Notifications", description: "Official notifications and directives of the Prime Minister's Office, Azad Jammu & Kashmir." };

export default async function NotificationsPage() {
  const db = await readDB();
  const items = byDateDesc(db.notices);
  return (
    <>
      <PageHero eyebrow="Newsroom" title="Notifications" text="Official notifications, directives and documents issued by the Prime Minister's Office." image="/images/site/muzaffarabad-city.jpg" />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-pm">
          {items.length ? (
            <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
              {items.map((n) => {
                const pdf = /\.pdf$/i.test(n.file);
                return (
                  <li key={n.id} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-ivory sm:flex-row">
                    <a href={n.file} target="_blank" rel="noopener noreferrer" className="relative grid aspect-[3/4] w-full shrink-0 place-items-center bg-pine-50 sm:w-44" aria-label={`Open ${n.title}`}>
                      {pdf ? <FileText className="size-14 text-chinar" /> : <Img src={n.file} alt="" fill sizes="176px" className="object-cover object-top" />}
                    </a>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow text-gold-600">{formatDate(n.date)}</p>
                      <h2 className="mt-2 font-display text-xl leading-snug text-pine-900">{n.title}</h2>
                      {n.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{n.summary}</p>}
                      <a href={n.file} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-pine-700 hover:text-pine-900">
                        <Download className="size-4" /> View {pdf ? "PDF" : "document"}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-16 text-center text-muted">No notifications have been published yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
