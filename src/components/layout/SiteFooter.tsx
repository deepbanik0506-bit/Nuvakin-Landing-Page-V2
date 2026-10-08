import Link from "next/link";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden pt-20 pb-10 sm:pt-28">
      <Mark mono className="pointer-events-none absolute -right-16 -bottom-24 h-[26rem] w-auto text-ink opacity-[0.035] sm:-right-10 sm:h-[34rem]" />
      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/#top" className="inline-flex items-center gap-3 text-ink" aria-label="Nuvakin — back to top">
              <Mark className="h-9 w-auto" />
              <Wordmark className="h-5 w-auto" />
            </Link>
            <p className="font-display mt-6 max-w-[22rem] text-2xl leading-snug text-ink">
              Better decisions start with <span className="text-tangerine italic">better intelligence.</span>
            </p>
            <p className="mt-3 max-w-[22rem] text-sm text-ink-3">Structured intelligence for better education decisions.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="eyebrow">Explore</p>
              <ul className="mt-4 space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-9 items-center text-sm text-ink-2 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Nuvakin</p>
              <ul className="mt-4 space-y-1">
                <li>
                  <Link href="/#evidence" className="inline-flex min-h-9 items-center text-sm text-ink-2 hover:text-ink">
                    Evidence
                  </Link>
                </li>
                <li>
                  <Link href="/#waitlist" data-track-cta="footer" className="inline-flex min-h-9 items-center text-sm text-ink-2 hover:text-ink">
                    Join the Waitlist
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">Contact</p>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href={`mailto:${site.contactEmail}`} className="inline-flex min-h-9 items-center text-sm break-all text-ink-2 hover:text-ink">
                    {site.contactEmail}
                  </a>
                </li>
                {site.linkedinUrl && (
                  <li>
                    <a href={site.linkedinUrl} rel="noopener" target="_blank" className="inline-flex min-h-9 items-center text-sm text-ink-2 hover:text-ink">
                      LinkedIn <span className="sr-only">(opens in a new tab)</span>
                      <span aria-hidden className="ml-1.5 font-mono text-xs">↗</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-rule pt-6 font-mono text-[11px] tracking-[0.08em] text-ink-3 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Nuvakin. All rights reserved.</p>
          <Link href="/#top" className="inline-flex min-h-9 items-center hover:text-ink">
            Back to top <span aria-hidden className="ml-2">↑</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
