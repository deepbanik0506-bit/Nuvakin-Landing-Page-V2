"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mark, Wordmark } from "@/components/brand/Logo";
import { navigation } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOnDesktop = () => window.innerWidth >= 1024 && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    document.getElementById("main")?.setAttribute("inert", "");
    firstLink.current?.focus();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.documentElement.style.overflow = "";
      document.getElementById("main")?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        solid ? "border-b border-rule bg-navy/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/#top" className="flex items-center gap-2.5 text-ink" aria-label="Nuvakin — back to top" onClick={() => setOpen(false)}>
          <Mark className="h-7 w-auto" />
          <Wordmark className="h-[0.95rem] w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#waitlist"
            data-track-cta="header"
            className="inline-flex min-h-10 items-center rounded-[3px] border border-tangerine/60 px-4 text-sm text-ink transition-colors hover:border-tangerine hover:bg-tangerine hover:text-navy"
          >
            Join the Waitlist
          </Link>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="-mr-2 flex min-h-11 min-w-11 items-center justify-center gap-2.5 px-2 text-sm text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="eyebrow text-ink">{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-3 w-5">
            <span className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
            <span className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-rule bg-navy lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex h-full flex-col pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ul className="divide-y divide-rule border-y border-rule">
            {navigation.map((item, i) => (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-baseline justify-between py-4 font-display text-[2rem] text-ink"
                >
                  {item.label}
                  <span aria-hidden className="eyebrow">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#waitlist"
            data-track-cta="mobile-menu"
            onClick={() => setOpen(false)}
            className="mt-auto flex min-h-14 items-center justify-between rounded-[3px] bg-tangerine px-5 font-medium text-navy"
          >
            Join the Waitlist <span aria-hidden className="font-mono">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
