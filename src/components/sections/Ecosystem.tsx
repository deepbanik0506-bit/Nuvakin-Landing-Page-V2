import type { ReactNode } from "react";
import { SectionHeading, SectionRule } from "@/components/ui/SectionHeading";

const products = [
  {
    kicker: "Career intelligence",
    name: "Career GPS",
    body: "Explore career directions with structured information about roles, skills and the education routes connected to them.",
    tag: "Built on NIP",
  },
  {
    kicker: "Education intelligence",
    name: "Education decision experiences",
    body: "Research, understand, compare and shortlist education options with structured, sourced information.",
    tag: "Built on NIP",
  },
];

const sources = ["Programme information", "Institutional publications", "Policy & regulation", "Career information"];

function Layer({ label, children, connector = true }: { label: string; children: ReactNode; connector?: boolean }) {
  return (
    <div className="grid gap-3 lg:grid-cols-12 lg:gap-8">
      <p className="eyebrow lg:col-span-3 lg:pt-6">{label}</p>
      <div className="relative lg:col-span-9">
        {children}
        {connector && (
          <div aria-hidden className="grid h-10 sm:h-12 md:grid-cols-2">
            <span className="mx-auto w-px bg-gradient-to-b from-cobalt/70 to-cobalt/20" />
            <span className="mx-auto hidden w-px bg-gradient-to-b from-cobalt/70 to-cobalt/20 md:block" />
          </div>
        )}
      </div>
    </div>
  );
}

export function Ecosystem() {
  return (
    <section aria-labelledby="products-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="products" className="container-page">
        <SectionRule />
        <SectionHeading
          className="pt-10 lg:pt-14"
          index="04"
          label="Products & ecosystem"
          id="products-title"
          title={
            <>
              One foundation. <span className="text-tangerine italic">Many decisions.</span>
            </>
          }
          lead="Nuvakin is organised as shared intelligence infrastructure with products built on top. Each product draws on the same structured, sourced information."
        />

        <div className="mt-16 lg:mt-24" data-reveal>
          <Layer label="Decisions">
            <p className="border-y border-rule py-5 font-display text-xl text-ink sm:text-2xl">
              People researching, comparing and choosing education options
              <span className="mt-1 block font-sans text-sm text-ink-3">
                Students, families, and the counsellors and institutions who support them
              </span>
            </p>
          </Layer>

          <Layer label="Intelligence products">
            <ul className="grid border-y border-rule md:grid-cols-2">
              {products.map((p, i) => (
                <li key={p.name} className={`relative py-7 md:py-9 ${i === 1 ? "border-t border-rule md:border-t-0 md:border-l md:pl-8" : "md:pr-8"}`}>
                  <p className="eyebrow text-cobalt-text">{p.kicker}</p>
                  <h3 className={`font-display mt-3 text-[2rem] leading-[1.05] sm:text-[2.25rem] ${i === 0 ? "text-tangerine" : "text-ink"}`}>{p.name}</h3>
                  <p className="mt-4 max-w-[26rem] text-ink-2">{p.body}</p>
                  <p className="eyebrow mt-6 inline-flex items-center gap-2">
                    <span aria-hidden className={`size-1.5 rounded-full bg-cobalt`} />
                    {p.tag}
                  </p>
                </li>
              ))}
            </ul>
          </Layer>

          <Layer label="Intelligence infrastructure">
            <div className="relative overflow-hidden rounded-[4px] border border-cobalt/45 bg-cobalt/[0.07] px-5 py-7 sm:px-8 sm:py-9">
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <h3 className="font-display text-[2rem] leading-none text-ink sm:text-[2.5rem]">NIP</h3>
                <p className="eyebrow text-cobalt-text">Nuvakin Intelligence Platform</p>
              </div>
              <p className="mt-4 max-w-[36rem] text-ink-2">
                The shared layer that collects, validates, structures and maintains education information — and serves
                it to every Nuvakin product.
              </p>
              <ol className="mt-7 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[11px] tracking-[0.1em] text-ink-2 uppercase" aria-label="NIP stages">
                {["Collect", "Validate", "Structure", "Maintain", "Serve"].map((v, i, all) => (
                  <li key={v} className="flex items-center gap-2">
                    <span className={i === all.length - 1 ? "text-tangerine" : ""}>{v}</span>
                    {i < all.length - 1 && <span aria-hidden className="text-cobalt">—</span>}
                  </li>
                ))}
              </ol>
            </div>
          </Layer>

          <Layer label="Sources" connector={false}>
            <ul className="grid grid-cols-2 gap-px overflow-hidden border-y border-rule sm:grid-cols-4" aria-label="Kinds of source information">
              {sources.map((s) => (
                <li key={s} className="py-4 pr-3 font-mono text-[11px] leading-snug tracking-[0.08em] text-taupe uppercase">
                  {s}
                </li>
              ))}
            </ul>
          </Layer>
        </div>
      </div>
    </section>
  );
}
