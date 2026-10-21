"use client";

import { useRef, useState, useTransition } from "react";
import { CirclePlay, FileText, Image as ImageIcon, LoaderCircle, Upload, X } from "lucide-react";
import type { Field } from "@/lib/schema";
import { youtubeId, youtubeThumb } from "@/lib/youtube";
import { RichTextPreview } from "./RichTextPreview";
import { uploadMedia } from "@/app/admin/actions";

export interface LibraryImage {
  url: string;
  name: string;
}

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[0.95rem] text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 aria-[invalid=true]:border-red-500";

export function FieldInput({
  field,
  value,
  error,
  library,
}: {
  field: Field;
  value: unknown;
  error?: string;
  library: LibraryImage[];
}) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name, "aria-invalid": !!error, "aria-describedby": `${id}-help` };
  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} defaultValue={String(value ?? "")} rows={5} maxLength={field.max} className={input} />;
      break;
    case "markdown":
      control = <MarkdownInput {...common} defaultValue={String(value ?? "")} />;
      break;
    case "boolean":
      return (
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <input type="checkbox" name={field.name} defaultChecked={!!value} className="size-5 accent-emerald-700" />
          <span className="text-sm font-medium text-slate-800">{field.label}</span>
          {field.help && <span className="text-xs text-slate-500">{field.help}</span>}
        </label>
      );
    case "select":
      control = (
        <select {...common} defaultValue={String(value ?? "")} className={input}>
          <option value="">Choose...</option>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "date":
      control = <input {...common} type="date" defaultValue={String(value ?? "").slice(0, 10)} className={input} />;
      break;
    case "url":
      control = <input {...common} type="url" placeholder="https://" defaultValue={String(value ?? "")} className={input} />;
      break;
    case "image":
      control = <ImageInput name={field.name} initial={String(value ?? "")} library={library} />;
      break;
    case "file":
      control = <ImageInput name={field.name} initial={String(value ?? "")} library={library} allowPdf />;
      break;
    case "youtube":
      control = <YouTubeInput {...common} initial={String(value ?? "")} />;
      break;
    default:
      control = <input {...common} type="text" defaultValue={String(value ?? "")} maxLength={field.max} className={input} />;
  }
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </label>
      {control}
      {error ? (
        <p id={`${id}-help`} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : (
        field.help && (
          <p id={`${id}-help`} className="mt-1.5 text-xs text-slate-500">
            {field.help}
          </p>
        )
      )}
    </div>
  );
}

function MarkdownInput(props: { id: string; name: string; defaultValue: string; "aria-invalid": boolean }) {
  const [text, setText] = useState(props.defaultValue);
  const [preview, setPreview] = useState(false);
  return (
    <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-300 bg-white">
      <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1.5 text-sm">
        {(["Write", "Preview"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setPreview(t === "Preview")} className={`rounded-lg px-3 py-1 font-medium ${preview === (t === "Preview") ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
            {t}
          </button>
        ))}
      </div>
      <textarea {...props} defaultValue={undefined} value={text} onChange={(e) => setText(e.target.value)} rows={14} className={`w-full px-3.5 py-3 font-mono text-sm outline-none ${preview ? "hidden" : ""}`} />
      {preview && (
        <div className="max-h-[480px] overflow-auto p-5">
          <RichTextPreview text={text} />
        </div>
      )}
    </div>
  );
}

function YouTubeInput({ initial, ...props }: { id: string; name: string; initial: string; "aria-invalid": boolean }) {
  const [url, setUrl] = useState(initial);
  const yt = youtubeId(url);
  return (
    <div className="mt-1.5 grid gap-3 sm:grid-cols-[1fr_200px]">
      <input {...props} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={input.replace("mt-1.5 ", "")} />
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
        {yt ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={youtubeThumb(yt)} alt="Video thumbnail" className="size-full object-cover" />
            <CirclePlay className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" />
          </>
        ) : (
          <span className="grid size-full place-items-center px-3 text-center text-xs text-slate-500">{url ? "Not a YouTube link" : "Preview appears here"}</span>
        )}
      </div>
    </div>
  );
}

export function ImageInput({ name, initial, library, allowPdf = false }: { name: string; initial: string; library: LibraryImage[]; allowPdf?: boolean }) {
  const [url, setUrl] = useState(initial);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const images = allowPdf ? library : library.filter((l) => !/\.pdf$/i.test(l.url));
  const isPdf = (u: string) => /\.pdf$/i.test(u);

  const upload = (file: File) => {
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    start(async () => {
      const res = await uploadMedia(fd);
      if (res.error) setError(res.error);
      else if (res.url) setUrl(res.url);
    });
  };

  return (
    <div className="mt-1.5">
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-3">
        <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url ? isPdf(url) ? <FileText className="size-9 text-red-600" /> : <img src={url} alt="" className="size-full object-cover" /> : <ImageIcon className="size-7 text-slate-400" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload new
          </button>
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Choose from library
          </button>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={`image/jpeg,image/png,image/webp,image/gif${allowPdf ? ",application/pdf" : ""}`}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Image library">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <p className="font-semibold">Image library</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-9 place-items-center rounded-lg hover:bg-slate-100">
                <X className="size-5" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-3 overflow-y-auto p-5 sm:grid-cols-5">
              {images.map((img) => (
                <li key={img.url}>
                  <button
                    type="button"
                    onClick={() => {
                      setUrl(img.url);
                      setOpen(false);
                    }}
                    className={`block w-full overflow-hidden rounded-lg ring-2 ${img.url === url ? "ring-emerald-600" : "ring-transparent hover:ring-slate-300"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {isPdf(img.url) ? (
                      <span className="grid aspect-square w-full place-items-center bg-slate-100">
                        <FileText className="size-10 text-red-600" />
                      </span>
                    ) : (
                      <img src={img.url} alt="" loading="lazy" className="aspect-square w-full bg-slate-100 object-cover" />
                    )}
                    <span className="block truncate px-1 py-1 text-left text-[0.7rem] text-slate-500">{img.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
