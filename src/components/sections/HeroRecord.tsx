import type { CSSProperties } from "react";

/**
 * Hero visual: loose source fragments drop into one structured, sourced
 * record. Plays once on load; static under reduced motion.
 * Fragments and their drop lines share a 100 × 36 coordinate space (the zone
 * stretches taller on small screens). Each fragment is anchored by an edge so
 * it stays in frame, and `x` — where its line drops — is placed so that no line
 * passes beneath another fragment.
 */

type Fragment = {
  source: string;
  text: string;
  edge: { left: number } | { right: number };
  x: number;
  y: number;
  r: number;
  delay: number;
};

const fragments: Fragment[] = [
  { source: "prospectus.pdf", text: "“3 yrs FT, 4 w/ placement”", edge: { left: 0 }, x: 4, y: 6, r: -2, delay: 100 },
  { source: "fees page", text: "tuition — see funding ↗", edge: { right: 0 }, x: 96, y: 5, r: 1.5, delay: 220 },
  { source: "programme page", text: "A-level Maths or equiv.", edge: { left: 9 }, x: 22, y: 20, r: 1, delay: 340 },
  { source: "faq", text: "intake: Sept? Jan?", edge: { left: 52 }, x: 57, y: 18, r: -1.5, delay: 460 },
  { source: "maps", text: "city centre campus", edge: { right: 6 }, x: 82, y: 30, r: 2, delay: 580 },
];

const rows = [
  { field: "Duration", value: "3 years · placement year optional", source: 1 },
  { field: "Entry", value: "Mathematics at advanced level", source: 2 },
  { field: "Tuition", value: "Published per academic year", source: 3 },
  { field: "Intake", value: "September", source: 2 },
  { field: "Location", value: "City campus", source: 1 },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function HeroRecord() {
  return (
    <figure className="relative mx-auto w-full max-w-[34rem] [container-type:inline-size]" aria-labelledby="hero-record-caption">
      {/* Fragments zone */}
      <div aria-hidden className="relative aspect-[100/50] sm:aspect-[100/38]">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 36" preserveAspectRatio="none">
          {fragments.map((f, i) => (
            <path
              key={f.source}
              className="hero-link"
              d={`M${f.x} ${f.y} V 36`}
              fill="none"
              stroke="var(--color-cobalt)"
              strokeOpacity={0.55}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              style={vars({ "--delay": `${700 + i * 90}ms` })}
            />
          ))}
        </svg>
        {fragments.map((f, i) => (
          <div
            key={f.source}
            className="absolute -translate-y-1/2"
            style={{
              ...("left" in f.edge ? { left: `${f.edge.left}%` } : { right: `${f.edge.right}%` }),
              top: `${(f.y / 36) * 100}%`,
            }}
          >
            <div
              className="hero-fragment whitespace-nowrap rounded-[2px] border border-dashed border-taupe/45 bg-navy px-[1.6cqw] py-[0.9cqw] font-mono leading-tight"
              style={vars({
                "--rest-r": `${f.r}deg`,
                "--from-r": `${f.r * 3}deg`,
                "--from-x": `${i % 2 ? 10 : -10}px`,
                "--from-y": "-8px",
                "--rest-opacity": 0.92,
                "--delay": `${f.delay}ms`,
              })}
            >
              <span className="block text-[clamp(7px,1.9cqw,9.5px)] tracking-[0.12em] text-taupe uppercase">{f.source}</span>
              <span className="block text-[clamp(9px,2.7cqw,12.5px)] text-ink-2">{f.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Structured record */}
      <div className="hero-fade relative rounded-[4px] border border-rule-strong bg-navy-raised/90 px-[5cqw] pt-[5cqw] pb-[4cqw]" style={vars({ "--delay": "1100ms" })}>
        {fragments.map(({ x }) => (
          <span
            key={x}
            aria-hidden
            className="absolute -top-[3.5px] size-[6px] -translate-x-1/2 rounded-full bg-cobalt ring-[3px] ring-navy-raised"
            style={{ left: `${x}%` }}
          />
        ))}
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow text-[clamp(9px,2.3cqw,11px)]">Intelligence record</span>
          <span className="flex items-center gap-2 font-mono text-[clamp(9px,2.3cqw,11px)] tracking-wide text-cobalt-text">
            <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-cobalt" />3 sources · verified
          </span>
        </div>
        <p className="font-display mt-[3.5cqw] text-[clamp(1.375rem,6.4cqw,2.125rem)] leading-none text-ink">BSc Data Science</p>
        <p className="mt-[1.6cqw] text-[clamp(11px,3cqw,14px)] text-ink-3">Example University</p>

        <dl className="mt-[4.5cqw] border-t border-rule">
          {rows.map((row, i) => (
            <div
              key={row.field}
              className="hero-row grid grid-cols-[minmax(4.5rem,25cqw)_1fr_auto] items-baseline gap-3 border-b border-rule py-[2.3cqw]"
              style={vars({ "--delay": `${1350 + i * 110}ms` })}
            >
              <dt className="eyebrow text-[clamp(8.5px,2.2cqw,10.5px)]">{row.field}</dt>
              <dd className="text-[clamp(12px,3.3cqw,15px)] leading-snug text-ink">{row.value}</dd>
              <dd className="font-mono text-[clamp(9px,2.3cqw,11px)] text-cobalt-text">
                <span className="sr-only">Source </span>[{row.source}]
              </dd>
            </div>
          ))}
        </dl>

        <div className="hero-fade mt-[3.5cqw] flex items-center justify-between gap-3 font-mono text-[clamp(8.5px,2.2cqw,10.5px)] tracking-wide text-ink-3 uppercase" style={vars({ "--delay": "2000ms" })}>
          <span>Last checked · 3 days ago</span>
          <span className="text-taupe">Review scheduled</span>
        </div>
      </div>

      <figcaption id="hero-record-caption" className="mt-4 font-mono text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">
        Illustrative example — not real programme data
      </figcaption>
    </figure>
  );
}
