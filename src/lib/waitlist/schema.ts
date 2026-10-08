/**
 * Waitlist validation shared by the form (instant feedback) and the API route
 * (authoritative). Keep the rules here so the two can never drift apart.
 */
export type WaitlistField = "name" | "email" | "phone";
export type WaitlistInput = Record<WaitlistField, string>;
export type FieldErrors = Partial<Record<WaitlistField, string>>;

export const LIMITS = { name: 100, email: 254, phone: 24 } as const;

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_CHARS = /^\+?[\d\s().-]+$/;
const LINKISH = /(https?:\/\/|www\.|<|>)/i;

export function normalize(input: WaitlistInput): WaitlistInput {
  return {
    name: input.name.trim().replace(/\s+/g, " "),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim().replace(/\s+/g, " "),
  };
}

export function validateField(field: WaitlistField, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Please enter your full name.";
      if (value.length > LIMITS.name) return "That name is too long.";
      if (!/\p{L}/u.test(value) || LINKISH.test(value)) return "Please enter a valid name.";
      return;
    case "email":
      if (!value) return "Please enter your email address.";
      if (value.length > LIMITS.email || !EMAIL.test(value) || value.includes(".."))
        return "Please enter a valid email address, like name@example.com.";
      return;
    case "phone": {
      if (!value) return "Please enter your phone number.";
      const digits = value.replace(/\D/g, "");
      if (value.length > LIMITS.phone || !PHONE_CHARS.test(value) || digits.length < 7 || digits.length > 15)
        return "Please enter a valid phone number, ideally with your country code.";
      return;
    }
  }
}

export function validate(input: WaitlistInput): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of ["name", "email", "phone"] as const) {
    const error = validateField(field, input[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

/** Stored phone format: leading "+" (if given) followed by digits only. */
export function canonicalPhone(phone: string) {
  const trimmed = phone.trim();
  return (trimmed.startsWith("+") ? "+" : "") + trimmed.replace(/\D/g, "");
}

/** Minimum time between the form rendering and a genuine submission. */
export const MIN_FILL_MS = 1200;

export type WaitlistResponse =
  | { status: "ok" }
  | { status: "duplicate" }
  | {
      status: "error";
      code: "invalid" | "rate_limited" | "unavailable" | "server_error";
      message: string;
      fieldErrors?: FieldErrors;
    };
