import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin-only Meshy workflow for the approved Free AI Guy.
 *
 * It deliberately exposes only:
 * - a compact list of completed rig candidates,
 * - four approved website-guide actions,
 * - task status and the GLB URL after success.
 *
 * The Meshy key is never returned or logged.
 */
const MESHY_API = 'https://api.meshy.ai/openapi/v1';

const APPROVED_ACTIONS = {
  hello: { id: 290, name: 'Wave_One_Hand' },
  listening: { id: 47, name: 'Listening_Gesture' },
  explaining: { id: 313, name: 'Talk_with_Hands_Open' },
  next_step: { id: 314, name: 'Talk_with_Right_Hand_Open' },
} as const;

type JsonObject = Record<string, unknown>;
type MeshyResponse = { ok: boolean; status: number; data: unknown };

function asObject(value: unknown): JsonObject | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : null;
}

function pickString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function pickNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getTaskList(value: unknown): JsonObject[] {
  const source = asObject(value);
  const candidates = [value, source?.result, source?.items, source?.data, source?.tasks];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .map(asObject)
        .filter((task): task is JsonObject => task !== null);
    }
  }

  return [];
}

function taskErrorMessage(task: JsonObject): string | null {
  const taskError = asObject(task.task_error);
  const message = pickString(taskError?.message);
  return message ? message.slice(0, 500) : null;
}

function animationSummary(task: JsonObject, includeDownloadUrl = false): JsonObject {
  const status = pickString(task.status);
  const summary: JsonObject = {
    id: pickString(task.id),
    status,
    progress: pickNumber(task.progress),
    created_at: pickNumber(task.created_at),
    started_at: pickNumber(task.started_at),
    finished_at: pickNumber(task.finished_at),
    expires_at: pickNumber(task.expires_at),
    consumed_credits: pickNumber(task.consumed_credits),
  };

  const taskError = taskErrorMessage(task);
  if (taskError) summary.task_error = taskError;

  if (includeDownloadUrl && status === 'SUCCEEDED') {
    const result = asObject(task.result);
    const glbUrl = pickString(result?.animation_glb_url);
    if (glbUrl?.startsWith('https://')) summary.animation_glb_url = glbUrl;
  }

  return summary;
}

function rigSummary(task: JsonObject): JsonObject {
  const result = asObject(task.result);
  const basicAnimations = asObject(result?.basic_animations);
  const taskError = taskErrorMessage(task);

  return {
    id: pickString(task.id),
    status: pickString(task.status),
    progress: pickNumber(task.progress),
    created_at: pickNumber(task.created_at),
    finished_at: pickNumber(task.finished_at),
    expires_at: pickNumber(task.expires_at),
    has_rigged_character_glb: Boolean(pickString(result?.rigged_character_glb_url)),
    has_basic_animations: Boolean(
      pickString(basicAnimations?.walking_glb_url)
      || pickString(basicAnimations?.running_glb_url),
    ),
    ...(taskError ? { task_error: taskError } : {}),
  };
}

async function meshyRequest(
  apiKey: string,
  path: string,
  init: RequestInit = {},
): Promise<MeshyResponse> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', 'Bearer ' + apiKey);
  headers.set('Accept', 'application/json');

  const response = await fetch(MESHY_API + path, { ...init, headers });
  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Upstream text responses are intentionally not returned to the browser.
  }

  return { ok: response.ok, status: response.status, data };
}

function validTaskId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9-]{8,128}$/.test(value);
}

function upstreamFailure(label: string, result: MeshyResponse) {
  return Response.json({
    ok: false,
    error: 'Meshy ' + label + ' request did not succeed.',
    meshy_status: result.status,
  }, { status: 502 });
}

function publicActions() {
  return Object.entries(APPROVED_ACTIONS).map(([behavior, action]) => ({
    behavior,
    id: action.id,
    name: action.name,
  }));
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  if (!user || user.role !== 'admin') {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const apiKey = Deno.env.get('MESHY_API_KEY');
  if (!apiKey) {
    return Response.json({
      ok: false,
      secret_configured: false,
      error: 'MESHY_API_KEY is not available to this backend function.',
    }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const action = pickString(asObject(body)?.action) || 'status';

  try {
    if (action === 'status') {
      const [rigging, animations] = await Promise.all([
        meshyRequest(apiKey, '/rigging?page_num=1&page_size=20'),
        meshyRequest(apiKey, '/animations?page_num=1&page_size=20'),
      ]);

      const meshyAuthenticated = ![401, 403].includes(rigging.status)
        && ![401, 403].includes(animations.status);

      return Response.json({
        ok: rigging.ok && animations.ok,
        secret_configured: true,
        meshy_authenticated: meshyAuthenticated,
        endpoint_status: {
          rigging: rigging.status,
          animations: animations.status,
        },
        approved_actions: publicActions(),
        rig_candidates: getTaskList(rigging.data)
          .filter(task => pickString(task.status) === 'SUCCEEDED')
          .map(rigSummary)
          .slice(0, 12),
        recent_animation_tasks: getTaskList(animations.data)
          .map(task => animationSummary(task))
          .slice(0, 12),
      }, { status: rigging.ok && animations.ok ? 200 : 502 });
    }

    if (action === 'start_animation') {
      const payload = asObject(body) || {};
      const rigTaskId = payload.rig_task_id;
      const behavior = pickString(payload.behavior);

      if (!validTaskId(rigTaskId)) {
        return Response.json({ ok: false, error: 'A valid rig_task_id is required.' }, { status: 400 });
      }

      const approvedAction = behavior
        ? APPROVED_ACTIONS[behavior as keyof typeof APPROVED_ACTIONS]
        : null;

      if (!approvedAction) {
        return Response.json({
          ok: false,
          error: 'Choose one of the approved website-guide behaviors.',
          approved_actions: publicActions(),
        }, { status: 400 });
      }

      const rigging = await meshyRequest(apiKey, '/rigging/' + encodeURIComponent(rigTaskId));
      if (!rigging.ok) return upstreamFailure('rigging lookup', rigging);

      const rig = asObject(rigging.data) || {};
      if (pickString(rig.status) !== 'SUCCEEDED') {
        return Response.json({
          ok: false,
          error: 'The selected rig task is not complete yet.',
          rig: rigSummary(rig),
        }, { status: 409 });
      }

      const animation = await meshyRequest(apiKey, '/animations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rig_task_id: rigTaskId,
          action_id: approvedAction.id,
        }),
      });

      if (!animation.ok) return upstreamFailure('animation creation', animation);

      const taskId = pickString(asObject(animation.data)?.result);
      if (!taskId) {
        return Response.json({
          ok: false,
          error: 'Meshy accepted the request but did not return an animation task ID.',
        }, { status: 502 });
      }

      return Response.json({
        ok: true,
        task_id: taskId,
        status: 'PENDING',
        behavior,
        action: approvedAction,
      }, { status: 202 });
    }

    if (action === 'get_animation') {
      const animationTaskId = asObject(body)?.animation_task_id;

      if (!validTaskId(animationTaskId)) {
        return Response.json({ ok: false, error: 'A valid animation_task_id is required.' }, { status: 400 });
      }

      const animation = await meshyRequest(
        apiKey,
        '/animations/' + encodeURIComponent(animationTaskId),
      );

      if (!animation.ok) return upstreamFailure('animation status', animation);

      const task = asObject(animation.data) || {};
      return Response.json({
        ok: true,
        animation: animationSummary(task, true),
      });
    }

    return Response.json({
      ok: false,
      error: 'Unsupported Meshy workflow action.',
      supported_actions: ['status', 'start_animation', 'get_animation'],
    }, { status: 400 });
  } catch {
    return Response.json({
      ok: false,
      secret_configured: true,
      error: 'Meshy request failed before a response was received.',
    }, { status: 502 });
  }
});
