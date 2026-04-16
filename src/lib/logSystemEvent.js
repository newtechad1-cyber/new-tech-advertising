/**
 * logSystemEvent - Frontend reusable logging helper
 *
 * Safely creates a SystemLog record. Never throws back into the calling workflow.
 * Call from any page, component, or action handler.
 *
 * Usage:
 *   import { logSystemEvent } from '@/lib/logSystemEvent';
 *   await logSystemEvent({ event_type: 'submission_saved', entity_type: 'Submission', entity_id: sub.id, message: 'HVAC funnel submission saved' });
 */

import { base44 } from '@/api/base44Client';

/**
 * @param {Object} params
 * @param {string} params.event_type - machine-readable event name (required)
 * @param {string} [params.source_system]
 * @param {string} [params.source_route]
 * @param {string} [params.source_component]
 * @param {string} [params.entity_type]
 * @param {string} [params.entity_id]
 * @param {string} [params.related_entity_type]
 * @param {string} [params.related_entity_id]
 * @param {string} [params.workflow_type]
 * @param {string} [params.workflow_stage]
 * @param {'started'|'success'|'failed'|'warning'|'skipped'} [params.status]
 * @param {string} [params.message]
 * @param {string|Error} [params.error_details]
 * @param {Object} [params.payload_snapshot]
 * @param {string} [params.user_context]
 * @param {'info'|'warning'|'error'|'critical'} [params.log_level]
 */
export async function logSystemEvent(params) {
  try {
    const {
      event_type,
      source_system = 'website',
      source_route = typeof window !== 'undefined' ? window.location.pathname : '',
      source_component = '',
      entity_type = '',
      entity_id = '',
      related_entity_type = '',
      related_entity_id = '',
      workflow_type = 'system',
      workflow_stage = '',
      status = 'success',
      message = '',
      error_details,
      payload_snapshot,
      user_context = '',
      log_level,
    } = params;

    // Auto-assign log_level based on status if not provided
    const resolvedLogLevel = log_level || (
      status === 'failed' ? 'error' :
      status === 'warning' ? 'warning' :
      status === 'started' ? 'info' : 'info'
    );

    // Safely serialize error_details
    const errorStr = error_details
      ? (error_details instanceof Error ? error_details.message : String(error_details))
      : '';

    // Safely serialize payload (strip any potential secrets)
    let payloadStr = '';
    if (payload_snapshot) {
      try {
        const safe = { ...payload_snapshot };
        // Strip known secret-like keys
        ['password', 'secret', 'token', 'key', 'api_key', 'stripe_key'].forEach(k => { delete safe[k]; });
        payloadStr = JSON.stringify(safe).slice(0, 2000); // cap at 2KB
      } catch (_) {
        payloadStr = String(payload_snapshot).slice(0, 500);
      }
    }

    await base44.entities.SystemLog.create({
      event_type,
      source_system,
      source_route,
      source_component,
      entity_type,
      entity_id: entity_id ? String(entity_id) : '',
      related_entity_type,
      related_entity_id: related_entity_id ? String(related_entity_id) : '',
      workflow_type,
      workflow_stage,
      status,
      message,
      error_details: errorStr,
      payload_snapshot: payloadStr,
      user_context,
      log_level: resolvedLogLevel,
    });
  } catch (loggingError) {
    // Never block the main workflow
    console.warn('[SystemLog] Failed to write log entry:', loggingError?.message || loggingError);
  }
}