"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const url = useSyncExternalStore(
    () => () => {},
    () => window.location.href,
    () => "",
  );
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ["WhatsApp", `https://wa.me/?text=${t}%20${u}`],
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-pine-900">Share</span>
      {links.map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-pine-800 ring-1 ring-line hover:ring-pine-500">
          {label}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-pine-800 ring-1 ring-line hover:ring-pine-500"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
