import { SectionHeading, SectionRule } from "@/components/ui/SectionHeading";
import { IntelligenceSequence } from "./IntelligenceSequence";

export function Intelligence() {
  return (
    <section aria-labelledby="intelligence-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="intelligence" className="container-page">
        <SectionRule />
        <SectionHeading
          className="pt-10 lg:pt-14"
          index="02"
          label="The intelligence concept"
          id="intelligence-title"
          title={
            <>
              From source <span className="text-ink-3">to</span> decision.
            </>
          }
          lead="Intelligence is information that has been checked, given structure and connected to what matters. Follow one programme record as it takes shape."
        />
        <div className="mt-14 lg:mt-20">
          <IntelligenceSequence />
        </div>
      </div>
    </section>
  );
}
