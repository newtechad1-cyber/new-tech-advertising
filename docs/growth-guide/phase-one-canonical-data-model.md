# Phase One — Canonical Growth Guide Data Model

Status: implementation section 1

Governing sources:

- NTA Source of Truth Blueprint — Master
- NTA Growth Conversation and Discovery Standard
- Website Growth Guide Functional Specification

## Purpose

This model creates one canonical factual center for text, voice, personal, and mixed Growth Conversations. It deliberately separates owner statements, AI interpretations, confirmed summaries, permissions, retention, handoffs, audit history, and usage cost so their different review and deletion rules remain enforceable.

## Canonical records

| Record | Responsibility |
| --- | --- |
| `DiscoverySession` | Mode, four-stage progress, lifecycle status, activity, expiration, and optional downstream lead link |
| `DiscoveryConversationEntry` | Speaker-attributed owner, Guide, Rick, or system entries with source mode, uncertainty, and correction history |
| `DiscoveryCategory` | Required background categories, owner-supported facts, evidence entries, and “Not yet known” |
| `DiscoveryAIObservation` | Inferences stored outside owner statements with reason, uncertainty, evidence, and Rick review state |
| `DiscoveryConfirmedSummary` | Versioned “Here’s What We Heard,” owner corrections, confirmation state, and confirmation time |
| `DiscoveryConsent` | One record per permission: microphone, transcription, audio retention, save-and-return, follow-up, and Journal |
| `DiscoveryRetentionInstruction` | Delete/save action by artifact, execution status, failure, and deletion proof |
| `DiscoveryContactPreference` | Minimum contact details and owner-requested channel |
| `DiscoveryHandoff` | Requested next step, Rick review, follow-up questions, and links to existing operational records |
| `DiscoveryAuditEvent` | Access, export, correction, status, consent, retention, and deletion history |
| `DiscoveryUsageCost` | Provider/service use, units, approximate cost, and outcome |

## Constitutional protections encoded

- No single conversation blob is treated as the complete business record.
- Owner statements and AI observations are different record types.
- A confirmed summary requires a confirmation timestamp.
- Granted permission requires a recorded affirmative action and capture time.
- Journal permission is its own consent type; it cannot be inferred from follow-up permission.
- Raw-audio retention is its own consent type and defaults to deletion.
- Completed deletion requires completion time and proof.
- Rick review must be grounded in a confirmed summary.
- The paid `GapAudit` is not created by free discovery.
- The existing `SalesLead`, `Subscriber`, `Task`, `Appointment`, and `GapAudit` records remain downstream systems of record.

## Existing CRM relationships

`SalesLead` is linked or created only when an owner identifies themselves or requests contact. Anonymous discovery remains possible before that point.

`Subscriber` is linked only after a separate affirmative Journal choice. Journal remains unselected by default.

`Task` and `Appointment` remain the operational records for human follow-up and scheduling. The discovery handoff stores their references rather than duplicating their behavior.

`GapAudit` remains the separate paid Business Gap Audit. It is not a discovery status or automatic output.

## Retention defaults

- Unsaved anonymous sessions: expire within 24 hours.
- Affirmatively saved sessions: expire after 30 days unless extended.
- Raw audio: delete by default.
- Working transcript and discovery artifacts: delete after the confirmed summary and required handoff record are created, unless the owner affirmatively chooses to save them.
- Confirmed summaries and necessary relationship records: preserve under the approved relationship and legal rules.

## Implementation boundary

The GitHub repository contains the canonical vocabulary and runtime validation schemas in `src/lib/growth-guide`. Base44 entity definitions are managed outside this repository and must be created or updated to match these schemas before a persistence adapter or public Growth Guide writes these records.

That platform step must preserve role-based access, server-side ownership checks, secure return tokens, expiration, audit logging, and deletion proof. The frontend must never be treated as the authority for consent, retention, access, or deletion.

## Next manageable section

1. Create or verify the matching Base44 entities and field constraints.
2. Add a server-side repository/service boundary for session creation, entry capture, consent, retention, confirmation, and handoff.
3. Connect that service to existing `SalesLead`, `Subscriber`, `Task`, and appointment behavior without duplicating them.
4. Add model contract tests before building the public text experience.
