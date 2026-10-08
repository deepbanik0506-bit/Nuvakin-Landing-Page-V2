import type { ReactNode } from "react";

type Props = {
  index: string;
  label: string;
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
};

/**
 * The editorial "ledger" header used by each section: an index and label in
 * the margin column, the headline and lead in the content column.
 */
export function SectionHeading({ index, label, id, title, lead, className = "" }: Props) {
  return (
    <header className={`grid gap-6 lg:grid-cols-12 lg:gap-8 ${className}`}>
      <p className="eyebrow flex items-center gap-3 self-start lg:col-span-3 lg:pt-5">
        <span className="text-tangerine">{index}</span>
        <span aria-hidden className="h-px w-6 bg-rule-strong" />
        <span>{label}</span>
      </p>
      <div className="lg:col-span-9">
        <h2 id={id} className="font-display max-w-[18ch] text-[2.25rem] leading-[1.04] sm:text-5xl lg:text-[3.75rem]" data-reveal>
          {title}
        </h2>
        {lead && (
          <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}

/** Full-width hairline that opens a section. */
export function SectionRule() {
  return <div aria-hidden className="h-px w-full bg-rule" />;
}
