import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-pine-900 lg:block">
        <Image src="/images/site/pir-chinasi.jpg" alt="" fill sizes="50vw" className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="font-display text-4xl font-semibold">Content management</p>
          <p className="mt-3 max-w-md text-white/75">Authorised staff of the Prime Minister&apos;s Secretariat only. All actions are recorded in the activity log.</p>
        </div>
      </div>
      <div className="grid place-items-center p-6">
        <div className="w-full max-w-sm">
          <Image src="/images/site/seal.png" alt="Seal of AJK" width={72} height={72} />
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Staff sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Prime Minister&apos;s Office, Azad Jammu &amp; Kashmir</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
