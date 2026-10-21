"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Trash2 } from "lucide-react";

export function ConfirmButton({
  action,
  label = "Delete",
  confirmText = "Delete this item? This cannot be undone.",
  className = "",
  icon = true,
}: {
  action: () => Promise<unknown>;
  label?: string;
  confirmText?: string;
  className?: string;
  icon?: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) start(async () => void (await action()));
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 ${className}`}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : icon && <Trash2 className="size-4" />}
      {label}
    </button>
  );
}

export function MoveButtons({ up, down, first, last }: { up: () => Promise<void>; down: () => Promise<void>; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex">
      <button type="button" aria-label="Move up" disabled={first || pending} onClick={() => start(up)} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" aria-label="Move down" disabled={last || pending} onClick={() => start(down)} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30">
        <ArrowDown className="size-4" />
      </button>
    </span>
  );
}

export function ActionButton({ action, children, className = "" }: { action: () => Promise<unknown>; children: React.ReactNode; className?: string }) {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => start(async () => void (await action()))} className={`disabled:opacity-50 ${className}`}>
      {children}
    </button>
  );
}
