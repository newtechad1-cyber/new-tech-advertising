# NTA Voice-First Business Conversation System

## Core Promise

**Work with AI without changing how you work.**

NTA should let a business owner speak, type, upload, review, approve, and communicate naturally. AI handles the organization behind the scenes.

The system is not primarily a chatbot, CRM, project manager, or marketing dashboard. It is a **business conversation system** that turns natural communication into organized work.

## Product Purpose

Create one private, mobile-first hub at `app.newtechadvertising.com` for every NTA client relationship.

The portal should support two connected communication loops:

1. **NTA and client** — requests, ideas, changes, approvals, proofs, files, content, reports, and next steps.
2. **Client and customer** — inquiries, jobs, follow-ups, service notes, invoice reminders, customer communication, and history.

Jay Monson / Monson Plumbing is the first pilot. The reusable NTA system should be designed around the pilot without becoming plumbing-specific.

## Design Principle

Every feature must pass this test:

> Does this let the owner work naturally, or are we forcing the owner to learn our software?

Voice is the primary input, but not the only input. The system must also accept text, photos, documents, video, and structured forms when useful.

## Primary User Experience

The primary action is a large mobile button:

## Talk to NTA

The client taps the button and speaks naturally.

Examples:

- “Tell Rick to change the slogan on the Brothers Ace sign.”
- “Mrs. Smith needs a water heater looked at Thursday.”
- “Remind me to invoice Johnson for the service call.”
- “Add Randy’s picture to the website.”
- “A customer asked about hard water again. We should explain that.”

The system transcribes the message, identifies people and actions, organizes the work, and presents a simple confirmation.

Example confirmation:

> I found three actions:
>
> 1. Create a Thursday service request for Mrs. Smith.
> 2. Remind Jay to invoice the job after completion.
> 3. Create a content idea about hard-water questions.

Actions:

- **Looks Right**
- **Make a Change**
- **Add More**

The user can correct the interpretation by voice.

## First Complete Workflow

1. User starts a voice recording.
2. Recording is stored with tenant, user, date, and context.
3. Audio is transcribed.
4. AI identifies:
   - people
   - customers
   - companies
   - dates and times
   - requested changes
   - jobs or appointments
   - follow-ups
   - invoice reminders
   - files or photos needed
   - marketing or knowledge ideas
   - messages intended for NTA
5. AI creates proposed actions rather than immediately changing records.
6. User confirms or corrects the proposed actions.
7. Confirmed actions create the proper records.
8. Responsible users receive notifications.
9. The original recording, transcript, interpretation, corrections, and resulting records remain linked.

## Initial Navigation

Keep the first version small.

- **Today** — jobs, reminders, approvals, unanswered requests, and items needing attention.
- **Talk** — voice, text, photo, and file input.
- **Work** — requests and tasks organized by status.
- **Customers** — customer history, communication, jobs, notes, files, and invoice status.
- **NTA** — messages for Rick, proofs, approvals, marketing work, website changes, and reports.
- **Files** — shared documents, photos, videos, final assets, and downloads.

A persistent action should remain available from every screen:

> **Talk to NTA**

## Reusable Record Types

### Organization / Tenant

Represents one client business and provides strict data separation.

Suggested fields:

- id
- name
- slug
- status
- primary_contact_id
- brand_profile_id
- timezone
- notification_preferences

### User

- id
- organization_id
- role
- name
- email
- mobile
- preferred_input_method
- notification_preferences

Roles initially:

- NTA admin
- client owner
- client team member
- read-only reviewer

### Conversation Capture

The unprocessed source record.

- id
- organization_id
- created_by
- source_type: voice, text, photo, file, video
- audio_or_file_url
- raw_text
- transcript
- created_at
- context_page
- status

### Interpretation

The AI’s proposed understanding.

- id
- capture_id
- summary
- extracted_people
- extracted_dates
- proposed_actions
- confidence
- needs_clarification
- confirmed_at
- corrected_by

### Action Item

- id
- organization_id
- source_capture_id
- type
- title
- description
- assigned_to
- due_at
- priority
- status
- related_customer_id
- related_project_id
- related_approval_id

Initial action types:

- client request
- NTA request
- follow-up
- appointment
- job
- invoice reminder
- website change
- marketing idea
- content idea
- file needed
- approval needed

### Customer

- id
- organization_id
- name
- phone
- email
- address
- notes
- preferred_contact_method

### Work Item / Job

- id
- organization_id
- customer_id
- source_capture_id
- title
- description
- scheduled_at
- assigned_to
- status
- completion_notes
- amount_to_invoice
- invoice_status

### Approval

- id
- organization_id
- title
- asset_type
- version
- preview_url
- status
- requested_changes
- approved_by
- approved_at
- source_capture_id

### Knowledge Item

Captures reusable business knowledge discovered in ordinary conversations.

- id
- organization_id
- source_capture_id
- topic
- summary
- category
- possible_uses
- review_status

Possible uses:

- FAQ
- website page
- social post
- video
- customer education
- employee training
- article

## Routing Rules

The system should route interpreted actions according to intent.

Examples:

- “Tell Rick…” → NTA request queue.
- “Remind me…” → personal or business reminder.
- “Mrs. Smith called…” → customer record plus work item.
- “The job is done…” → update job status and ask whether invoicing is needed.
- “Change the website…” → website-change request.
- “Customers keep asking…” → knowledge or content opportunity.
- “This proof is good…” → approval confirmation.

No high-impact action should occur silently. Publishing, customer messaging, invoice creation, deletion, and approval should require an explicit confirmation or an established automation rule.

## Jay / Monson Plumbing Pilot

The first pilot should solve a limited number of real problems:

1. Capture customer requests while Jay is mobile.
2. Turn spoken requests into jobs and follow-ups.
3. Track completed work that still needs invoicing.
4. Preserve customer and job communication history.
5. Send NTA-related requests to Rick.
6. Let Jay review and approve marketing proofs by voice.
7. Capture repeated customer questions as marketing and knowledge opportunities.

The pilot should not attempt to replace full accounting, dispatch, estimating, or field-service software in its first release.

## Phase 1 MVP

### Required

- secure login
- organization-level data separation
- mobile-first client home screen
- browser voice recording
- text and file input
- audio storage
- transcription status
- proposed-action confirmation screen
- action-item creation
- NTA request queue
- basic customer records
- basic work/job records
- invoice-needed status and reminders
- proofs and approvals
- activity history
- admin view across clients

### Later

- automatic customer texts and emails
- calendar integration
- accounting and invoicing integrations
- Metricool publishing and analytics
- Google Drive file synchronization
- GitHub website-change workflows
- advanced AI search and knowledge retrieval
- employee dispatch
- estimates and payments

## First Screens to Design

### Client Today Screen

- greeting
- large Talk to NTA button
- needs your attention
- today’s work
- invoices not sent
- approvals waiting
- recently completed

### Recording Screen

- large start / stop control
- recording timer
- discard and submit
- optional photo or file attachment
- simple safety note not to operate while actively driving

### Understanding Screen

- transcript
- short summary
- proposed actions
- Looks Right
- Make a Change
- Add More

### NTA Admin Inbox

- new voice requests
- requests needing clarification
- approvals and changes
- files received
- overdue client responses
- action ownership and status

## Success Measures

The first pilot should measure operational outcomes rather than feature usage alone:

- fewer forgotten requests
- fewer completed jobs left uninvoiced
- faster response to customer inquiries
- fewer scattered text messages and emails
- shorter approval cycles
- number of useful knowledge items captured
- percentage of voice captures correctly organized without manual restructuring
- client confidence that the system understood them

## Positioning

Primary message:

> **Work with AI without changing how you work.**

Supporting explanation:

> Talk naturally. NTA turns the conversation into organized work.

The system represents the online, scalable version of Rick Hesse’s decades of experience listening to business owners, understanding what they mean, identifying the real next step, and keeping the relationship moving.

## Immediate Engineering Sequence

1. Audit existing client, approval, calendar, results, operations, and AI-orchestration pages.
2. Reuse existing entities and components where appropriate.
3. Add the organization-aware Conversation Capture and Interpretation model.
4. Create the mobile recording and understanding screens.
5. Connect confirmed interpretations to existing task, approval, client, and content workflows.
6. Create the Jay pilot configuration without hard-coding plumbing logic into the shared platform.
7. Test tenant boundaries, permissions, transcription failure, unclear speech, duplicate actions, and correction history.
