# R-003 Public/Private Surface Separation

**Status:** Implementation in progress  
**Public origin:** `https://newtechadvertising.com`  
**Private origin:** `https://app.newtechadvertising.com`

## Decision

NTA will operate as two browser surfaces backed by one governed route registry:

- The public website contains marketing pages, books, the Journal, the Knowledge
  Library, case studies, and customer-facing discovery tools.
- The private application contains admin, agency, client, sales, publishing,
  billing, workflow, and operating-system routes.

Unknown routes and newly generated Base44 pages are private by default. A page
becomes public only after it is deliberately added to the public route registry.

## Runtime behavior

- A protected URL opened on `newtechadvertising.com` is redirected to the same
  path on `app.newtechadvertising.com`, preserving query parameters and hashes.
- Public and public-but-noindex routes remain on the public origin.
- Base44 preview URLs and local development retain a combined surface so both
  sides can be inspected before deployment.
- `VITE_APP_SURFACE=public` and `VITE_APP_SURFACE=private` provide explicit
  build modes for the two deployments.

## Deployment sequence

1. Deploy and verify the private surface before changing the public domain.
2. Connect `app.newtechadvertising.com` to the private Base44 app.
3. Confirm login, admin, agency, client, and operating-system routes on the
   private origin.
4. Deploy the public build and confirm only governed public pages appear in its
   page registry and crawler output.
5. Confirm protected public-origin URLs redirect to the private origin.
6. Re-run sitemap, robots, metadata, authentication, and role-access checks.
7. Remove the combined deployment only after both surfaces pass verification.

## Rollback

Keep the current combined app published until the private surface passes live
verification. If the private deployment fails, remove the subdomain mapping and
continue serving the combined app while the release branch is corrected.
