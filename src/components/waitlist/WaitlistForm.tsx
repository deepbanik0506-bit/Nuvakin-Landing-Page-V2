"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import {
  LIMITS,
  validate,
  validateField,
  type FieldErrors,
  type WaitlistField,
  type WaitlistInput,
  type WaitlistResponse,
} from "@/lib/waitlist/schema";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; duplicate: boolean; name: string; email: string }
  | { kind: "error"; message: string };

const fields: {
  name: WaitlistField;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: "email" | "tel" | "text";
  placeholder: string;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", inputMode: "text", placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", placeholder: "name@example.com" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "With country code, e.g. +44" },
];

const NETWORK_ERROR = "We couldn’t reach our server, so your details were not saved. Check your connection and try again.";
const GENERIC_ERROR = "Something went wrong and your details were not saved. Please try again.";

export function WaitlistForm() {
  const [values, setValues] = useState<WaitlistInput>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<WaitlistField, boolean>>>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const inFlight = useRef(false);
  const started = useRef(false);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const inputs = useRef<Partial<Record<WaitlistField, HTMLInputElement | null>>>({});
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the outcome and make sure it is on screen — the form collapses
  // on success, and on mobile the keyboard may have shifted the viewport.
  useEffect(() => {
    const target = state.kind === "done" ? doneHeading.current : state.kind === "error" ? errorMessage.current : null;
    if (!target) return;
    if (state.kind === "done") target.focus({ preventScroll: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [state]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("waitlist_form_start");
  };

  const update = (field: WaitlistField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field] || errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    if (state.kind === "error") setState({ kind: "idle" });
  };

  const onBlur = (field: WaitlistField) => {
    if (!values[field]) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, phone: true });
    const firstInvalid = fields.find((f) => found[f.name]);
    if (firstInvalid) {
      inputs.current[firstInvalid.name]?.focus();
      return;
    }

    inFlight.current = true;
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, hp: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const body = (await response.json().catch(() => null)) as WaitlistResponse | null;

      if (response.ok && (body?.status === "ok" || body?.status === "duplicate")) {
        const duplicate = body.status === "duplicate";
        track(duplicate ? "waitlist_submit_duplicate" : "waitlist_submit_success");
        setState({ kind: "done", duplicate, name: values.name.trim().split(/\s+/)[0], email: values.email.trim().toLowerCase() });
        return;
      }

      const failure = body?.status === "error" ? body : null;
      if (failure?.fieldErrors) setErrors(failure.fieldErrors);
      track("waitlist_submit_error", { code: failure?.code ?? `http_${response.status}` });
      setState({ kind: "error", message: failure?.message ?? GENERIC_ERROR });
    } catch {
      track("waitlist_submit_error", { code: "network" });
      setState({ kind: "error", message: NETWORK_ERROR });
    } finally {
      inFlight.current = false;
    }
  }

  if (state.kind === "done") {
    return (
      <div role="status" className="seq-fade border-t border-tangerine pt-8">
        <p className="eyebrow text-tangerine">{state.duplicate ? "Already registered" : "Confirmed"}</p>
        <h3 ref={doneHeading} tabIndex={-1} className="font-display mt-4 text-[2.5rem] leading-none text-ink outline-none sm:text-5xl">
          {state.duplicate ? "You’re already on the list." : "You’re on the list."}
        </h3>
        <p className="mt-5 max-w-[30rem] text-ink-2">
          {state.duplicate ? (
            <>
              <span className="text-ink">{state.email}</span> is already registered — there’s nothing more you need to do.
            </>
          ) : (
            <>
              Thank you, {state.name}. We’ll be in touch at <span className="text-ink">{state.email}</span> as Nuvakin opens up.
            </>
          )}
        </p>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form method="post" action="/api/waitlist" noValidate onSubmit={onSubmit} onFocus={markStarted} aria-describedby="waitlist-privacy" className="relative">
      <div className="space-y-8">
        {fields.map((f) => {
          const error = errors[f.name];
          return (
            <div key={f.name} className="group">
              <label htmlFor={`waitlist-${f.name}`} className="eyebrow block text-ink-2 transition-colors group-focus-within:text-ink">
                {f.label}
              </label>
              <input
                ref={(el) => {
                  inputs.current[f.name] = el;
                }}
                id={`waitlist-${f.name}`}
                name={f.name}
                type={f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                autoCapitalize={f.name === "name" ? "words" : "off"}
                autoCorrect="off"
                spellCheck={false}
                required
                maxLength={LIMITS[f.name]}
                placeholder={f.placeholder}
                value={values[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                onBlur={() => onBlur(f.name)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `waitlist-${f.name}-error` : undefined}
                disabled={submitting}
                className={`mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-lg text-ink transition-[border-color,box-shadow] duration-300 outline-none placeholder:text-ink-3/60 focus:shadow-[0_1px_0_0_var(--color-ink)] focus-visible:outline-none disabled:opacity-60 ${
                  error ? "border-tangerine focus:border-tangerine focus:shadow-[0_1px_0_0_var(--color-tangerine)]" : "border-rule-strong focus:border-ink"
                }`}
              />
              {error && (
                <p id={`waitlist-${f.name}-error`} className="mt-2.5 flex gap-2 text-sm text-tangerine-soft">
                  <span aria-hidden className="font-mono">!</span>
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it.
          Deliberately named so browser autofill never recognises it. */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="waitlist-hp">Leave this field empty</label>
        <input ref={honeypot} id="waitlist-hp" name="nv_hp" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.kind === "error" && (
        <p ref={errorMessage} id="waitlist-error" role="alert" className="mt-8 border-l-2 border-tangerine bg-tangerine/[0.07] px-4 py-3 text-sm text-ink">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="group inline-flex min-h-14 w-full items-center justify-between gap-6 rounded-[3px] bg-tangerine px-6 font-medium text-navy transition-colors hover:bg-tangerine-soft disabled:cursor-progress disabled:bg-tangerine/70 sm:w-auto sm:min-w-[15rem]"
        >
          {submitting ? "Joining…" : "Join the Waitlist"}
          <span aria-hidden className={`font-mono ${submitting ? "animate-pulse" : "transition-transform group-hover:translate-x-0.5"}`}>
            {submitting ? "···" : "→"}
          </span>
        </button>
        <p id="waitlist-privacy" className="max-w-[18rem] text-[0.8125rem] leading-snug text-ink-3">
          We’ll only use these details to contact you about Nuvakin.
        </p>
      </div>
    </form>
  );
}
