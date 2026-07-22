/**
 * Canonical vocabulary for the NTA Growth Guide.
 *
 * This module contains domain rules only. It does not replace existing SalesLead,
 * Subscriber, task, appointment, or GapAudit records.
 */

export const GROWTH_GUIDE_MODEL_VERSION = 1;

export const DISCOVERY_MODES = ['text', 'voice', 'mixed'];
export const DISCOVERY_STAGES = [
  'your_goal',
  'what_is_happening_now',
  'what_needs_to_change',
  'review_what_we_heard',
];

export const DISCOVERY_STATUSES = [
  'started',
  'in_progress',
  'paused',
  'saved',
  'summary_ready',
  'confirmed',
  'needs_rick_review',
  'handoff_requested',
  'completed',
  'deletion_requested',
  'deleted',
  'expired',
];

export const DISCOVERY_CATEGORY_KEYS = [
  'reason_for_conversation',
  'owner_goals',
  'stated_pain',
  'present_process',
  'existing_tools_and_information',
  'what_works_and_must_be_protected',
  'missing_or_disconnected_pieces',
  'desired_improvement',
  'growth_readiness',
  'operational_capacity',
  'financial_considerations',
  'nta_fit',
  'potential_first_priority',
  'information_still_needed',
  'promises_and_representations',
  'agreed_next_step',
];

export const CATEGORY_COMPLETION_STATES = [
  'not_started',
  'in_progress',
  'complete',
  'not_yet_known',
];

export const CONVERSATION_SPEAKERS = ['owner', 'growth_guide', 'rick', 'system'];
export const SOURCE_MODES = ['text', 'voice_transcript', 'human_note', 'system'];
export const OBSERVATION_REVIEW_STATES = [
  'unreviewed',
  'accepted',
  'corrected',
  'rejected',
];

export const CONSENT_TYPES = [
  'discovery_processing',
  'microphone',
  'transcription',
  'raw_audio_retention',
  'save_and_return',
  'personal_follow_up',
  'journal',
];

export const CONSENT_STATES = ['not_asked', 'granted', 'declined', 'withdrawn'];

export const RETENTION_TARGETS = [
  'raw_audio',
  'working_transcript',
  'working_discovery',
  'confirmed_summary',
  'relationship_record',
];

export const RETENTION_ACTIONS = ['delete', 'save'];
export const RETENTION_STATUSES = [
  'pending',
  'scheduled',
  'completed',
  'failed',
  'cancelled',
];

export const CONTACT_CHANNELS = ['phone', 'text_message', 'email', 'meeting'];
export const HANDOFF_TYPES = [
  'schedule_growth_conversation',
  'call_nta',
  'request_callback',
  'continue_by_email',
  'receive_summary',
  'save_and_return',
];
export const RICK_REVIEW_STATES = [
  'not_requested',
  'needs_review',
  'in_review',
  'reviewed',
];

export const AUDIT_EVENT_TYPES = [
  'created',
  'accessed',
  'exported',
  'corrected',
  'status_changed',
  'consent_changed',
  'retention_changed',
  'deletion_requested',
  'deletion_completed',
  'deletion_failed',
];

export const DISCOVERY_ENTITY_NAMES = Object.freeze({
  session: 'DiscoverySession',
  conversationEntry: 'DiscoveryConversationEntry',
  category: 'DiscoveryCategory',
  aiObservation: 'DiscoveryAIObservation',
  confirmedSummary: 'DiscoveryConfirmedSummary',
  consent: 'DiscoveryConsent',
  retentionInstruction: 'DiscoveryRetentionInstruction',
  contactPreference: 'DiscoveryContactPreference',
  handoff: 'DiscoveryHandoff',
  auditEvent: 'DiscoveryAuditEvent',
  usageCost: 'DiscoveryUsageCost',
});

export const EXISTING_ENTITY_RELATIONSHIPS = Object.freeze({
  SalesLead: {
    direction: 'optional_downstream',
    rule: 'Link or create only after the owner identifies themselves or requests contact.',
  },
  Subscriber: {
    direction: 'optional_downstream',
    rule: 'Link only after separate, affirmative Journal consent.',
  },
  Task: {
    direction: 'optional_downstream',
    rule: 'Create for a requested handoff, Rick review, or failed administrative action.',
  },
  Appointment: {
    direction: 'optional_downstream',
    rule: 'Link only when the owner deliberately schedules or requests scheduling.',
  },
  GapAudit: {
    direction: 'separate_paid_service',
    rule: 'Never create merely because free discovery started or completed.',
  },
});

export const DEFAULT_RETENTION_POLICY = Object.freeze({
  anonymousSessionHours: 24,
  savedSessionDays: 30,
  rawAudio: 'delete',
  workingTranscript: 'delete_after_confirmed_summary_and_handoff',
  workingDiscovery: 'delete_after_confirmed_summary_and_handoff',
  confirmedSummary: 'preserve_as_required_relationship_record',
});

export function getInitialCategoryRecords(sessionId) {
  return DISCOVERY_CATEGORY_KEYS.map((categoryKey) => ({
    session_id: sessionId,
    category_key: categoryKey,
    owner_supported_facts: [],
    completion_state: 'not_started',
  }));
}
