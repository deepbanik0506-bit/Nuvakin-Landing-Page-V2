import { NextResponse, type NextRequest } from "next/server";
import { canonicalPhone, MIN_FILL_MS, normalize, validate, type WaitlistResponse } from "@/lib/waitlist/schema";
import { isRateLimited } from "@/lib/waitlist/rate-limit";
import { appendToSheet } from "@/lib/waitlist/sheet";

const SOURCE = "Nuvakin Website";
const MAX_BODY_BYTES = 2048;

function reply(body: WaitlistResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return reply({ status: "error", code: "invalid", message: "This request could not be accepted." }, 403);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return reply({ status: "error", code: "invalid", message: "This request could not be accepted." }, 413);
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
    if (typeof data !== "object" || data === null) throw new Error();
  } catch {
    return reply({ status: "error", code: "invalid", message: "This request could not be accepted." }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Answer like a success
  // so automated submitters learn nothing, but store nothing.
  if (typeof data.hp === "string" && data.hp.trim() !== "") {
    return reply({ status: "ok" });
  }

  if (isRateLimited(clientKey(request))) {
    return reply(
      { status: "error", code: "rate_limited", message: "Too many attempts. Please wait a few minutes and try again." },
      429,
    );
  }

  const startedAt = Number(data.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return reply(
      { status: "error", code: "rate_limited", message: "That was quick — please wait a moment and submit again." },
      429,
    );
  }

  const input = normalize({
    name: typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    phone: typeof data.phone === "string" ? data.phone : "",
  });
  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length > 0) {
    return reply({ status: "error", code: "invalid", message: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  const result = await appendToSheet({ ...input, phone: canonicalPhone(input.phone), source: SOURCE });
  switch (result) {
    case "ok":
      return reply({ status: "ok" });
    case "duplicate":
      return reply({ status: "duplicate" });
    case "invalid":
      return reply({ status: "error", code: "invalid", message: "Please check your details and try again." }, 422);
    case "unavailable":
      return reply(
        { status: "error", code: "unavailable", message: "The waitlist is temporarily unavailable. Your details were not saved — please try again later." },
        503,
      );
    default:
      return reply(
        { status: "error", code: "server_error", message: "Something went wrong on our side and your details were not saved. Please try again." },
        502,
      );
  }
}
