"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Page-wide progressive enhancements kept in one small client island:
 * - reveals elements marked `data-reveal` as they enter the viewport
 * - records clicks on elements marked `data-track-cta` (waitlist CTAs)
 */
export function ClientEnhancements() {
  useEffect(() => {
    const root = document.documentElement;
    // The inline guard in layout.tsx withdraws reveal styles unless this runs in time.
    // If it already has, content is visible and there is nothing to animate.
    if (!root.classList.contains("js")) return addCtaTracking();
    root.classList.add("reveal-ready");

    const targets = document.querySelectorAll("[data-reveal]");
    let notified = false;
    const observer = new IntersectionObserver(
      (entries) => {
        notified = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => observer.observe(el));
    // Observers always report once when observation starts. If that never arrives,
    // the observer is broken; show everything rather than leave content hidden.
    const fallback = window.setTimeout(() => {
      if (notified) return;
      observer.disconnect();
      targets.forEach((el) => el.classList.add("is-visible"));
    }, 2000);
    const removeCtaTracking = addCtaTracking();

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
      removeCtaTracking();
    };
  }, []);

  return null;
}

function addCtaTracking() {
  const onClick = (event: MouseEvent) => {
    const cta = (event.target as Element).closest<HTMLElement>("[data-track-cta]");
    if (cta) track("waitlist_cta_click", { location: cta.dataset.trackCta ?? "unknown" });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
