export function ChinarLeaf({ className, veins = true }: { className?: string; veins?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M32 2l4.6 10.4 6.9-4.4-1.6 12.6 10.6-6.2-2.6 11 12.1-1.3-8.8 10.3 4.4 3.9-13.3 2.8 2.1 7.2-11.3-3.6-1.9 9.3h-2.4l-1.9-9.3-11.3 3.6 2.1-7.2-13.3-2.8 4.4-3.9L2 24.1l12.1 1.3-2.6-11 10.6 6.2-1.6-12.6 6.9 4.4z"
      />
      {veins && (
        <path
          fill="none"
          stroke="rgba(0,0,0,.28)"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M32 61V20M32 41L14 27M32 41l18-14M32 33L22 15M32 33l10-18"
        />
      )}
    </svg>
  );
}

/** Chinar leaf between two fine gold rules: the signature ornament of the site. */
export function Ornament({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="gold-rule w-16 sm:w-24" />
      <ChinarLeaf className={`size-5 ${tone === "dark" ? "text-gold-300" : "text-chinar"}`} veins={false} />
      <span className="gold-rule w-16 sm:w-24" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "light",
  action,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  tone?: "light" | "dark";
  action?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-14">
      <p className={`eyebrow ${dark ? "text-gold-300" : "text-gold-600"}`}>{eyebrow}</p>
      <h2 className={`mt-4 font-display text-[2rem] font-medium leading-[1.15] tracking-tight sm:text-[2.6rem] ${dark ? "text-white" : "text-pine-900"}`}>{title}</h2>
      <Ornament className="mt-5" tone={tone} />
      {text && <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-white/75" : "text-muted"}`}>{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
