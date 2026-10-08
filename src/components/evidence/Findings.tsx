import type { ResearchFinding } from "@/content/research";

/** Cited research findings. Renders nothing when there are none to show. */
export function Findings({ findings }: { findings: ResearchFinding[] }) {
  if (findings.length === 0) return null;
  return (
    <div className="mt-20 grid gap-8 lg:grid-cols-12">
      <p className="eyebrow lg:col-span-3">Research</p>
      <ol className="grid gap-px border-y border-rule sm:grid-cols-2 lg:col-span-9">
        {findings.map((f, i) => (
          <li key={i} className="py-8 sm:pr-8">
            {f.figure && <p className="font-display text-5xl leading-none text-tangerine">{f.figure}</p>}
            <p className="mt-4 max-w-[28rem] text-ink">{f.statement}</p>
            <p className="mt-4 font-mono text-[11px] tracking-wide text-ink-3">
              Source:{" "}
              {f.source.url ? (
                <a href={f.source.url} className="underline decoration-rule-strong underline-offset-4 hover:text-ink" rel="noopener" target="_blank">
                  {f.source.label}
                </a>
              ) : (
                f.source.label
              )}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
