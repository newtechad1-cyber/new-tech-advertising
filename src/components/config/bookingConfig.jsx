/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MASTER BOOKING CONFIGURATION — SINGLE SOURCE OF TRUTH
 * Edit ONLY this file to update all booking CTAs across the entire project
 * ─────────────────────────────────────────────────────────────────────────────
 */

// External Google Calendar scheduling URL (the final destination)
export const BOOKING_EXTERNAL_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';

// Internal branded booking landing page
export const BOOKING_PAGE_URL = '/book-call';

/**
 * Primary helper — ALL booking CTAs in the app should use this
 * Routes user to branded booking page at /book-call
 * User then clicks scheduling button to open Google Calendar
 * 
 * Usage:
 *   import { goToBookingPage } from '@/components/config/bookingConfig';
 *   goToBookingPage(navigate);  // With react-router navigate function
 *   goToBookingPage();          // Falls back to window.location
 */
export function goToBookingPage(navigate) {
  if (typeof navigate === 'function') {
    navigate(BOOKING_PAGE_URL);
  } else {
    window.location.href = BOOKING_PAGE_URL;
  }
}

/**
 * Direct access to scheduling calendar (used ONLY within /book-call page)
 * Opens Google Calendar in new tab
 * 
 * Usage:
 *   import { openSchedulingCalendar } from '@/components/config/bookingConfig';
 *   openSchedulingCalendar();
 */
export function openSchedulingCalendar() {
  window.open(BOOKING_EXTERNAL_URL, '_blank', 'noopener,noreferrer');
}

// Legacy/backward compatibility aliases (deprecated)
export const BOOKING_URL = BOOKING_PAGE_URL;
export const BOOKING_IS_EXTERNAL = false;
export const SCHEDULING_URL = BOOKING_EXTERNAL_URL;
export const SCHEDULING_IS_EXTERNAL = true;

/**
 * Legacy helper (deprecated - use goToBookingPage instead)
 */
export function openBooking(navigate) {
  return goToBookingPage(navigate);
}