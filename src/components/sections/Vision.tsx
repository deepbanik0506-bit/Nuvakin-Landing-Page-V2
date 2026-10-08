import { SectionRule } from "@/components/ui/SectionHeading";

export function Vision() {
  return (
    <section aria-labelledby="vision-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="vision" className="container-page">
        <SectionRule />
        <div className="grid gap-6 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-14">
          <p className="eyebrow flex items-center gap-3 self-start lg:col-span-3 lg:pt-5">
            <span className="text-tangerine">06</span>
            <span aria-hidden className="h-px w-6 bg-rule-strong" />
            <span>Vision</span>
          </p>
          <div className="lg:col-span-9">
            <h2
              id="vision-title"
              className="font-display max-w-[20ch] text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[4rem] lg:leading-[1.04]"
              data-reveal
            >
              Education decisions shape years of a life. They should rest on the{" "}
              <span className="text-tangerine italic">clearest information</span> available.
            </h2>
            <div className="mt-14 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2 sm:gap-10 lg:mt-20">
              <p data-reveal>
                Many people take part in these decisions — students, families, counsellors and institutions. Nuvakin is
                building intelligence designed to be useful to all of them, alongside the guidance people already rely
                on.
              </p>
              <p data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                We are starting with education information: programmes, requirements and the routes between them. The
                intelligence layer underneath is designed to grow from there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
