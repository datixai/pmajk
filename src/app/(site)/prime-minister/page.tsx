import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye } from "lucide-react";
import { byOrder, readDB } from "@/lib/store";
import { RichText } from "@/lib/markdown";
import { Ornament, SectionHeading } from "@/components/site/ChinarLeaf";
import { Portrait } from "@/components/site/Portrait";

export async function generateMetadata(): Promise<Metadata> {
  const s = (await readDB()).settings;
  return { title: `${s.pmHonorific} ${s.pmName}`.trim(), description: s.pmIntro };
}

export default async function PrimeMinisterPage() {
  const db = await readDB();
  const s = db.settings;
  const former = byOrder(db.formerPms);
  const fullName = [s.pmHonorific, s.pmName].filter(Boolean).join(" ");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-pine-975 pb-20 pt-40 text-white sm:pt-48">
        <div className="bg-chinar-pattern absolute inset-0 -z-10 opacity-[0.03]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,rgba(15,90,54,.55),transparent_60%)]" />
        <div className="container-pm grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          <div className="relative mx-auto">
            <div className="portrait-halo absolute -inset-12" aria-hidden="true" />
            <Portrait src={s.pmPortrait} name={fullName} size={300} className="relative ring-2 ring-gold max-sm:!size-[230px]" />
          </div>
          <div className="text-center lg:text-left">
            <p className="eyebrow text-gold-300">The Prime Minister</p>
            <h1 className="mt-4 font-display font-medium leading-[1.05]">
              {s.pmHonorific && <span className="block text-2xl italic text-gold-300 sm:text-3xl">{s.pmHonorific}</span>}
              <span className="block text-5xl sm:text-6xl">{s.pmName}</span>
            </h1>
            <p className="mt-5 text-lg text-white/80">{s.pmOffice}</p>
            <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 lg:mx-0">
              {[
                ["Office", s.pmOrdinal],
                ["In office since", s.pmSince],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left">
                    <dt className="text-xs uppercase tracking-widest text-white/50">{k}</dt>
                    <dd className="mt-1 font-display text-xl text-gold-300">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <div className="container-pm">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-center text-gold-600">Profile</p>
            <h2 className="mt-3 text-center font-display text-4xl text-pine-900">About the Prime Minister</h2>
            <Ornament className="mb-10 mt-5" />
            <RichText text={s.pmProfile} className="prose-pm drop-cap" />
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
            {[
              ["My Mission", s.mission, Compass],
              ["My Vision", s.vision, Eye],
            ].map(([title, text, Icon]) => {
              const I = Icon as typeof Compass;
              return (
                <article key={title as string} className="rounded-3xl bg-pine-900 p-8 text-center text-white sm:p-10">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-pine-975">
                    <I className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl">{title as string}</h3>
                  <p className="mt-4 leading-relaxed text-white/80">{text as string}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/newsroom" className="inline-flex items-center gap-2 rounded-full bg-pine-900 px-6 py-3 text-sm font-semibold text-white hover:bg-pine-800">
              Statements and press releases <ArrowRight className="size-4" />
            </Link>
            <Link href="/cabinet" className="inline-flex items-center gap-2 rounded-full border border-pine-900/20 px-6 py-3 text-sm font-semibold text-pine-900 hover:border-pine-700">
              The Cabinet
            </Link>
          </div>
        </div>
      </section>

      <section id="former" className="scroll-mt-28 bg-paper py-20 sm:py-28">
        <div className="container-pm">
          <SectionHeading eyebrow="Since 1975" title="Former Prime Ministers" text="The holders of the office of Prime Minister of the Azad Government of the State of Jammu & Kashmir, from the most recent." />
          <ol className="relative mx-auto grid max-w-5xl gap-x-10 md:grid-cols-2">
            {former.map((p) => (
              <li key={p.id} className="relative flex items-center gap-5 border-b border-line py-5">
                <Portrait src={p.image} name={p.name} size={80} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-snug text-pine-900">{p.name}</p>
                  <p className="mt-1 text-sm font-semibold text-gold-600">
                    {p.from}
                    {p.to ? ` to ${p.to}` : " to date"}
                  </p>
                  <p className="mt-1 text-xs text-muted">{[p.party, p.note].filter(Boolean).join(". ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
