"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, FileText, LoaderCircle, Trash2, Upload } from "lucide-react";
import { deleteMedia, uploadMedia } from "@/app/admin/actions";

interface Item {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: string;
}

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export function MediaManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState("");
  const [drag, setDrag] = useState(false);

  const upload = (files: FileList | File[]) => {
    const list = Array.from(files);
    start(async () => {
      let ok = 0;
      const failed: string[] = [];
      for (const f of list) {
        const fd = new FormData();
        fd.append("file", f);
        const res = await uploadMedia(fd);
        if (res.error) failed.push(`${f.name}: ${res.error}`);
        else ok++;
      }
      const done = ok ? `${ok} file${ok > 1 ? "s" : ""} uploaded. ` : "";
      setMsg({ ok: failed.length === 0, text: `${done}${failed.length ? `Not uploaded: ${failed.join("; ")}` : ""}`.trim() });
      router.refresh();
    });
  };

  const remove = (it: Item) =>
    start(async () => {
      let res = await deleteMedia(it.id);
      if (res.usedIn) {
        if (!window.confirm(`"${it.name}" is used ${res.usedIn} time(s) on the website. Delete anyway? Those places will show no image.`)) return;
        res = await deleteMedia(it.id, true);
      }
      setMsg(res.error ? { ok: false, text: res.error } : { ok: true, text: "File deleted." });
      router.refresh();
    });

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files);
        }}
        className={`grid place-items-center rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-emerald-600 bg-emerald-50" : "border-slate-300 bg-white"}`}
      >
        {pending ? <LoaderCircle className="size-8 animate-spin text-emerald-700" /> : <Upload className="size-8 text-slate-400" />}
        <p className="mt-3 font-semibold">Drag files here or</p>
        <button type="button" onClick={() => ref.current?.click()} className="mt-3 rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800">
          Choose files
        </button>
        <p className="mt-2 text-xs text-slate-500">JPG, PNG, WebP, GIF or PDF, up to 10 MB</p>
        <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      {msg && <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        {items.map((it) => (
          <li key={it.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <a href={it.url} target="_blank" className="block aspect-square bg-slate-100">
              {it.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt="" loading="lazy" className="size-full object-cover" />
              ) : (
                <span className="grid size-full place-items-center">
                  <FileText className="size-10 text-slate-400" />
                </span>
              )}
            </a>
            <div className="p-3">
              <p className="truncate text-sm font-medium" title={it.name}>
                {it.name}
              </p>
              <p className="text-xs text-slate-500">
                {kb(it.size)} · {new Date(it.createdAt).toLocaleDateString("en-GB")}
              </p>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(it.url);
                    setCopied(it.id);
                    setTimeout(() => setCopied(""), 1500);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {copied === it.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Link
                </button>
                <button type="button" onClick={() => remove(it)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!items.length && <p className="mt-8 text-center text-slate-500">No uploads yet. The bundled site photos are always available in the image picker.</p>}
    </>
  );
}
