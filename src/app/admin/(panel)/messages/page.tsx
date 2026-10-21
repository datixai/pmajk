import { Mail, Phone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/store";
import { PageHeader } from "@/components/admin/AdminNav";
import { ActionButton, ConfirmButton } from "@/components/admin/Buttons";
import { deleteMessage, setMessageRead } from "../../actions";

export default async function MessagesPage() {
  await requireUser();
  const db = await readDB();
  return (
    <>
      <PageHeader title="Messages" text="Questions, suggestions and complaints sent through the Contact page." />
      <div className="space-y-4 p-6 lg:p-10">
        {db.messages.map((m) => (
          <article key={m.id} className={`rounded-2xl border bg-white p-5 ${m.read ? "border-slate-200" : "border-emerald-500 shadow-sm"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {!m.read && <span className="mr-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">New</span>}
                  {m.subject || "(no subject)"}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-slate-500">
                  <span>{m.name}</span>
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-slate-900">
                      <Mail className="size-3.5" /> {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" /> {m.phone}
                    </span>
                  )}
                  <span>{new Date(m.createdAt).toLocaleString("en-GB")}</span>
                </p>
              </div>
              <div className="flex gap-1">
                <ActionButton action={setMessageRead.bind(null, m.id, !m.read)} className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Mark as {m.read ? "unread" : "read"}
                </ActionButton>
                <ConfirmButton action={deleteMessage.bind(null, m.id)} confirmText="Delete this message?" />
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-slate-700">{m.message}</p>
          </article>
        ))}
        {!db.messages.length && <p className="rounded-2xl bg-white p-10 text-center text-slate-500 ring-1 ring-slate-200">No messages yet.</p>}
      </div>
    </>
  );
}
