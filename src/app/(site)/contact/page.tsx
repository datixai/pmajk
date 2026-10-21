import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import { byOrder, readDB } from "@/lib/store";
import { PageHero, SocialLinks } from "@/components/site/SiteFooter";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Contact the Prime Minister's Secretariat, Azad Jammu & Kashmir." };

export default async function ContactPage() {
  const db = await readDB();
  const s = db.settings;
  const rows = [
    [MapPin, "Address", s.contactAddress, ""],
    [Phone, "Phone", s.contactPhone, `tel:${s.contactPhone.replace(/[^\d+]/g, "")}`],
    [Mail, "Email", s.contactEmail, `mailto:${s.contactEmail}`],
    [Clock, "Office hours", s.officeHours, ""],
  ].filter(([, , v]) => v) as [typeof MapPin, string, string, string][];

  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact the PM Office" text="Write to the Prime Minister's Secretariat, or register a complaint about any government department." image="/images/site/pir-chinasi.jpg" />
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-pm grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-pine-900 p-8 text-white">
              <p className="eyebrow text-gold-300">Prime Minister&apos;s Secretariat</p>
              <ul className="mt-6 space-y-5">
                {rows.map(([Icon, label, value, href]) => (
                  <li key={label} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-white/50">{label}</span>
                      {href ? (
                        <a href={href} className="mt-0.5 block hover:text-gold-300">
                          {value}
                        </a>
                      ) : (
                        <span className="mt-0.5 block">{value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/10 pt-6">
                <SocialLinks settings={s} />
              </div>
            </div>
            {s.complaintPortalUrl && (
              <a href={s.complaintPortalUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-3xl border border-gold/50 bg-gold-50 p-6 transition hover:shadow-lg">
                <MessageSquareText className="size-8 shrink-0 text-gold-600" />
                <span>
                  <span className="flex items-center gap-1.5 font-display text-xl text-pine-900">
                    PM Complaint Portal <ArrowUpRight className="size-4" />
                  </span>
                  <span className="mt-1 block text-sm text-muted">For a complaint about a government department, use the portal so that it is registered and tracked.</span>
                </span>
              </a>
            )}
            <ul className="space-y-2 rounded-3xl border border-line bg-ivory p-6 text-sm">
              <li className="eyebrow mb-3 text-gold-600">Useful links</li>
              {byOrder(db.links).map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 py-1 text-pine-900 hover:text-pine-600">
                    <span>
                      <span className="font-semibold">{l.title}</span>
                      {l.description && <span className="block text-xs text-muted">{l.description}</span>}
                    </span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-ivory p-6 sm:p-10">
            <h2 className="font-display text-3xl text-pine-900">Send a message</h2>
            <p className="mb-8 mt-2 text-muted">Your message goes to the Prime Minister&apos;s Secretariat. Please give an email address or phone number so the Office can reply.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
