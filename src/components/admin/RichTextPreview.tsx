"use client";

import { RichText } from "@/lib/markdown";

export function RichTextPreview({ text }: { text: string }) {
  return <RichText text={text} />;
}
