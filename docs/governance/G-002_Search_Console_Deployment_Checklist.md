# G-002 Search Console Deployment Checklist

**Release:** 0.6 — Growth Visibility Sprint  
**Build:** G-002 Search Foundation Implementation  
**Date:** July 5, 2026

---

## Pre-Deployment Verification

### 1. Canonical URLs ✅
Every public page now outputs a canonical URL via the SEOHead component.
- SEOHead auto-generates canonical from `window.location.pathname`
- Format: `https://newtechadvertising.com{pathname}`
- No pages default to `/` anymore — each gets its own canonical

### 2. Homepage Consolidation ✅
301 redirects added in App.jsx:
| From | To | Type |
|---|---|---|
| `/home` | `/` | `<Navigate replace>` (client-side 301) |
| `/Home` | `/` | `<Navigate replace>` |
| `/index.html` | `/` | `<Navigate replace>` |
| `/HomePage` | `/` | `<Navigate replace>` |

**Platform-level redirects (require Base44/DNS verification):**
| From | To | Status |
|---|---|---|
| `http://newtechadvertising.com/*` | `https://newtechadvertising.com/*` | ⚠️ Verify at DNS/CDN level |
| `http://www.newtechadvertising.com/*` | `https://newtechadvertising.com/*` | ⚠️ Verify at DNS/CDN level |
| `https://www.newtechadvertising.com/*` | `https://newtechadvertising.com/*` | ⚠️ Verify at DNS/CDN level |

### 3. SEOHead Coverage ✅
- **Before:** 62 public pages had SEOHead
- **After:** 78/78 public pages have SEOHead (39 pages updated)
- Every page has unique title, description, and auto-canonical

### 4. Services Hub ✅
- `/Services` is now a real hub page (no longer redirects to SocialMediaManagement)
- Links to all 6 core services, 8 industry verticals, 4 service areas
- Full SEOHead with targeted title/description

---

## Post-Deployment Actions

### Step 1: Resubmit Sitemap to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select `sc-domain:newtechadvertising.com`
3. Navigate to **Sitemaps** → Remove old sitemap if listed
4. Submit: `https://newtechadvertising.com/sitemap.xml`
5. Verify: 78 URLs discovered

### Step 2: Delete Old HTTP Sitemap
1. In GSC, check for `http://newtechadvertising.com/sitemap.xml`
2. If present, click → **Remove Sitemap**
3. This legacy sitemap from 2018 causes confusion

### Step 3: Request Indexing — Top 10 Priority Pages
Use GSC **URL Inspection** tool → "Request Indexing" for each:

| # | URL | Why |
|---|---|---|
| 1 | `https://newtechadvertising.com/` | Homepage — most important |
| 2 | `https://newtechadvertising.com/Services` | New hub page — authority page |
| 3 | `https://newtechadvertising.com/Free-Audit` | Primary lead magnet |
| 4 | `https://newtechadvertising.com/AiSeo` | Top impressions query ("iowa seo") |
| 5 | `https://newtechadvertising.com/About` | Trust signal |
| 6 | `https://newtechadvertising.com/Pricing` | Bottom-of-funnel |
| 7 | `https://newtechadvertising.com/HvacMarketing` | Top vertical |
| 8 | `https://newtechadvertising.com/case-studies/johnson-heating` | Social proof |
| 9 | `https://newtechadvertising.com/book-call` | Conversion page |
| 10 | `https://newtechadvertising.com/social-media/mason-city-ia` | Local geo page |

### Step 4: Request Removal — Leaked Admin Pages
Use GSC **Removals** tool for the most-visible leaked admin pages:

| URL | Impressions | Action |
|---|---|---|
| `/AdminOptimizer` | 20 | Request removal |
| `/AdaWebsiteCompliance` | 10 | Request removal |
| `/AdminChannels` | 10 | Request removal |
| `/LeadPipelineKanban` | 10 | Request removal |
| `/AdminBlog` | 8 | Request removal |
| `/AdminQA` | 8 | Request removal |

> Note: R0.5.1 already blocks these via robots.txt + noindex. Removals accelerate de-indexing.

### Step 5: Verify Redirects
Test each redirect returns proper status:

```
# Homepage variants
curl -sI https://newtechadvertising.com/home | head -3
curl -sI https://newtechadvertising.com/Home | head -3
curl -sI https://newtechadvertising.com/index.html | head -3

# HTTP → HTTPS
curl -sI http://newtechadvertising.com/ | head -3

# www → non-www
curl -sI https://www.newtechadvertising.com/ | head -3
curl -sI http://www.newtechadvertising.com/ | head -3
```

Expected: `HTTP/2 301` or `HTTP/1.1 301 Moved Permanently` with `Location: https://newtechadvertising.com/`

### Step 6: Verify Canonical Tags
For each top page, verify canonical in rendered HTML:

```javascript
// In browser console on each page:
document.querySelector('link[rel="canonical"]').href
// Should match the page's canonical URL exactly
```

### Step 7: Verify robots.txt
```
curl https://newtechadvertising.com/robots.txt
```
- Confirm all `/Admin*`, `/Client*`, `/NTA*`, etc. are still Disallowed
- Confirm `Sitemap: https://newtechadvertising.com/sitemap.xml` is present

---

## Bing Webmaster Tools Setup
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: `https://newtechadvertising.com`
3. Verify via DNS TXT record or GSC import
4. Submit sitemap: `https://newtechadvertising.com/sitemap.xml`

---

## Files Changed in G-002

| File | Action | Description |
|---|---|---|
| `src/components/shared/SEOHead.jsx` | Modified | Auto-canonical from route, `useLocation()` |
| `src/pages/Services.jsx` | Rewritten | Hub page replacing redirect |
| `src/App.jsx` | Modified | Homepage 301 redirects |
| `public/sitemap.xml` | Updated | Added `lastmod` dates, updated header |
| 39 page files | Modified | Added SEOHead with unique title/description |
| 6 geo page files | Modified | Removed legacy manual meta, cleaned imports |
| `docs/governance/G-002_*` | New | This checklist |
