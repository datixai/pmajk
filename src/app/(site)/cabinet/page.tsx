import type { Metadata } from "next";
import { byOrder, readDB } from "@/lib/store";
import { SectionHeading } from "@/components/site/ChinarLeaf";
import { PageHero } from "@/components/site/SiteFooter";
import { Portrait } from "@/components/site/Portrait";

export const metadata: Metadata = { title: "The Cabinet", description: "Members of the Cabinet of the Azad Government of the State of Jammu & Kashmir." };

export default async function CabinetPage() {
  const db = await readDB();
  const all = byOrder(db.cabinet);
  const pm = all.find((c) => c.rank === "Prime Minister");
  const members = all.filter((c) => c !== pm);

  return (
    <>
      <PageHero eyebrow="The executive" title="The AJK Cabinet" text="The Cabinet of the Azad Government of the State of Jammu & Kashmir, led by the Prime Minister." image="/images/site/muzaffarabad-city.jpg" />
      {pm && (
        <section className="bg-ivory py-16 sm:py-20">
          <div className="container-pm flex flex-col items-center text-center">
            <Portrait src={pm.image} name={pm.name} size={200} className="ring-2 ring-gold" />
            <p className="eyebrow mt-8 text-gold-600">Head of the Cabinet</p>
            <h2 className="mt-3 font-display text-4xl text-pine-900">{pm.name}</h2>
            <p className="mt-2 text-muted">{pm.portfolio || pm.rank}</p>
          </div>
        </section>
      )}
      <section className="bg-paper py-20 sm:py-24">
        <div className="container-pm">
          <SectionHeading eyebrow="Cabinet members" title="Ministers and members" />
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((c) => (
              <li key={c.id} className="flex flex-col items-center rounded-3xl border border-line bg-ivory px-4 py-8 text-center transition hover:-translate-y-1 hover:shadow-xl">
                <Portrait src={c.image} name={c.name} size={132} className="max-sm:!size-[104px]" />
                <p className="mt-5 font-display text-lg leading-snug text-pine-900">{c.name}</p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600">{c.rank === "Member" ? "Cabinet Member" : c.rank}</p>
                {c.portfolio && <p className="mt-2 text-sm text-muted">{c.portfolio}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
