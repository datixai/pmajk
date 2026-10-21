import { Img } from "./Img";

function initials(name: string) {
  const words = name.replace(/^(Mr|Mrs|Ms|Dr|Barrister|Sardar|Raja|Chaudhry|Ch|Syed)\.?\s+/i, "").split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase() || "PM";
}

/** Round portrait with a fine gold ring. Shows a monogram when no photo exists. */
export function Portrait({ src, name, size = 160, className = "" }: { src?: string; name: string; size?: number; className?: string }) {
  return (
    <span className={`relative block shrink-0 rounded-full p-1 ring-1 ring-gold/60 ${className}`} style={{ width: size, height: size }}>
      <span className="relative block size-full overflow-hidden rounded-full bg-pine-900">
        {src ? (
          <Img src={src} alt={name ? `Portrait of ${name}` : ""} fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <span className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_25%,#0f5a36,#052215)] font-display text-gold-300" style={{ fontSize: size * 0.3 }} aria-hidden="true">
            {initials(name || "Vacant")}
          </span>
        )}
      </span>
    </span>
  );
}
