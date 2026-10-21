import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { SETTINGS_FIELDS } from "@/lib/schema";
import { imageLibrary } from "@/lib/library";
import { PageHeader } from "@/components/admin/AdminNav";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  await requireUser();
  const db = await readDB();
  return (
    <>
      <PageHeader title="Site settings" text="The Prime Minister's profile, mission and vision, the Kashmir cause band, contact details and social links." />
      <div className="p-6 lg:p-10">
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white px-6 pt-6">
          <SettingsForm sections={SETTINGS_FIELDS} values={db.settings as unknown as Record<string, unknown>} library={await imageLibrary(db)} />
        </div>
      </div>
    </>
  );
}
