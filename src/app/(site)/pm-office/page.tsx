import type { Metadata } from "next";
import { byOrder, readDB } from "@/lib/store";
import { OFFICE_SECTIONS } from "@/lib/schema";
import { Ornament } from "@/components/site/ChinarLeaf";
import { PageHero } from "@/components/site/SiteFooter";
import { Portrait } from "@/components/site/Portrait";
import type { OfficeMember } from "@/lib/types";

export const metadata: Metadata = { title: "PM Office", description: "The organogram of the Prime Minister's Secretariat, Azad Jammu & Kashmir, and the political wing." };

function Officer({ o, size = 104 }: { o: OfficeMember; size?: number }) {
  return (
    <div className="flex h-full flex-col items-center rounded-3xl border border-line bg-ivory px-4 py-7 text-center">
      <Portrait src={o.image} name={o.name || "Vacant"} size={size} />
      <p className={`mt-4 font-display text-lg leading-snug ${o.name ? "text-pine-900" : "italic text-muted"}`}>{o.name || "Post vacant"}</p>
      <p className="mt-1.5 text-sm text-muted">{o.designation}</p>
    </div>
  );
}

export default async function OfficePage() {
  const db = await readDB();
  const all = byOrder(db.office);
  const lead = all.filter((o) => o.section === "Leadership");
  const wing = all.filter((o) => o.section === "Political Wing");
  const sections = OFFICE_SECTIONS.filter((s) => s !== "Leadership" && s !== "Political Wing")
    .map((s) => ({ s, people: all.filter((o) => o.section === s) }))
    .filter((x) => x.people.length);

  return (
    <>
      <PageHero eyebrow="Prime Minister's Secretariat" title="The PM Office" text="The officers who serve the Prime Minister and keep the business of government moving." image="/images/site/pir-chinasi.jpg" />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="container-pm">
          <p className="eyebrow text-center text-gold-600">Organogram</p>
          <h2 className="mt-3 text-center font-display text-4xl text-pine-900">How the Office is organised</h2>
          <Ornament className="mt-5" />

          <div className="mt-14 flex flex-col items-center">
            {lead.map((o, i) => (
              <div key={o.id} className="flex flex-col items-center">
                {i > 0 && <span className="h-10 w-px bg-gold/60" aria-hidden="true" />}
                <div className={i === 0 ? "w-72" : "w-64"}>
                  <Officer o={o} size={i === 0 ? 132 : 112} />
                </div>
              </div>
            ))}
            <span className="h-10 w-px bg-gold/60" aria-hidden="true" />
          </div>

          <div className="border-t border-gold/50 pt-12">
            <div className="grid gap-12">
              {sections.map(({ s, people }) => (
                <section key={s} aria-labelledby={`sec-${s}`}>
                  <h3 id={`sec-${s}`} className="eyebrow flex items-center justify-center gap-3 text-pine-700">
                    <span className="gold-rule w-10" /> {s} <span className="gold-rule w-10" />
                  </h3>
                  <ul className="mt-6 flex flex-wrap justify-center gap-4">
                    {people.map((o) => (
                      <li key={o.id} className="w-[calc(50%-0.5rem)] sm:w-56">
                        <Officer o={o} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {wing.length > 0 && (
        <section id="political-wing" className="scroll-mt-28 bg-pine-950 py-20 text-white sm:py-24">
          <div className="container-pm">
            <p className="eyebrow text-center text-gold-300">Political Wing</p>
            <h2 className="mt-3 text-center font-display text-4xl">The Prime Minister&apos;s political team</h2>
            <Ornament className="mt-5" tone="dark" />
            <ul className="mx-auto mt-12 grid max-w-4xl gap-6">
              {wing.map((o) => (
                <li key={o.id} className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:flex-row sm:text-left">
                  <Portrait src={o.image} name={o.name} size={150} className="ring-2 ring-gold" />
                  <div>
                    <p className="font-display text-3xl">{o.name}</p>
                    <p className="mt-1 font-semibold text-gold-300">{o.designation}</p>
                    {o.note && <p className="mt-4 leading-relaxed text-white/75">{o.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
