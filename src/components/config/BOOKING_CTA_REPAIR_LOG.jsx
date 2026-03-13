# Booking CTA Global Repair Report
**Date:** 2026-03-13  
**Scope:** Complete project-wide repair of booking/calendar CTAs

---

## SINGLE SOURCE OF TRUTH
**File:** `components/config/bookingConfig.js`

### Key Constants
- `BOOKING_EXTERNAL_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67'` (Google Calendar)
- `BOOKING_PAGE_URL = '/book-call'` (Branded landing page)

### Key Functions
- `goToBookingPage(navigate)` — PRIMARY HELPER for all booking CTAs throughout app
- `openSchedulingCalendar()` — INTERNAL function for /book-call page final button only

---

## FILES UPDATED (7 TOTAL)

### 1. ✅ components/config/bookingConfig.js
- Created clear separation between landing page and scheduling URL
- New primary helper: goToBookingPage(navigate)
- ONLY place where https://calendar.app.google/p6ieYanvwhixXxZ67 is defined

### 2. ✅ components/nav/MarketingNav.jsx
- Changed "Book a Call" desktop CTA to use goToBookingPage(navigate)
- Changed "Book a Strategy Call" mobile CTA to use goToBookingPage(navigate)
- Removed BOOKING_URL/BOOKING_IS_EXTERNAL conditional rendering

### 3. ✅ components/home/HomePricing.jsx
- Changed Pro plan "Book Strategy Call" CTA to use goToBookingPage(navigate)
- Removed BOOKING_URL/BOOKING_IS_EXTERNAL conditional rendering

### 4. ✅ components/client-dashboard/QuickActionsStrip.jsx
- Updated from openBooking() to goToBookingPage()

### 5. ✅ pages/BookCall.jsx
- Added comment clarifying all sub-components use openSchedulingCalendar()

### 6. ✅ components/book-call/BCHero.jsx
- Verified uses openSchedulingCalendar() for "Choose Your Time" button

### 7. ✅ components/book-call/BCBookingSection.jsx
- Verified uses openSchedulingCalendar() for "Choose Your Time" button

---

## BOOKING CTA FLOW

```
ANY CTA: "Book a Call" / "Book Strategy Call" / "Schedule a Call"
  ↓ (in any component, page, or nav)
  goToBookingPage(navigate)
  ↓
  Navigate to /book-call
  ↓
/book-call page displays branded landing page
  ↓
User clicks "Choose Your Time" button
  ↓
openSchedulingCalendar()
  ↓
Opens: https://calendar.app.google/p6ieYanvwhixXxZ67
```

---

## VERIFICATION

### No Remaining Issues
- ❌ 0 references to "calendly"
- ❌ 0 references to "/Book-Call" (capitalized)
- ❌ 0 hardcoded calendar URLs outside bookingConfig.js
- ✅ 1 source of truth for Google Calendar URL
- ✅ 1 source of truth for /book-call landing page route
- ✅ All CTAs unified under goToBookingPage()

---

## For Future Changes
Edit ONLY `components/config/bookingConfig.js`:

```javascript
// Change landing page route:
export const BOOKING_PAGE_URL = '/new-booking-page';

// Change Google Calendar link:
export const BOOKING_EXTERNAL_URL = 'https://calendar.app.google/NEW_ID';
```

All components automatically use new values. ✅