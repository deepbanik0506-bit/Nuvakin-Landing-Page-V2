import { SectionHeading, SectionRule } from "@/components/ui/SectionHeading";

const qualities = [
  { term: "Structured", detail: "Consistent fields and formats, so one programme can sit beside another." },
  { term: "Evidence-backed", detail: "Each data point linked to the source it came from." },
  { term: "Understandable", detail: "Plain language, with context where it matters." },
  { term: "Comparable", detail: "Like-for-like views across institutions, programmes and routes." },
  { term: "Decision-ready", detail: "Organised around the questions that come up when shortlisting." },
];

export function Building() {
  return (
    <section aria-labelledby="about-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="about" className="container-page">
        <SectionRule />
        <SectionHeading
          className="pt-10 lg:pt-14"
          index="01"
          label="What we are building"
          id="about-title"
          title={
            <>
              Turning information into <span className="text-tangerine italic">intelligence.</span>
            </>
          }
          lead="Education information lives across programme pages, prospectuses, fee schedules and policy documents. Nuvakin is building the infrastructure and products that bring it together as intelligence you can research, compare and decide with."
        />

        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3 lg:pt-2">What makes information useful</p>
          <dl className="border-t border-rule lg:col-span-9">
            {qualities.map((q, i) => (
              <div
                key={q.term}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                className="group grid gap-2 border-b border-rule py-6 sm:grid-cols-[3rem_15rem_1fr] sm:items-baseline sm:gap-6 sm:py-7"
              >
                <span aria-hidden className="eyebrow hidden sm:block">
                  {String.fromCharCode(97 + i)}.
                </span>
                <dt className="font-display text-[1.625rem] leading-tight text-ink transition-colors duration-500 group-hover:text-tangerine sm:text-[1.75rem]">
                  {q.term}
                </dt>
                <dd className="max-w-[30rem] text-ink-2">{q.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
