"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LoaderCircle, Save, TriangleAlert } from "lucide-react";
import type { Field } from "@/lib/schema";
import type { FormState } from "@/app/admin/actions";
import { FieldInput, type LibraryImage } from "./Fields";

export function ItemForm({
  fields,
  values,
  library,
  action,
  cancelHref,
  submitLabel = "Save",
}: {
  fields: Field[];
  values: Record<string, unknown>;
  library: LibraryImage[];
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  cancelHref?: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <TriangleAlert className="size-4" /> {state.error}
        </p>
      )}
      {state.ok && state.message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{state.message}</p>}
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={(state.values ?? values)[f.name]} error={state.fieldErrors?.[f.name]} library={library} />
      ))}
      <div className="sticky bottom-0 -mx-6 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} {submitLabel}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="rounded-xl px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
