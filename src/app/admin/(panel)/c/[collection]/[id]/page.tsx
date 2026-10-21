import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { getCollection } from "@/lib/schema";
import { imageLibrary } from "@/lib/library";
import { PageHeader } from "@/components/admin/AdminNav";
import { ItemForm } from "@/components/admin/ItemForm";
import { saveItem } from "../../../../actions";

type Props = { params: Promise<{ collection: string; id: string }> };

export default async function EditItem({ params }: Props) {
  await requireUser();
  const { collection, id } = await params;
  const def = getCollection(collection);
  if (!def) notFound();
  const db = await readDB();
  const list = db[def.key] as unknown as Record<string, unknown>[];
  const isNew = id === "new";
  const item = isNew ? null : list.find((x) => x.id === id);
  if (!isNew && !item) notFound();
  const defaults: Record<string, unknown> = isNew
    ? { published: true, date: new Date().toISOString().slice(0, 10) }
    : (item as Record<string, unknown>);

  return (
    <>
      <PageHeader
        title={isNew ? `Add ${def.singular.toLowerCase()}` : `Edit ${def.singular.toLowerCase()}`}
        text={isNew ? def.description : String(item?.[def.titleField] ?? "")}
        action={
          <Link href={`/admin/c/${def.key}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="size-4" /> Back to {def.label.toLowerCase()}
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white px-6 pt-6">
          <ItemForm fields={def.fields} values={defaults} library={await imageLibrary(db)} action={saveItem.bind(null, def.key, id)} cancelHref={`/admin/c/${def.key}`} />
        </div>
      </div>
    </>
  );
}
