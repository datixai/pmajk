import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

// Every page is rendered per request so it receives a fresh CSP nonce.
export const dynamic = "force-dynamic";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"] });
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://ajkpm.gok.pk"),
  title: {
    default: "Prime Minister of Azad Jammu & Kashmir | Official Website",
    template: "%s | Prime Minister of AJK",
  },
  description:
    "Official website of the Prime Minister of the Azad Government of the State of Jammu & Kashmir: the Prime Minister, the Cabinet, press releases, photo gallery and the PM Complaint Portal.",
  openGraph: {
    type: "website",
    siteName: "Prime Minister of Azad Jammu & Kashmir",
    images: ["/images/site/pir-chinasi.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#052215",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} ${nastaliq.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
