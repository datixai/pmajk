import type { ReactNode } from "react";

// Renders the small text format used in the admin editor: blank-line
// paragraphs, "## " sub-headings and "- " bullet lists. No raw HTML.
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = (text || "").replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: ReactNode[] = [];
  blocks.forEach((block, i) => {
    const lines = block.split("\n").filter((l) => l.trim());
    if (!lines.length) return;
    let para: string[] = [];
    let list: string[] = [];
    const flush = (k: string) => {
      if (para.length) out.push(<p key={`p${k}`}>{para.join(" ")}</p>);
      if (list.length)
        out.push(
          <ul key={`u${k}`}>
            {list.map((li, j) => (
              <li key={j}>{li}</li>
            ))}
          </ul>,
        );
      para = [];
      list = [];
    };
    lines.forEach((line, j) => {
      const t = line.trim();
      if (t.startsWith("## ")) {
        flush(`${i}-${j}`);
        out.push(<h2 key={`h${i}-${j}`}>{t.slice(3)}</h2>);
      } else if (t.startsWith("- ")) {
        if (para.length) flush(`${i}-${j}a`);
        list.push(t.slice(2));
      } else {
        if (list.length) flush(`${i}-${j}b`);
        para.push(t);
      }
    });
    flush(`${i}-end`);
  });
  return <div className={className ?? "prose-pm"}>{out}</div>;
}

export function excerpt(text: string, len = 180) {
  const t = (text || "").replace(/^##\s.*$/gm, "").replace(/\s+/g, " ").trim();
  return t.length > len ? `${t.slice(0, len).replace(/\s+\S*$/, "")}...` : t;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(d: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  const date = new Date(`${d.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleDateString("en-GB", opts);
}
