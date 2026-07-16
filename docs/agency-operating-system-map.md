# Agency Operating System Map

The Agency area is the control panel for the NTA Operating System. `Clients.id` is the canonical account identifier and must be stored as `client_id` on operational records.

## Canonical operating accounts

- New Tech Advertising / NTA
- Johnson Heating
- Monson Plumbing

These are matched by normalized business name until a permanent database migration assigns stable account keys.

## Agency menu data map

| Area | Canonical Base44 entities | Status |
| --- | --- | --- |
| Today | Clients, SalesLead, SalesDeal, SpokeCampaign, NTAContentAsset, SocialPostQueue, PerformanceMetric, ChannelConnection | Connected; account visibility added |
| Lead Pipeline / All Leads | SalesLead, SalesDeal | Connected |
| Gap Audits / AI Gap Scanner | GapAudit, SalesLead | Connected |
| All Clients | Clients | Connected; protected live accounts and cleanup controls added |
| Portal Manager | Clients, ClientPortalUser, ClientPortalNote | Connected |
| Client Channel Setup | Clients, ChannelConnection, PostingLog | Connected; client-owned OAuth migration still required |
| Content Center | Clients, ContentTopics, ContentAssets, AIJobs | Connected legacy content workflow |
| Content Library | Clients, SpokeCampaign, NTAContentAsset | Connected campaign asset workflow; canonical lessons not imported yet |
| Campaigns | Clients, Campaign, CampaignPost, ChannelConnection | Connected but overlaps SpokeCampaign workflow |
| Approval Center | Clients, SpokeCampaign, NTAContentAsset, SocialPostQueue | Connected |
| Publishing Calendar | Clients, SocialPostQueue | Connected |
| Performance | SpokeCampaign, NTAContentAsset, PerformanceMetric | Connected; client attribution is derived through campaign |
| Channel Connections | Clients, ChannelConnection | Connected; tokens must remain client-scoped |
| Spoke Campaigns | Clients, SpokeCampaign, NTAContentAsset, PerformanceMetric | Connected and preferred campaign workflow |
| Insight Pages | SpokeCampaign, InsightPage | Connected |

## Decisions

1. `Clients` is the only agency account registry.
2. `Clients.id` is the authoritative `client_id`.
3. `SpokeCampaign` is the preferred campaign workflow; `Campaign` remains until its unique functionality is migrated.
4. `NTAContentAsset` is the campaign-ready asset library.
5. `SocialPostQueue` is the scheduling source of truth.
6. `ChannelConnection` is the publishing connection source of truth.
7. Fake metrics are never used as operational fallbacks; missing data displays as zero or unassigned.

