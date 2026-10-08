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
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

    const onClick = (event: MouseEvent) => {
      const cta = (event.target as Element).closest<HTMLElement>("[data-track-cta]");
      if (cta) track("waitlist_cta_click", { location: cta.dataset.trackCta ?? "unknown" });
    };
    document.addEventListener("click", onClick);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
