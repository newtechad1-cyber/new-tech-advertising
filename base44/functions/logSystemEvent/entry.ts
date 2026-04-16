/**
 * logSystemEvent - Backend reusable logging helper
 *
 * Safely creates a SystemLog record from backend functions.
 * Never throws back into the calling workflow.
 *
 * Usage (inside any backend function):
 *   const { logEvent } = await import('./logSystemEvent.js'); // NOT POSSIBLE - use inline
 *
 * IMPORTANT: Since Deno functions can't share local imports, copy the logEvent helper inline
 * or call this as a standalone function via base44.functions.invoke('logSystemEvent', {...})
 *
 * This file is ALSO a standalone invocable function endpoint for logging from other functions.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const params = await req.json();

    const {
      event_type,
      source_system = 'base44_function',
      source_route = '',
      source_component = '',
      entity_type = '',
      entity_id = '',
      related_entity_type = '',
      related_entity_id = '',
      workflow_type = 'system',
      workflow_stage = '',
      status = 'success',
      message = '',
      error_details = '',
      payload_snapshot = '',
      user_context = '',
      log_level,
    } = params;

    if (!event_type) {
      return Response.json({ error: 'event_type is required' }, { status: 400 });
    }

    const resolvedLogLevel = log_level || (
      status === 'failed' ? 'error' :
      status === 'warning' ? 'warning' : 'info'
    );

    let payloadStr = '';
    if (payload_snapshot) {
      try {
        const safe = typeof payload_snapshot === 'string' ? payload_snapshot : JSON.stringify(payload_snapshot);
        payloadStr = safe.slice(0, 2000);
      } catch (_) {
        payloadStr = String(payload_snapshot).slice(0, 500);
      }
    }

    const log = await base44.asServiceRole.entities.SystemLog.create({
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
      error_details: String(error_details || ''),
      payload_snapshot: payloadStr,
      user_context,
      log_level: resolvedLogLevel,
    });

    return Response.json({ ok: true, log_id: log.id });
  } catch (err) {
    console.warn('[logSystemEvent] Failed to write log:', err.message);
    return Response.json({ ok: false, error: err.message }, { status: 200 }); // 200 so callers don't treat this as blocking
  }
});