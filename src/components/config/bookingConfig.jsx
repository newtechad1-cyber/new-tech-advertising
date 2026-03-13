/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MASTER BOOKING URL — edit ONLY this file to update all booking CTAs
 * project-wide (nav "Book a Call", pricing CTA, client dashboard, etc.)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * To switch to a Google Calendar / external booking link, update:
 *   BOOKING_URL  → your full URL, e.g. 'https://calendar.app.google/XXXX'
 *   BOOKING_IS_EXTERNAL → true
 *
 * Current default: routes to the internal NTA strategy-call intake form.
 */

export const BOOKING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
export const BOOKING_IS_EXTERNAL = true;

/**
 * Helper — opens the booking destination correctly.
 * Pass a react-router `navigate` fn for SPA navigation when not external.
 *
 * Usage:
 *   import { openBooking } from '@/components/config/bookingConfig';
 *   openBooking();           // window.location fallback
 *   openBooking(navigate);   // react-router navigate
 */
export function openBooking(navigate) {
  if (BOOKING_IS_EXTERNAL) {
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
  } else if (typeof navigate === 'function') {
    navigate(BOOKING_URL);
  } else {
    window.location.href = BOOKING_URL;
  }
}