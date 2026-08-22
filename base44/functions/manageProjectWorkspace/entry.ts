import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

function text(value, max) {
  return String(value || '').trim().slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const projectId = text(body?.project_id, 128);
    const action = text(body?.action, 24);
    if (!projectId || !['read', 'comment', 'file'].includes(action)) {
      return Response.json({ error: 'Invalid workspace request.' }, { status: 400 });
    }

    const project = await base44.asServiceRole.entities.Project.read(projectId);
    const isAdmin = user.role === 'admin' || user.is_service === true;
    if (!project || (!isAdmin && project.company_id !== user?.data?.client_id)) {
      return Response.json({ error: 'Project access denied.' }, { status: 403 });
    }

    if (action === 'read') {
      const [tasks, files, comments] = await Promise.all([
        base44.asServiceRole.entities.ProjectTask.filter({ project_id: projectId }, 'created_date', 200),
        base44.asServiceRole.entities.ProjectFile.filter({ project_id: projectId }, '-created_date', 200),
        base44.asServiceRole.entities.ProjectComment.filter({ project_id: projectId }, 'created_date', 300),
      ]);
      return Response.json({ tasks, files, comments });
    }

    if (action === 'comment') {
      const content = text(body?.content, 4000);
      if (!content) return Response.json({ error: 'A message is required.' }, { status: 400 });
      const comment = await base44.asServiceRole.entities.ProjectComment.create({
        project_id: projectId,
        content,
        sender_name: text(user.full_name || user.email, 160) || 'Client',
        is_manager: isAdmin,
      });
      return Response.json({ comment });
    }

    const name = text(body?.name, 240);
    const url = text(body?.url, 2048);
    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { parsedUrl = null; }
    if (!name || !parsedUrl || parsedUrl.protocol !== 'https:') {
      return Response.json({ error: 'A valid uploaded file is required.' }, { status: 400 });
    }
    const file = await base44.asServiceRole.entities.ProjectFile.create({
      project_id: projectId,
      name,
      url,
      type: text(body?.type, 80),
    });
    return Response.json({ file });
  } catch (error) {
    console.error('manageProjectWorkspace failed', error);
    return Response.json({ error: 'Unable to manage project workspace.' }, { status: 500 });
  }
});
