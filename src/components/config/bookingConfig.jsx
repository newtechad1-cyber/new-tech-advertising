/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MASTER BOOKING CONFIGURATION — edit ONLY this file to update all booking CTAs
 * project-wide (nav "Book a Call", pricing CTA, client dashboard, etc.)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SCHEDULING_URL: The actual Google Calendar booking link
 * BOOKING_LANDING_PAGE: Whether to show branded /book-call landing first
 *
 * To use branded landing page with Google Calendar scheduling:
 *   SCHEDULING_URL  → Google Calendar link (e.g. 'https://calendar.app.google/XXXX')
 *   BOOKING_LANDING_PAGE → true
 *
 * To use Google Calendar directly (skip landing):
 *   BOOKING_LANDING_PAGE → false
 */

export const SCHEDULING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
export const SCHEDULING_IS_EXTERNAL = true;
export const BOOKING_LANDING_PAGE = true; // Set to false to skip branded page

// Legacy support - BOOKING_URL still points to Google Calendar
export const BOOKING_URL = SCHEDULING_URL;
export const BOOKING_IS_EXTERNAL = SCHEDULING_IS_EXTERNAL;

/**
 * Helper — routes to branded booking page or direct calendar based on config.
 * 
 * Usage:
 *   import { openBooking } from '@/components/config/bookingConfig';
 *   openBooking();           // Uses window.location
 *   openBooking(navigate);   // Uses react-router for branded page
 */
export function openBooking(navigate) {
  // If branded landing page is enabled, route through it
  if (BOOKING_LANDING_PAGE) {
    if (typeof navigate === 'function') {
      navigate('/book-call');
    } else {
      window.location.href = '/book-call';
    }
  } else {
    // Direct to Google Calendar
    if (SCHEDULING_IS_EXTERNAL) {
      window.open(SCHEDULING_URL, '_blank', 'noopener,noreferrer');
    } else if (typeof navigate === 'function') {
      navigate(SCHEDULING_URL);
    } else {
      window.location.href = SCHEDULING_URL;
    }
  }
}

/**
 * Direct access to scheduling URL (for internal use in booking page)
 */
export function openSchedulingCalendar() {
  if (SCHEDULING_IS_EXTERNAL) {
    window.open(SCHEDULING_URL, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = SCHEDULING_URL;
  }
}