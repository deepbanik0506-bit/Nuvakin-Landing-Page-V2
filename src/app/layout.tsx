import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ClientEnhancements } from "@/components/layout/ClientEnhancements";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "dark",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  email: site.contactEmail,
  description: site.description,
  ...(site.linkedinUrl ? { sameAs: [site.linkedinUrl] } : {}),
};

const revealGuard = `(function(){var d=document.documentElement;if(!("IntersectionObserver" in window))return;d.classList.add("js");setTimeout(function(){if(!d.classList.contains("reveal-ready"))d.classList.remove("js")},3000)})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Opts into reveal styles before paint (no flash). Reveals only hide content while the client
            can show it again: if the app hasn't hydrated and marked `reveal-ready` within 3s (blocked or
            failed scripts, slow network), the opt-in is withdrawn and everything renders visible. */}
        <script dangerouslySetInnerHTML={{ __html: revealGuard }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[70] bg-tangerine px-4 py-3 font-medium text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ClientEnhancements />
      </body>
    </html>
  );
}
