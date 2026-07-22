import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const json = (body: unknown, status = 200) => Response.json(body, { status });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return json({ error: 'Forbidden' }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'list';

    if (action === 'save') {
      const { session_id, workflow_status, internal_notes = '', roadmap_draft = '' } = body;
      const allowed = ['new', 'reviewing', 'waiting_on_owner', 'roadmap_in_progress', 'ready_to_follow_up', 'completed'];
      if (!session_id || !allowed.includes(workflow_status)) return json({ error: 'Invalid workspace update' }, 400);
      if (internal_notes.length > 20000 || roadmap_draft.length > 50000) return json({ error: 'Workspace text is too long' }, 413);

      const existing = await base44.asServiceRole.entities.DiscoveryAdminWorkspace.filter({ session_id });
      const payload = {
        session_id,
        workflow_status,
        internal_notes,
        roadmap_draft,
        updated_by: user.email || user.id,
        updated_at: new Date().toISOString()
      };
      const workspace = existing[0]
        ? await base44.asServiceRole.entities.DiscoveryAdminWorkspace.update(existing[0].id, payload)
        : await base44.asServiceRole.entities.DiscoveryAdminWorkspace.create(payload);
      return json({ workspace });
    }

    if (action !== 'list') return json({ error: 'Unknown action' }, 400);

    const sessions = await base44.asServiceRole.entities.DiscoverySession.list('-last_activity_at', 250);
    const visible = sessions.filter((session: any) =>
      !['initializing', 'deleted', 'expired'].includes(session.status)
    );

    const [summaries, contacts, handoffs, consents, workspaces] = await Promise.all([
      base44.asServiceRole.entities.DiscoveryConfirmedSummary.list('-created_at', 500),
      base44.asServiceRole.entities.DiscoveryContactPreference.list('-created_date', 500),
      base44.asServiceRole.entities.DiscoveryHandoff.list('-requested_at', 500),
      base44.asServiceRole.entities.DiscoveryConsent.list('-captured_at', 1000),
      base44.asServiceRole.entities.DiscoveryAdminWorkspace.list('-updated_at', 500)
    ]);

    const latestBySession = (items: any[], dateField: string) => {
      const map = new Map();
      [...items].sort((a, b) => String(b[dateField] || '').localeCompare(String(a[dateField] || '')))
        .forEach(item => { if (!map.has(item.session_id)) map.set(item.session_id, item); });
      return map;
    };

    const summaryMap = latestBySession(summaries, 'created_at');
    const contactMap = latestBySession(contacts, 'created_date');
    const handoffMap = latestBySession(handoffs, 'requested_at');
    const workspaceMap = latestBySession(workspaces, 'updated_at');

    const discoveries = visible.map((session: any) => ({
      session: {
        id: session.id,
        mode: session.mode,
        stage: session.stage,
        status: session.status,
        created_at: session.created_at,
        last_activity_at: session.last_activity_at,
        confirmed_at: session.confirmed_at
      },
      summary: summaryMap.get(session.id) || null,
      contact: contactMap.get(session.id) || null,
      handoff: handoffMap.get(session.id) || null,
      consents: consents.filter((item: any) => item.session_id === session.id).map((item: any) => ({
        consent_type: item.consent_type,
        state: item.state,
        captured_at: item.captured_at
      })),
      workspace: workspaceMap.get(session.id) || {
        session_id: session.id,
        workflow_status: 'new',
        internal_notes: '',
        roadmap_draft: ''
      }
    }));

    return json({ discoveries });
  } catch (error) {
    console.error('manageDiscoveryAdmin failed', error);
    return json({ error: 'Unable to load Growth Discoveries' }, 500);
  }
});
