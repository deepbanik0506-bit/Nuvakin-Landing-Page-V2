import "server-only";

export type SheetResult = "ok" | "duplicate" | "invalid" | "unavailable" | "error";

type Entry = { name: string; email: string; phone: string; source: string };

/**
 * Sends one entry to the Google Apps Script web app that owns the sheet.
 * The endpoint URL and shared secret are server-only environment variables.
 */
export async function appendToSheet(entry: Entry): Promise<SheetResult> {
  const url = process.env.WAITLIST_ENDPOINT_URL;
  const secret = process.env.WAITLIST_SHARED_SECRET;
  if (!url || !secret) {
    console.error("[waitlist] WAITLIST_ENDPOINT_URL or WAITLIST_SHARED_SECRET is not configured.");
    return "unavailable";
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, secret }),
      // Apps Script answers POSTs with a redirect to the result; follow it.
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("[waitlist] Could not reach the Apps Script endpoint:", error);
    return "error";
  }

  let body: { ok?: boolean; code?: string } | null = null;
  try {
    body = await response.json();
  } catch {
    // An HTML response usually means the deployment is not public ("Anyone").
    console.error(`[waitlist] Endpoint returned non-JSON (HTTP ${response.status}). Check the Apps Script deployment access.`);
    return "error";
  }

  if (body?.ok) return "ok";
  switch (body?.code) {
    case "duplicate":
      return "duplicate";
    case "invalid":
      return "invalid";
    case "unauthorized":
      console.error("[waitlist] Apps Script rejected the shared secret. Check WAITLIST_SHARED_SECRET.");
      return "unavailable";
    default:
      console.error("[waitlist] Apps Script reported an error:", body);
      return "error";
  }
}
