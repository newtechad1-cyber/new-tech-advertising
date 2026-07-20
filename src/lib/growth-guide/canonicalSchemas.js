import { z } from 'zod';
import {
  AUDIT_EVENT_TYPES,
  CATEGORY_COMPLETION_STATES,
  CONSENT_STATES,
  CONSENT_TYPES,
  CONTACT_CHANNELS,
  CONVERSATION_SPEAKERS,
  DISCOVERY_CATEGORY_KEYS,
  DISCOVERY_MODES,
  DISCOVERY_STAGES,
  DISCOVERY_STATUSES,
  HANDOFF_TYPES,
  OBSERVATION_REVIEW_STATES,
  RETENTION_ACTIONS,
  RETENTION_STATUSES,
  RETENTION_TARGETS,
  RICK_REVIEW_STATES,
  SOURCE_MODES,
} from './canonicalModel';

const id = z.string().min(1);
const optionalId = id.nullable().optional();
const timestamp = z.string().datetime({ offset: true });
const optionalTimestamp = timestamp.nullable().optional();
const nonEmptyText = z.string().trim().min(1);
const metadata = z.record(z.unknown()).default({});

export const discoverySessionSchema = z.object({
  id: optionalId,
  model_version: z.number().int().positive().default(1),
  public_session_key: z.string().min(24),
  mode: z.enum(DISCOVERY_MODES),
  stage: z.enum(DISCOVERY_STAGES).default('your_goal'),
  status: z.enum(DISCOVERY_STATUSES).default('started'),
  anonymous_visitor_id: optionalId,
  sales_lead_id: optionalId,
  created_at: timestamp,
  last_activity_at: timestamp,
  expires_at: timestamp,
  saved_at: optionalTimestamp,
  confirmed_at: optionalTimestamp,
  deleted_at: optionalTimestamp,
});

export const conversationEntrySchema = z.object({
  id: optionalId,
  session_id: id,
  speaker: z.enum(CONVERSATION_SPEAKERS),
  text: nonEmptyText,
  source_mode: z.enum(SOURCE_MODES),
  occurred_at: timestamp,
  confidence: z.number().min(0).max(1).nullable().optional(),
  uncertainty: z.string().trim().nullable().optional(),
  corrects_entry_id: optionalId,
  correction_reason: z.string().trim().nullable().optional(),
  superseded_at: optionalTimestamp,
});

export const discoveryCategorySchema = z.object({
  id: optionalId,
  session_id: id,
  category_key: z.enum(DISCOVERY_CATEGORY_KEYS),
  owner_supported_facts: z.array(nonEmptyText).default([]),
  supporting_entry_ids: z.array(id).default([]),
  completion_state: z.enum(CATEGORY_COMPLETION_STATES).default('not_started'),
  updated_at: timestamp,
});

export const aiObservationSchema = z.object({
  id: optionalId,
  session_id: id,
  observation: nonEmptyText,
  reason: nonEmptyText,
  supporting_entry_ids: z.array(id).default([]),
  uncertainty: nonEmptyText,
  review_state: z.enum(OBSERVATION_REVIEW_STATES).default('unreviewed'),
  reviewed_by: optionalId,
  reviewed_at: optionalTimestamp,
  corrected_observation: z.string().trim().nullable().optional(),
});

export const confirmedSummarySchema = z.object({
  id: optionalId,
  session_id: id,
  version: z.number().int().positive(),
  why_owner_came: nonEmptyText,
  owner_goal: nonEmptyText,
  greatest_difficulty: nonEmptyText,
  present_process: nonEmptyText,
  what_is_working: nonEmptyText,
  possibly_missing_or_disconnected: nonEmptyText,
  desired_improvement: nonEmptyText,
  readiness: nonEmptyText,
  information_still_needed: nonEmptyText,
  owner_corrections: z.array(nonEmptyText).default([]),
  confirmation_state: z.enum(['draft', 'correction_requested', 'confirmed']),
  created_at: timestamp,
  confirmed_at: optionalTimestamp,
}).superRefine((summary, ctx) => {
  if (summary.confirmation_state === 'confirmed' && !summary.confirmed_at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmed_at'],
      message: 'A confirmed summary requires a confirmation timestamp.',
    });
  }
});

export const consentSchema = z.object({
  id: optionalId,
  session_id: id,
  consent_type: z.enum(CONSENT_TYPES),
  state: z.enum(CONSENT_STATES).default('not_asked'),
  affirmative_action: z.boolean().default(false),
  notice_version: nonEmptyText,
  captured_at: optionalTimestamp,
  withdrawn_at: optionalTimestamp,
  source: z.enum(['website_text', 'website_voice', 'rick_recorded', 'rick_written']),
}).superRefine((consent, ctx) => {
  if (consent.state === 'granted' && (!consent.affirmative_action || !consent.captured_at)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['affirmative_action'],
      message: 'Granted consent requires an affirmative action and capture time.',
    });
  }
  if (consent.state === 'withdrawn' && !consent.withdrawn_at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['withdrawn_at'],
      message: 'Withdrawn consent requires a withdrawal time.',
    });
  }
});

export const retentionInstructionSchema = z.object({
  id: optionalId,
  session_id: id,
  target: z.enum(RETENTION_TARGETS),
  action: z.enum(RETENTION_ACTIONS),
  status: z.enum(RETENTION_STATUSES).default('pending'),
  requested_by: z.enum(['default_policy', 'owner', 'rick', 'system']),
  requested_at: timestamp,
  execute_at: optionalTimestamp,
  completed_at: optionalTimestamp,
  deletion_proof: z.string().trim().nullable().optional(),
  failure_reason: z.string().trim().nullable().optional(),
}).superRefine((instruction, ctx) => {
  if (
    instruction.action === 'delete' &&
    instruction.status === 'completed' &&
    (!instruction.completed_at || !instruction.deletion_proof)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['deletion_proof'],
      message: 'Completed deletion requires a completion time and proof.',
    });
  }
});

export const contactPreferenceSchema = z.object({
  id: optionalId,
  session_id: id,
  preferred_channel: z.enum(CONTACT_CHANNELS),
  name: z.string().trim().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  best_time: z.string().trim().nullable().optional(),
  follow_up_consent_id: optionalId,
});

export const handoffSchema = z.object({
  id: optionalId,
  session_id: id,
  handoff_type: z.enum(HANDOFF_TYPES),
  requested_at: timestamp,
  rick_review_state: z.enum(RICK_REVIEW_STATES).default('not_requested'),
  confirmed_summary_id: optionalId,
  contact_preference_id: optionalId,
  suggested_follow_up_questions: z.array(nonEmptyText).default([]),
  task_id: optionalId,
  appointment_id: optionalId,
  sales_lead_id: optionalId,
}).superRefine((handoff, ctx) => {
  if (handoff.rick_review_state !== 'not_requested' && !handoff.confirmed_summary_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmed_summary_id'],
      message: 'Rick review must be grounded in a confirmed summary.',
    });
  }
});

export const auditEventSchema = z.object({
  id: optionalId,
  session_id: id,
  event_type: z.enum(AUDIT_EVENT_TYPES),
  actor_type: z.enum(['owner', 'rick', 'authorized_nta', 'ai_service', 'system']),
  actor_id: optionalId,
  occurred_at: timestamp,
  target_record_type: nonEmptyText,
  target_record_id: optionalId,
  reason: z.string().trim().nullable().optional(),
  metadata,
});

export const usageCostSchema = z.object({
  id: optionalId,
  session_id: id,
  occurred_at: timestamp,
  provider: nonEmptyText,
  operation: z.enum(['conversation', 'transcription', 'summary', 'workflow']),
  model_or_service: nonEmptyText,
  input_units: z.number().nonnegative().default(0),
  output_units: z.number().nonnegative().default(0),
  audio_seconds: z.number().nonnegative().default(0),
  approximate_cost_usd: z.number().nonnegative(),
  completion_outcome: z.enum(['completed', 'failed', 'cancelled']),
});

export const canonicalGrowthGuideSchemas = Object.freeze({
  DiscoverySession: discoverySessionSchema,
  DiscoveryConversationEntry: conversationEntrySchema,
  DiscoveryCategory: discoveryCategorySchema,
  DiscoveryAIObservation: aiObservationSchema,
  DiscoveryConfirmedSummary: confirmedSummarySchema,
  DiscoveryConsent: consentSchema,
  DiscoveryRetentionInstruction: retentionInstructionSchema,
  DiscoveryContactPreference: contactPreferenceSchema,
  DiscoveryHandoff: handoffSchema,
  DiscoveryAuditEvent: auditEventSchema,
  DiscoveryUsageCost: usageCostSchema,
});
