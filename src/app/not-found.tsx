import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="container-page flex min-h-[80svh] flex-col justify-center pt-32 pb-20">
      <p className="eyebrow text-tangerine">404 · No record found</p>
      <h1 id="not-found-title" className="font-display mt-6 max-w-[16ch] text-5xl leading-[1.02] sm:text-6xl">
        This page doesn’t exist.
      </h1>
      <p className="mt-6 max-w-[30rem] text-lg">The link may be out of date. Everything Nuvakin is building starts on the home page.</p>
      <div className="mt-10">
        <ButtonLink href="/">Back to Nuvakin</ButtonLink>
      </div>
    </section>
  );
}
