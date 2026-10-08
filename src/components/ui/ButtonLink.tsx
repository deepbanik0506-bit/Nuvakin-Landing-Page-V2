import type { ComponentProps } from "react";

type Variant = "primary" | "quiet";

const styles: Record<Variant, string> = {
  primary:
    "bg-tangerine text-navy hover:bg-tangerine-soft px-5 sm:px-6 font-medium shadow-[inset_0_-1px_0_rgb(0_0_0/0.15)]",
  quiet: "text-ink hover:text-tangerine px-1 underline decoration-rule-strong underline-offset-[6px] hover:decoration-tangerine",
};

type Props = ComponentProps<"a"> & { variant?: Variant; ctaLocation?: string };

/** Navigational call to action. Always a real link; tracked when it targets the waitlist. */
export function ButtonLink({ variant = "primary", ctaLocation, className = "", children, ...props }: Props) {
  return (
    <a
      {...props}
      data-track-cta={ctaLocation}
      className={`group inline-flex min-h-12 items-center gap-3 rounded-[3px] text-[0.9375rem] transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      <span aria-hidden className="font-mono text-sm transition-transform duration-300 group-hover:translate-x-0.5">
        {variant === "primary" ? "→" : "↓"}
      </span>
    </a>
  );
}
