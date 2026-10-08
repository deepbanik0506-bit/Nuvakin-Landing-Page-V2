/**
 * Research findings shown in the Evidence section. Intentionally empty: add an
 * entry only when it is supported by a citable source. The section renders
 * nothing until at least one finding exists.
 *
 * Example:
 * {
 *   figure: "—",
 *   statement: "What the source found, stated as narrowly as the source allows.",
 *   source: { label: "Author, Title (Year)", url: "https://…" },
 * }
 */
export type ResearchFinding = {
  figure?: string;
  statement: string;
  source: { label: string; url?: string };
};

export const researchFindings: ResearchFinding[] = [];
