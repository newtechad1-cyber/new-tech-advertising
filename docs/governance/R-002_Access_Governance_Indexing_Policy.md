# R-002 Access Governance & Indexing Policy

**Release:** 0.5.1 — Emergency Stabilization  
**Status:** Active  
**Author:** Viktor (AI Systems Builder)  
**Approved:** Pending  
**Date:** 2026-07-05  

---

## 1. Purpose

This document establishes the access governance framework and SEO indexing policy for the NTA Operating System. It separates the **public marketing website** from the **private operating system** to prevent:

- SEO pollution from internal routes appearing in search results
- Unauthorized access to admin, ops, and client portal pages
- Information leakage through publicly discoverable internal URLs

## 2. Route Classification System

Every route in the application is classified into one of six access levels:

| Access Level | Authentication | Role Required | Indexed | Description |
|---|---|---|---|---|
| `public` | No | None | Yes | Public marketing/content pages |
| `noindex` | No | None | No | Public but hidden from search engines |
| `auth_required` | Yes | Any | No | Any authenticated user |
| `client_only` | Yes | client, admin | No | Client portal pages |
| `ops_only` | Yes | ops, admin | No | Operations center pages |
| `admin_only` | Yes | admin | No | Administrative pages |

### 2.1 Classification Authority

The single source of truth is `src/config/routeGovernance.js`. This file contains:

- **`ROUTE_PREFIX_RULES`** — URL path prefix → access level mapping
- **`PAGE_KEY_PREFIX_RULES`** — pages.config key prefix → access level mapping
- **`PUBLIC_PAGE_KEYS`** — Explicit set of public page keys
- **`ROUTE_OVERRIDES`** — Specific path → access level overrides

### 2.2 Classification Precedence

1. Explicit override (`ROUTE_OVERRIDES`)
2. URL prefix match (`ROUTE_PREFIX_RULES`) — most specific prefix wins
3. Page key prefix match (`PAGE_KEY_PREFIX_RULES`)
4. Default: `public`

## 3. Access Control Implementation

### 3.1 AuthGate (Primary Enforcement)

The `AuthGate` component in `App.jsx` is the primary enforcement layer. It:

1. Classifies every route using `classifyRoute(pathname)`
2. Allows public/noindex routes through without authentication
3. Redirects unauthenticated users to `/Login` for protected routes
4. Checks role-based access for authenticated users
5. Redirects unauthorized users to their appropriate dashboard

### 3.2 Route Guards (Secondary Enforcement)

Individual route guards provide defense-in-depth:

| Guard | Import | Use Case |
|---|---|---|
| `AdminGuard` | `@/components/auth/RoleGuard` | Admin-only pages |
| `OpsGuard` | `@/components/auth/RoleGuard` | Ops + admin pages |
| `ClientGuard` | `@/components/auth/RoleGuard` | Client + admin pages |
| `AuthGuard` | `@/components/auth/RoleGuard` | Any authenticated user |

### 3.3 Redirect Behavior

| Condition | Action |
|---|---|
| Unauthenticated → private route | Redirect to `/Login` |
| Authenticated, wrong role → admin route | Redirect to `/client-dashboard` |
| Authenticated, admin → client route | Allowed (admin can "View as") |

## 4. SEO Controls

### 4.1 Meta Tags

All non-public routes render:
```html
<meta name="robots" content="noindex, nofollow" />
```

This is enforced at two levels:
- **`AuthGate`** — Injects `NoIndexMeta` component for all non-public routes
- **`SEOHead`** — Accepts `noIndex` prop to override default robots meta

### 4.2 robots.txt

Located at `public/robots.txt`. Disallows crawling of all private route prefixes including PascalCase variants from `pages.config.js`.

### 4.3 Sitemap

Located at `public/sitemap.xml`. Contains **only** public marketing and content pages. All admin, ops, client portal, agency, and internal routes are excluded.

## 5. Private Route Prefixes

The following URL prefixes are classified as private (require authentication):

| Prefix | Access Level | Description |
|---|---|---|
| `/admin` | admin_only | System administration |
| `/agency` | admin_only | Agency operations |
| `/ops` | ops_only | Operations center |
| `/nta/*` (most) | admin_only | NTA operating system |
| `/client` | client_only | Client portal |
| `/portal` | client_only | Client portal (v1) |
| `/sales` | admin_only | Sales tools |
| `/reseller` | auth_required | Reseller dashboard |
| `/dashboard` | admin_only | Legacy dashboard |
| `/billing` | auth_required | Billing center |
| `/content-command` | admin_only | Content management |
| `/content-center` | admin_only | Content center |

### 5.1 PascalCase Route Coverage

`pages.config.js` auto-generates routes as `/{PageKey}` (e.g., `/AdminBilling`). The `PAGE_KEY_PREFIX_RULES` in the governance registry ensures these PascalCase routes are properly classified and protected.

## 6. Public Routes (Allowed)

The following route categories remain publicly accessible and indexed:

- **Homepage** (`/`)
- **Core pages** (About, Services, Pricing, Contact, Blog)
- **Industry verticals** (HVAC, Plumbing, Restaurant, Dentist, etc.)
- **Geo-targeted pages** (Mason City, Rochester, Austin, Albert Lea)
- **Thought leadership articles** (all `/article-slug` paths)
- **Case studies** (`/case-studies/*`, `/case-study/*`)
- **Discovery tools** (Growth Conversation, Business Score, etc.)
- **Learning center** (`/learning-center/*`)
- **Lead magnets** (Free Audit, Book Call, etc.)
- **Legal** (Privacy Policy, Terms of Service)

## 7. QA Checklist

- [ ] Logged-out user cannot access `/admin-dashboard`
- [ ] Logged-out user cannot access `/AdminBilling` (PascalCase)
- [ ] Logged-out user cannot access `/agency`
- [ ] Logged-out user cannot access `/ops`
- [ ] Logged-out user cannot access `/portal`
- [ ] Logged-out user cannot access `/client-dashboard`
- [ ] Client user cannot access `/admin-dashboard`
- [ ] Client user cannot access `/AdminBilling`
- [ ] Client user cannot access `/agency`
- [ ] Client user cannot access `/ops`
- [ ] Client user CAN access `/client-dashboard`
- [ ] Client user CAN access `/portal`
- [ ] Admin user CAN access all routes
- [ ] Public pages (/, /About, /Services) accessible without auth
- [ ] Private pages include `<meta name="robots" content="noindex, nofollow" />`
- [ ] Public pages include `<meta name="robots" content="index, follow, ..." />`
- [ ] `sitemap.xml` contains only public pages
- [ ] `robots.txt` disallows all private route prefixes
- [ ] No admin/ops/client routes appear in site navigation for logged-out users

## 8. Maintenance

When adding new routes:

1. Check if the route matches an existing prefix rule in `routeGovernance.js`
2. If not, add it to the appropriate prefix list or override
3. Verify the page includes appropriate SEO tags
4. Update `sitemap.xml` if the page is public
5. Test access with logged-out, client, and admin sessions

## 9. Related Documents

- **E-000** — NTA Operating System Constitution
- **R-000** — Release Governance
- **R-001** — Release Registry
- **I-000** — Intelligence Framework
