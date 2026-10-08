import { SectionHeading, SectionRule } from "@/components/ui/SectionHeading";
import { EvidenceExplorer } from "@/components/evidence/EvidenceExplorer";
import { Findings } from "@/components/evidence/Findings";
import { researchFindings } from "@/content/research";

const principles = [
  { title: "Traceable", body: "Every data point carries its source, so it can be checked." },
  { title: "Current", body: "Requirements, fees and policies change. Records are dated and revisited." },
  { title: "Clear about uncertainty", body: "Where information is unconfirmed or conflicting, Nuvakin says so rather than smoothing it over." },
];

export function Evidence() {
  return (
    <section aria-labelledby="evidence-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="evidence" className="container-page">
        <SectionRule />
        <SectionHeading
          className="pt-10 lg:pt-14"
          index="05"
          label="Why evidence matters"
          id="evidence-title"
          title={
            <>
              Built around <span className="text-tangerine italic">evidence.</span>
            </>
          }
          lead="Better decisions need better information. Nuvakin is building intelligence grounded in structured, traceable information — so that when something matters to a decision, you can see where it came from."
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <ul className="border-t border-rule lg:col-span-3 lg:col-start-4">
            {principles.map((p, i) => (
              <li key={p.title} className="border-b border-rule py-6" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                <h3 className="font-display text-[1.625rem] leading-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="lg:col-span-6" data-reveal>
            <EvidenceExplorer />
          </div>
        </div>

        <Findings findings={researchFindings} />
      </div>
    </section>
  );
}
