import { SectionHeading, SectionRule } from "@/components/ui/SectionHeading";

const steps = [
  { verb: "Collect", detail: "Gather education information from official and relevant sources — programme pages, institutional publications, policy documents." },
  { verb: "Validate", detail: "Cross-check details against their sources, flag conflicts, and record where every fact came from." },
  { verb: "Structure", detail: "Organise what is confirmed into consistent records that can sit side by side." },
  { verb: "Maintain", detail: "Requirements, fees and policies change. Records are dated and revisited, and changes are tracked." },
  { verb: "Serve", detail: "Deliver structured, sourced intelligence to Nuvakin products — and to the people using them." },
];

export function Platform() {
  return (
    <section aria-labelledby="platform-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="platform" className="container-page">
        <SectionRule />
        <SectionHeading
          className="pt-10 lg:pt-14"
          index="03"
          label="How Nuvakin works"
          id="platform-title"
          title={
            <>
              The Nuvakin Intelligence Platform<span className="text-tangerine">.</span>
            </>
          }
          lead={
            <>
              <span className="text-ink">NIP</span> is the intelligence layer underneath everything Nuvakin builds. It
              turns scattered education information into a maintained, structured foundation — so every product starts
              from the same sourced information.
            </>
          }
        />

        <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-9 lg:col-start-4">
            {/* Re-check loop: Maintain returns to Validate (desktop) */}
            <svg
              aria-hidden
              className="absolute -top-14 left-[20%] hidden h-14 w-[40%] overflow-visible lg:block"
              viewBox="0 0 300 56"
              preserveAspectRatio="none"
            >
              <path d="M300 56 C 300 6, 0 6, 0 56" fill="none" stroke="var(--color-cobalt)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
              <path d="M-5 46 L0 56 L5 46" fill="none" stroke="var(--color-cobalt)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <p aria-hidden className="eyebrow absolute -top-[4.6rem] left-[40%] hidden -translate-x-1/2 bg-navy px-3 text-cobalt-text lg:block">
              Continuous re-checking
            </p>

            <ol className="relative grid gap-0 border-l border-rule-strong pl-7 lg:grid-cols-5 lg:border-t lg:border-l-0 lg:pl-0">
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <li key={step.verb} className="relative pb-10 last:pb-0 lg:pt-8 lg:pr-6 lg:pb-0" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                    <span
                      aria-hidden
                      className={`absolute top-1.5 -left-[calc(1.75rem+5px)] size-[9px] rounded-full lg:-top-[5px] lg:left-0 ${
                        last ? "bg-tangerine" : "border border-cobalt bg-navy"
                      }`}
                    />
                    <span className="eyebrow">{`0${i + 1}`}</span>
                    <h3 className={`font-display mt-2 text-[1.75rem] leading-none ${last ? "text-tangerine" : "text-ink"}`}>{step.verb}</h3>
                    <p className="mt-3 max-w-[28rem] text-[0.9375rem] leading-relaxed text-ink-2">{step.detail}</p>
                    {step.verb === "Maintain" && (
                      <p className="eyebrow mt-3 text-cobalt-text lg:hidden">↺ Loops back to validation</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
