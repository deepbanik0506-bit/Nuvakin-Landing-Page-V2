"use client";

import { useState } from "react";

type Source = { id: number; title: string; kind: string; retrieved: string; status: string; tone: "verified" | "open" };

const sources: Source[] = [
  { id: 1, title: "Programme specification", kind: "Institution publication", retrieved: "14 days ago", status: "Verified against 2 sources", tone: "verified" },
  { id: 2, title: "Programme page", kind: "Official website", retrieved: "3 days ago", status: "Verified", tone: "verified" },
  { id: 4, title: "Admissions FAQ", kind: "Secondary page", retrieved: "3 days ago", status: "Conflicts with programme page — flagged for review", tone: "open" },
];

const statements: { text: string; cites: number[] }[] = [
  { text: "Three years full-time, with an optional placement year.", cites: [1, 2] },
  { text: "Entry requires mathematics at an advanced level.", cites: [2] },
  { text: "Intake is in September. A January intake is unconfirmed.", cites: [2, 4] },
];

/** Illustrative citation UI: every statement links to the sources behind it. */
export function EvidenceExplorer() {
  const [active, setActive] = useState(1);
  const source = sources.find((s) => s.id === active)!;

  return (
    <figure className="rounded-[4px] border border-rule-strong bg-navy-raised/70" aria-labelledby="evidence-caption">
      <div className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-4 sm:px-7">
        <p className="eyebrow">BSc Data Science · Example University</p>
        <p className="eyebrow hidden text-cobalt-text sm:block">Select a source</p>
      </div>

      <ul className="divide-y divide-rule px-5 sm:px-7">
        {statements.map((st) => (
          <li key={st.text} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 py-4">
            <span className="text-[0.9375rem] text-ink sm:text-base">{st.text}</span>
            <span className="flex gap-1.5">
              {st.cites.map((id) => {
                const isActive = id === active;
                const open = sources.find((s) => s.id === id)?.tone === "open";
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="evidence-source"
                    aria-label={`Show source ${id}`}
                    onClick={() => setActive(id)}
                    className={`min-h-9 min-w-9 rounded-[2px] border font-mono text-xs transition-colors ${
                      isActive
                        ? open
                          ? "border-tangerine bg-tangerine text-navy"
                          : "border-cobalt-text bg-cobalt-text text-navy"
                        : open
                          ? "border-tangerine/45 text-tangerine hover:border-tangerine"
                          : "border-cobalt/45 text-cobalt-text hover:border-cobalt"
                    }`}
                  >
                    {id}
                  </button>
                );
              })}
            </span>
          </li>
        ))}
      </ul>

      <div id="evidence-source" aria-live="polite" className="border-t border-rule bg-navy-deep/60 px-5 py-5 sm:px-7">
        <dl key={source.id} className="seq-fade grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2.5 text-sm">
          <dt className="eyebrow pt-0.5">Source {source.id}</dt>
          <dd className="font-display text-lg leading-tight text-ink">{source.title}</dd>
          <dt className="eyebrow pt-0.5">Type</dt>
          <dd className="text-ink-2">{source.kind}</dd>
          <dt className="eyebrow pt-0.5">Retrieved</dt>
          <dd className="text-ink-2">{source.retrieved}</dd>
          <dt className="eyebrow pt-0.5">Status</dt>
          <dd className={source.tone === "open" ? "text-tangerine" : "text-cobalt-text"}>{source.status}</dd>
        </dl>
      </div>

      <figcaption id="evidence-caption" className="border-t border-rule px-5 py-3 font-mono text-[10.5px] tracking-[0.12em] text-ink-3 uppercase sm:px-7">
        Illustrative example — not real programme data
      </figcaption>
    </figure>
  );
}
