import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroRecord } from "./HeroRecord";

const verbs = [
  { verb: "Research", note: "Find what is relevant" },
  { verb: "Understand", note: "See what it means" },
  { verb: "Compare", note: "Like for like" },
  { verb: "Shortlist", note: "With the evidence in view" },
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative pt-28 sm:pt-32 lg:pt-40">
      <div className="container-page">
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:pb-10">
            <p className="eyebrow hero-fade flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-tangerine" />
              Structured intelligence for education decisions
            </p>
            <h1
              id="hero-title"
              className="font-display mt-7 text-[clamp(2.85rem,10.5vw,3.75rem)] leading-[0.98] sm:text-[clamp(3.75rem,8vw,5.25rem)] lg:text-[clamp(4.25rem,6.2vw,5.875rem)]"
            >
              Better decisions start with <em className="font-normal text-tangerine italic">better intelligence.</em>
            </h1>
            <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2 sm:text-lg">
              Nuvakin is building structured, evidence-backed intelligence to help people research, understand, compare
              and shortlist education options.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/#waitlist" ctaLocation="hero">
                Join the Waitlist
              </ButtonLink>
              <ButtonLink href="/#about" variant="quiet">
                Explore Nuvakin
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroRecord />
          </div>
        </div>

        <ol className="mt-20 grid grid-cols-2 border-t border-rule sm:mt-24 lg:mt-28 lg:grid-cols-4" aria-label="What Nuvakin helps you do">
          {verbs.map((item, i) => (
            <li
              key={item.verb}
              className={`border-rule py-6 pr-4 ${i % 2 === 1 ? "border-l pl-5" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} lg:py-8 ${
                i > 0 ? "lg:border-l lg:pl-6" : ""
              }`}
            >
              <span className="eyebrow text-tangerine">0{i + 1}</span>
              <p className="font-display mt-3 text-2xl text-ink sm:text-[1.75rem]">{item.verb}</p>
              <p className="mt-1 text-sm text-ink-3">{item.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
