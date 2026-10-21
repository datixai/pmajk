import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { PageHeader } from "@/components/admin/AdminNav";
import { MediaManager } from "@/components/admin/MediaManager";

export default async function MediaPage() {
  await requireUser();
  const db = await readDB();
  return (
    <>
      <PageHeader title="Media library" text="Upload photos, banners, logos and PDF documents (up to 10 MB each). Files are checked before they are saved." />
      <div className="p-6 lg:p-10">
        <MediaManager items={db.media.map(({ id, url, name, size, type, uploadedBy, createdAt }) => ({ id, url, name, size, type, uploadedBy, createdAt }))} />
      </div>
    </>
  );
}
