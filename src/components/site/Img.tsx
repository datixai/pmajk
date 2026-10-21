import Image, { type ImageProps } from "next/image";

// next/image wrapper: files uploaded through the admin panel are served by a
// route handler, so they skip the optimiser.
export function Img(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = props.unoptimized ?? (src.startsWith("/media/") || src.endsWith(".svg"));
  return <Image {...props} unoptimized={unoptimized} />;
}

export function Fallback({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center bg-pine-800 ${className}`}>
      <Image src="/images/site/seal.png" alt="" width={72} height={72} className="opacity-30 grayscale invert" />
    </div>
  );
}
