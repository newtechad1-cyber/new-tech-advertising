# NTA application-separation migration manifest

Generated from `src/App.jsx`, `src/pages.config.js`, and `src/config/routeGovernance.js`. The CSV is the complete route-level working manifest.

## Classification contract

| Class | Intended host | Meaning |
|---|---|---|
| PUBLIC | `newtechadvertising.com` | Education, publishing, marketing, books, Journal, Growth Show, knowledge library, public demos and lead generation |
| AGENCY | `app.newtechadvertising.com` | NTA staff operations, CRM, sales, publishing operations, automation, reporting, governance and AI workforce |
| CLIENT | `app.newtechadvertising.com` | Authenticated client portals, approvals, results, billing and account operations |
| AUTH | `app.newtechadvertising.com` | Authentication or role-neutral authenticated workflows |
| SHARED | both builds | Non-route SDK configuration, authentication infrastructure, entity access, UI primitives and data contracts; tracked at the file/module level rather than as a routable page |

## Inventory summary

- PUBLIC: 320 routes
- AGENCY: 462 routes
- CLIENT: 52 routes
- AUTH: 26 routes
- SHARED: 0 routes

## Migration safeguards

- The public source remains intact until the admin application is migrated, built and verified.
- Base44 configuration, SDK access, authentication providers, entity access and shared contracts are copied without semantic changes during the foundation migration.
- Hostname-aware route policy is required in both applications before public removal begins.
- Every migrated batch must build in the admin repository before the corresponding source cleanup is proposed.

See [`route-migration-manifest.csv`](./route-migration-manifest.csv) for every route.
