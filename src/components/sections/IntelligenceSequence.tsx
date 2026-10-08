"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

type Status = "verified" | "conflict" | "pending";

type Datum = {
  field: string;
  raw: string;
  source: string;
  status: Status;
  statusNote: string;
  value: string;
  ref: number;
  compare: [string, string];
  drift: [string, number];
};

const data: Datum[] = [
  {
    field: "Duration",
    raw: "“3 yrs full-time, 4 with placement”",
    source: "prospectus.pdf",
    status: "verified",
    statusNote: "2 sources agree",
    value: "3 years + optional placement",
    ref: 1,
    compare: ["3 years", "4 years"],
    drift: ["1.25rem", -1.2],
  },
  {
    field: "Entry",
    raw: "A-level Maths or equivalent",
    source: "programme page",
    status: "verified",
    statusNote: "Confirmed",
    value: "Mathematics, advanced level",
    ref: 2,
    compare: ["Maths + a science", "Mathematics"],
    drift: ["-0.25rem", 0.9],
  },
  {
    field: "Tuition",
    raw: "see fees & funding page ↗",
    source: "fees page",
    status: "pending",
    statusNote: "Awaiting current year",
    value: "Published per year · update pending",
    ref: 3,
    compare: ["Published per year", "Published per year"],
    drift: ["2rem", -0.5],
  },
  {
    field: "Intake",
    raw: "intake: Sept? Jan?",
    source: "faq",
    status: "conflict",
    statusNote: "Sources disagree",
    value: "September · January unconfirmed",
    ref: 4,
    compare: ["September", "September, January"],
    drift: ["0.5rem", 1.4],
  },
  {
    field: "Location",
    raw: "city centre campus",
    source: "maps",
    status: "verified",
    statusNote: "Confirmed",
    value: "City campus",
    ref: 2,
    compare: ["Suburban campus", "City campus"],
    drift: ["2.75rem", -1.6],
  },
];

const stages = [
  { title: "Source information", short: "Source", body: "Details arrive in many formats from many places — brochures, web pages, documents." },
  { title: "Validation", short: "Validate", body: "Each detail is checked against its sources. Agreement is confirmed; conflicts and gaps are flagged, not hidden." },
  { title: "Structure", short: "Structure", body: "Validated details become consistent fields — the same shape for every programme." },
  { title: "Intelligence", short: "Connect", body: "Records connect: to similar programmes, to related career directions, and to their own history of change." },
  { title: "Decision support", short: "Decide", body: "Programmes can be compared like for like, so a shortlist is built with the evidence in view." },
];

const panelSummary = [
  "5 fragments · 5 sources · unsorted",
  "3 confirmed · 1 conflict · 1 pending",
  "5 fields · consistent structure",
  "4 connections",
  "3 programmes · like for like",
];

const connections = [
  { label: "Similar programmes", detail: "2 comparable records" },
  { label: "Career directions", detail: "Linked via Career GPS" },
  { label: "Change history", detail: "1 update since last check" },
  { label: "Open questions", detail: "January intake" },
];

const statusStyle: Record<Status, string> = {
  verified: "text-cobalt-text border-cobalt/50",
  conflict: "text-tangerine border-tangerine/50",
  pending: "text-taupe border-taupe/50",
};
const statusGlyph: Record<Status, string> = { verified: "✓", conflict: "≠", pending: "…" };

const STEP_MS = 3400;

export function IntelligenceSequence() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasAutoplayed = useRef(false);

  // Play through once when the sequence first comes into view.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoplayed.current) {
          hasAutoplayed.current = true;
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || stage >= stages.length - 1) return;
    const timer = window.setTimeout(() => {
      setStage(stage + 1);
      if (stage + 1 >= stages.length - 1) setPlaying(false);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, stage]);

  const select = useCallback((index: number, focus = false) => {
    hasAutoplayed.current = true;
    setPlaying(false);
    setStage(index);
    if (focus) tabs.current[index]?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: stage + 1,
      ArrowDown: stage + 1,
      ArrowLeft: stage - 1,
      ArrowUp: stage - 1,
      Home: 0,
      End: stages.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select((keys[event.key] + stages.length) % stages.length, true);
  };

  const togglePlay = () => {
    hasAutoplayed.current = true;
    if (playing) return setPlaying(false);
    if (stage >= stages.length - 1) setStage(0);
    setPlaying(true);
  };

  const s = stage + 1;
  const structured = s >= 3;

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* Stage controls */}
      <div className="lg:col-span-4">
        <div role="tablist" aria-label="Stages from information to decision" aria-orientation="vertical" onKeyDown={onKeyDown} className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-rule">
          {stages.map((item, i) => {
            const active = i === stage;
            return (
              <button
                key={item.title}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`stage-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="stage-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative min-h-11 text-left transition-colors lg:border-b lg:border-rule lg:py-5 ${active ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
              >
                <span aria-hidden className="block h-0.5 w-full overflow-hidden bg-rule lg:hidden">
                  <span className={`block h-full bg-tangerine transition-[width] duration-500 ${i <= stage ? "w-full" : "w-0"}`} />
                </span>
                <span className="mt-2.5 flex items-baseline gap-3 lg:mt-0">
                  <span className={`font-mono text-xs ${active ? "text-tangerine" : ""}`}>0{i + 1}</span>
                  <span className="font-display hidden text-[1.375rem] leading-tight lg:inline">{item.title}</span>
                  <span className="hidden text-xs sm:inline lg:hidden">{item.short}</span>
                </span>
                <span
                  className={`hidden overflow-hidden text-[0.9375rem] leading-relaxed text-ink-2 transition-[max-height,opacity,margin] duration-500 lg:block ${
                    active ? "mt-3 max-h-40 pl-8 opacity-100" : "max-h-0 pl-8 opacity-0"
                  }`}
                >
                  {item.body}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile stage description */}
        <div className="mt-6 lg:hidden" aria-hidden>
          <p className="font-display text-2xl text-ink">{stages[stage].title}</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{stages[stage].body}</p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="eyebrow mt-6 inline-flex min-h-11 items-center gap-2.5 text-ink-2 transition-colors hover:text-ink"
        >
          <span aria-hidden className="font-sans text-[0.8rem]">{playing ? "❙❙" : "▶"}</span>
          {playing ? "Pause sequence" : stage >= stages.length - 1 ? "Replay sequence" : "Play sequence"}
        </button>
      </div>

      {/* Visual panel */}
      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${stage}`}
        aria-live={playing ? "off" : "polite"}
        className="relative overflow-hidden rounded-[4px] border border-rule-strong bg-navy-raised/70 p-5 sm:p-8 lg:col-span-8 lg:min-h-[28rem]"
      >
        <p className="sr-only">
          {stages[stage].title}: {stages[stage].body}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-4">
          <p className="eyebrow">
            {s === 5 ? "Shortlist view" : s >= 3 ? "Programme record · Example A" : "Incoming details · Example A"}
          </p>
          <p className="font-mono text-[11px] tracking-wide text-cobalt-text">{panelSummary[stage]}</p>
        </div>

        <div className={`grid gap-8 ${s === 4 ? "md:grid-cols-[1fr_13rem]" : ""}`}>
          <div>
            {s === 5 && (
              <div aria-hidden className="grid grid-cols-[1fr_1fr_1fr] gap-3 pt-5 pb-2 font-mono text-[10.5px] tracking-[0.12em] uppercase sm:ml-[7.5rem]">
                <span className="text-tangerine">Example A</span>
                <span className="text-ink-3">Example B</span>
                <span className="text-ink-3">Example C</span>
              </div>
            )}
            <ul className={structured ? "" : "space-y-4 pt-6"}>
              {data.map((d, i) => {
                const drift = s === 1 ? d.drift : s === 2 ? ([`calc(${d.drift[0]} / 3)`, d.drift[1] / 3] as const) : null;
                return (
                  <li
                    key={d.field}
                    className={`grid items-baseline transition-[grid-template-columns,transform,padding,border-color] duration-700 ease-[var(--ease-calm)] ${
                      structured ? "border-b border-rule py-3.5" : "border-b border-transparent"
                    } ${s === 5 ? "grid-cols-1 gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-0" : structured ? "grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[7.5rem_1fr_auto]" : "grid-cols-[0rem_1fr_auto]"}`}
                    style={{
                      transform: drift ? `translateX(${drift[0]}) rotate(${drift[1]}deg)` : "none",
                      transitionDelay: `${i * 45}ms`,
                    }}
                  >
                    <span className={`eyebrow overflow-hidden whitespace-nowrap transition-opacity duration-500 ${structured ? "opacity-100" : "opacity-0"}`}>
                      {d.field}
                    </span>

                    {s === 5 ? (
                      <span className="grid grid-cols-3 gap-3 text-[0.8125rem] leading-snug sm:text-sm">
                        <span className="text-ink">{d.value.split(" · ")[0]}</span>
                        <span className="text-ink-2">{d.compare[0]}</span>
                        <span className="text-ink-2">{d.compare[1]}</span>
                      </span>
                    ) : (
                      <span className="relative grid min-w-0">
                        <span
                          className={`col-start-1 row-start-1 w-fit max-w-full rounded-[2px] border border-dashed border-taupe/45 px-3 py-2 font-mono text-xs text-ink-2 transition-opacity duration-500 sm:text-[0.8125rem] ${
                            structured ? "pointer-events-none absolute top-0 left-0 opacity-0" : "opacity-100"
                          }`}
                        >
                          <span className="block text-[9.5px] tracking-[0.12em] text-taupe uppercase">{d.source}</span>
                          {d.raw}
                        </span>
                        <span className={`col-start-1 row-start-1 text-[0.9375rem] text-ink transition-opacity duration-500 ${structured ? "opacity-100" : "opacity-0"}`}>
                          {d.value}
                        </span>
                      </span>
                    )}

                    {s === 2 && (
                      <span className={`ml-3 inline-flex items-center gap-1.5 self-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] whitespace-nowrap ${statusStyle[d.status]}`}>
                        <span aria-hidden>{statusGlyph[d.status]}</span>
                        <span className="hidden sm:inline">{d.statusNote}</span>
                        <span className="sr-only sm:hidden">{d.statusNote}</span>
                      </span>
                    )}
                    {(s === 3 || s === 4) && (
                      <span className={`ml-3 font-mono text-[11px] ${d.status === "verified" ? "text-cobalt-text" : statusStyle[d.status].split(" ")[0]}`}>
                        [{d.ref}]
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {s === 5 && (
              <div className="grid grid-cols-1 gap-1.5 pt-4 sm:grid-cols-[7.5rem_1fr] sm:gap-0">
                <span className="eyebrow">Evidence</span>
                <span className="grid grid-cols-3 gap-3 font-mono text-[10.5px] tracking-wide">
                  <span className="text-tangerine">1 open question</span>
                  <span className="text-cobalt-text">Verified</span>
                  <span className="text-cobalt-text">Verified</span>
                </span>
              </div>
            )}
          </div>

          {s === 4 && (
            <ul className="seq-fade space-y-0 self-start border-t border-rule md:mt-5 md:border-t-0 md:border-l md:pl-6" aria-label="Connections">
              {connections.map((c) => (
                <li key={c.label} className="relative border-b border-rule py-3 last:border-b-0">
                  <span aria-hidden className="absolute top-[1.35rem] -left-6 hidden h-px w-4 bg-cobalt md:block" />
                  <span className="eyebrow block text-cobalt-text">{c.label}</span>
                  <span className="mt-1 block text-sm text-ink-2">{c.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 font-mono text-[10.5px] tracking-[0.12em] text-ink-3 uppercase">Conceptual illustration · example data</p>
      </div>
    </div>
  );
}
