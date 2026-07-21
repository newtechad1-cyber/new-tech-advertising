import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const MAX_REQUEST_BODY_BYTES = 1024;

class RequestValidationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readLimitedJsonObject(req: Request): Promise<Record<string, unknown>> {
  const declaredLength = req.headers.get('content-length');
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (Number.isFinite(parsedLength) && parsedLength > MAX_REQUEST_BODY_BYTES) {
      throw new RequestValidationError('Request body too large', 413);
    }
  }

  if (!req.body) {
    return {};
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      await reader.cancel();
      throw new RequestValidationError('Request body too large', 413);
    }

    chunks.push(value);
  }

  if (totalBytes === 0) {
    return {};
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestValidationError('Invalid JSON body', 400);
  }

  if (body === null || Array.isArray(body) || typeof body !== 'object') {
    throw new RequestValidationError('Request body must be a JSON object', 400);
  }

  return body as Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await readLimitedJsonObject(req);
    const { mode = 'text' } = body;
    
    if (!['text', 'voice', 'mixed'].includes(mode as string)) {
      return Response.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Generate 32 cryptographically secure random bytes -> 64 hex chars
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const sessionKey = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session = await base44.asServiceRole.entities.DiscoverySession.create({
      model_version: 1,
      public_session_key: sessionKey,
      mode,
      stage: 'your_goal',
      status: 'initializing',
      created_at: now.toISOString(),
      last_activity_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    const categories = [
      'reason_for_conversation', 'owner_goals', 'stated_pain', 'present_process',
      'existing_tools_and_information', 'what_works_and_must_be_protected',
      'missing_or_disconnected_pieces', 'desired_improvement', 'growth_readiness',
      'operational_capacity', 'financial_considerations', 'nta_fit',
      'potential_first_priority', 'information_still_needed', 'promises_and_representations',
      'agreed_next_step'
    ];

    await base44.asServiceRole.entities.DiscoveryCategory.bulkCreate(
      categories.map(c => ({
        session_id: session.id,
        category_key: c,
        completion_state: 'not_started',
        updated_at: now.toISOString()
      }))
    );

    const persistedCategories = await base44.asServiceRole.entities.DiscoveryCategory.filter({
      session_id: session.id
    });
    const persistedCategoryKeys = new Set(
      persistedCategories.map(category => category.category_key)
    );
    if (
      persistedCategories.length !== categories.length ||
      categories.some(categoryKey => !persistedCategoryKeys.has(categoryKey))
    ) {
      throw new Error('Session category initialization incomplete');
    }

    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id: session.id,
      event_type: 'created',
      actor_type: 'owner',
      occurred_at: now.toISOString(),
      target_record_type: 'DiscoverySession',
      target_record_id: session.id,
      reason: 'Session initialized',
      metadata: { mode }
    });

    const initializedSession = await base44.asServiceRole.entities.DiscoverySession.update(
      session.id,
      { status: 'started' }
    );

    // Return only the specified fields, hiding internal database structure
    return Response.json({
      session_id: session.id,
      public_session_key: sessionKey,
      mode: initializedSession.mode,
      stage: initializedSession.stage,
      status: initializedSession.status,
      expires_at: initializedSession.expires_at
    });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
});