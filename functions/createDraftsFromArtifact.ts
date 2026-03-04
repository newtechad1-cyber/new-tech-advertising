import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });

  const { artifactId, dryRun = false } = await req.json();
  if (!artifactId) return Response.json({ error: 'artifactId required' }, { status: 400 });

  // Load artifact
  const artifacts = await base44.asServiceRole.entities.AiArtifact.filter({ id: artifactId });
  if (!artifacts.length) return Response.json({ error: 'Artifact not found' }, { status: 404 });
  const artifact = artifacts[0];

  if (artifact.artifact_type !== 'content_pack') {
    return Response.json({ error: 'Artifact must be of type content_pack' }, { status: 422 });
  }

  const content = artifact.content || {};
  const posts = content.posts || [];
  if (!posts.length) return Response.json({ error: 'No posts found in content_pack artifact' }, { status: 422 });

  if (dryRun) {
    return Response.json({ dryRun: true, postsFound: posts.length, accountId: artifact.account_id });
  }

  // Check for existing drafts from this artifact (for duplicate detection)
  const existingDrafts = await base44.asServiceRole.entities.ContentDraft.filter({
    account_id: artifact.account_id,
    source_artifact_id: artifactId,
  });

  const existingKeys = new Set(existingDrafts.map(d => `${d.platform}::${d.hook}`));

  let createdCount = 0;
  let skippedCount = 0;
  const draftIds = [];

  for (const post of posts) {
    const dupeKey = `${post.platform}::${post.hook}`;
    if (existingKeys.has(dupeKey)) {
      skippedCount++;
      continue;
    }

    const draft = await base44.asServiceRole.entities.ContentDraft.create({
      account_id: artifact.account_id,
      source_artifact_id: artifactId,
      platform: post.platform || 'facebook',
      pillar: post.pillar || null,
      goal: post.goal || null,
      hook: post.hook || '',
      caption: post.caption || '',
      hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      cta: post.cta || '',
      image_prompt: post.image_prompt || '',
      video_script: post.video_script || null,
      status: 'draft',
    });
    draftIds.push(draft.id);
    createdCount++;
  }

  return Response.json({ success: true, createdCount, skippedCount, draftIds });
});