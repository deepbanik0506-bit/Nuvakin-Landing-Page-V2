import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export function Waitlist() {
  return (
    <section aria-labelledby="waitlist-title" className="pt-24 sm:pt-32 lg:pt-40">
      <div id="waitlist" className="relative border-y border-rule bg-navy-deep/70">
        <div aria-hidden className="absolute top-0 left-0 h-px w-1/3 bg-tangerine" />
        <div className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-tangerine">07</span>
              <span aria-hidden className="h-px w-6 bg-rule-strong" />
              <span>Waitlist</span>
            </p>
            <h2 id="waitlist-title" className="font-display mt-8 text-[2.75rem] leading-[1] sm:text-6xl lg:text-[4.25rem]">
              Join the <span className="text-tangerine italic">waitlist.</span>
            </h2>
            <p className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed">
              Be among the first to use Nuvakin. Leave your details and we’ll be in touch as it opens up.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
