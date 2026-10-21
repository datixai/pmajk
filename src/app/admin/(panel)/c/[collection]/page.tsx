import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, Plus, Search } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { getCollection } from "@/lib/schema";
import { formatDate } from "@/lib/markdown";
import { PageHeader } from "@/components/admin/AdminNav";
import { ConfirmButton, MoveButtons } from "@/components/admin/Buttons";
import { deleteItem, moveItem } from "../../../actions";

type Props = { params: Promise<{ collection: string }>; searchParams: Promise<{ q?: string; saved?: string; deleted?: string; page?: string }> };
type Row = Record<string, unknown> & { id: string; order?: number };

const PER_PAGE = 30;

export default async function CollectionList({ params, searchParams }: Props) {
  await requireUser();
  const { collection } = await params;
  const sp = await searchParams;
  const def = getCollection(collection);
  if (!def) notFound();
  const db = await readDB();
  const all = [...(db[def.key] as unknown as Row[])].sort((a, b) =>
    def.sort === "date" ? String(b.date).localeCompare(String(a.date)) : (a.order ?? 0) - (b.order ?? 0),
  );
  const q = (sp.q ?? "").toLowerCase();
  const filtered = q ? all.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : all;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const canMove = def.sort === "order" && !q;
  const publicHref = (r: Row) => (def.key === "news" ? `/newsroom/${r.slug}` : def.key === "pages" ? `/${r.slug}` : null);

  return (
    <>
      <PageHeader
        title={def.label}
        text={def.description}
        action={
          <Link href={`/admin/c/${def.key}/new`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">
            <Plus className="size-4" /> Add {def.singular.toLowerCase()}
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        {sp.saved && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Saved. The website has been updated.</p>}
        {sp.deleted && <p className="mb-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">Deleted.</p>}
        <form className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={sp.q} placeholder={`Search ${def.label.toLowerCase()}`} className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 outline-none focus:border-emerald-600" />
        </form>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {rows.map((r, i) => {
              const img = def.imageField ? String(r[def.imageField] ?? "") : "";
              let sub = def.subtitleField ? String(r[def.subtitleField] ?? "") : "";
              if (def.subtitleField === "date") sub = formatDate(sub);
              const href = publicHref(r);
              return (
                <li key={r.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
                  {canMove && (
                    <MoveButtons
                      first={i === 0 && page === 1}
                      last={(page - 1) * PER_PAGE + i === filtered.length - 1}
                      up={moveItem.bind(null, def.key, r.id, -1)}
                      down={moveItem.bind(null, def.key, r.id, 1)}
                    />
                  )}
                  {def.imageField && (
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {img && <img src={img} alt="" loading="lazy" className="size-full object-cover" />}
                    </span>
                  )}
                  <Link href={`/admin/c/${def.key}/${r.id}`} className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-medium">{String(r[def.titleField] ?? "(untitled)")}</span>
                    <span className="line-clamp-1 text-xs text-slate-500">
                      {r.published === false && <b className="mr-2 text-amber-600">Draft</b>}
                      {sub}
                    </span>
                  </Link>
                  <span className="flex shrink-0 items-center gap-1">
                    {href && (
                      <a href={href} target="_blank" aria-label="View on site" className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <Link href={`/admin/c/${def.key}/${r.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      <Pencil className="size-4" /> Edit
                    </Link>
                    <ConfirmButton action={deleteItem.bind(null, def.key, r.id)} label="" confirmText={`Delete "${String(r[def.titleField] ?? "").slice(0, 80)}"? This cannot be undone.`} />
                  </span>
                </li>
              );
            })}
            {!rows.length && <li className="px-4 py-10 text-center text-slate-500">Nothing here yet.</li>}
          </ul>
        </div>
        {pages > 1 && (
          <nav className="mt-5 flex flex-wrap gap-1.5">
            {Array.from({ length: pages }, (_, k) => k + 1).map((p) => (
              <Link key={p} href={`?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`} className={`grid size-9 place-items-center rounded-lg text-sm font-semibold ${p === page ? "bg-emerald-700 text-white" : "bg-white ring-1 ring-slate-200"}`}>
                {p}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
