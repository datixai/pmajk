"use client";

import { useActionState } from "react";
import { LoaderCircle, Save, TriangleAlert } from "lucide-react";
import type { Field } from "@/lib/schema";
import { saveSettings, type FormState } from "@/app/admin/actions";
import { FieldInput, type LibraryImage } from "./Fields";

export function SettingsForm({ sections, values, library }: { sections: { section: string; fields: Field[] }[]; values: Record<string, unknown>; library: LibraryImage[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, {});
  return (
    <form action={action} className="space-y-10">
      {state.error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <TriangleAlert className="size-4" /> {state.error}
        </p>
      )}
      {sections.map((s) => (
        <fieldset key={s.section} className="space-y-5">
          <legend className="mb-4 text-lg font-bold">{s.section}</legend>
          {s.fields.map((f) => (
            <FieldInput key={f.name} field={f} value={(state.values ?? values)[f.name]} error={state.fieldErrors?.[f.name]} library={library} />
          ))}
        </fieldset>
      ))}
      <div className="sticky bottom-0 -mx-6 flex items-center gap-4 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
        <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save settings
        </button>
        {state.ok && <span className="text-sm font-medium text-emerald-700">{state.message}</span>}
      </div>
    </form>
  );
}
