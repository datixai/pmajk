import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { byOrder, readDB } from "@/lib/store";

// Public pages are pre-built and served from the CDN cache. They refresh at
// most every 5 minutes, and immediately after an admin saves (revalidatePath).
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await readDB();
  const s = db.settings;
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" });
  return (
    <>
      <SiteHeader shortName={s.shortName} urduName={s.urduName} phone={s.contactPhone} email={s.contactEmail} portalUrl={s.complaintPortalUrl} today={today} />
      <main id="main">{children}</main>
      <SiteFooter settings={s} links={byOrder(db.links)} />
    </>
  );
}
