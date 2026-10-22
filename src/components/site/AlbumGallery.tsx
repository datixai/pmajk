"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PhotoGrid } from "./Lightbox";

interface Photo {
  id: string;
  title: string;
  image: string;
  date: string;
  album: string;
}

/** Album tabs and photo grid. The album is read in the browser so the page itself stays static. */
export function AlbumGallery({ photos, albums }: { photos: Photo[]; albums: string[] }) {
  const wanted = useSearchParams().get("album") ?? "";
  return <AlbumView photos={photos} albums={albums} album={albums.includes(wanted) ? wanted : albums[0]} />;
}

/** The gallery for one album; also the static first paint before the address is read. */
export function AlbumView({ photos, albums, album }: { photos: Photo[]; albums: string[]; album: string }) {
  const shown = photos.filter((p) => p.album === album);
  return (
    <>
      <nav aria-label="Albums" className="mb-10 flex flex-wrap justify-center gap-2">
        {albums.map((a) => (
          <Link key={a} href={`/gallery?album=${encodeURIComponent(a)}`} scroll={false} aria-current={a === album ? "page" : undefined} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${a === album ? "bg-pine-900 text-white" : "bg-ivory text-pine-900 ring-1 ring-line hover:ring-pine-500"}`}>
            {a} <span className="ml-1 opacity-60">{photos.filter((p) => p.album === a).length}</span>
          </Link>
        ))}
      </nav>
      {shown.length ? <PhotoGrid key={album} photos={shown} /> : <p className="py-16 text-center text-muted">No photos yet.</p>}
    </>
  );
}
