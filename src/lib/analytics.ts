/**
 * Vendor-neutral conversion events. Each event is pushed to `window.dataLayer`
 * (if a tag manager is ever added) and dispatched as a `nuvakin:analytics`
 * DOM event. Nothing is sent anywhere by default.
 */
export type AnalyticsEvent =
  | "waitlist_cta_click"
  | "waitlist_form_start"
  | "waitlist_submit_success"
  | "waitlist_submit_duplicate"
  | "waitlist_submit_error";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...props });
  window.dispatchEvent(new CustomEvent("nuvakin:analytics", { detail: { event, ...props } }));
}
