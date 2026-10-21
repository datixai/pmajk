import Link from "next/link";
import { ChinarLeaf, Ornament } from "@/components/site/ChinarLeaf";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-pine-975 px-4 text-center text-white">
      <div>
        <ChinarLeaf className="mx-auto size-20 text-chinar" />
        <h1 className="mt-6 font-display text-5xl font-medium">Page not found</h1>
        <Ornament className="mt-5" tone="dark" />
        <p className="mt-5 text-white/75">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-gold px-6 py-3 font-semibold text-pine-975">
            Home page
          </Link>
          <Link href="/search" className="rounded-full border border-white/40 px-6 py-3 font-semibold">
            Search
          </Link>
        </div>
      </div>
    </main>
  );
}
