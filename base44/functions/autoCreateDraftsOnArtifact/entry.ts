/**
 * autoCreateDraftsOnArtifact
 * Triggered by entity automation when an AiArtifact is created.
 * If artifact_type === 'content_pack', creates ContentDrafts automatically.
 * Also schedules media generation for the first 10 drafts.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const body = await req.json();
  const event = body?.event;
  const artifactData = body?.data;

  if (!artifactData || artifactData.artifact_type !== 'content_pack') {
    return Response.json({ skipped: true, reason: 'not a content_pack artifact' });
  }

  const artifactId = artifactData.id || event?.entity_id;
  if (!artifactId) return Response.json({ skipped: true, reason: 'no artifact id' });

  const accountId = artifactData.account_id;
  const content = artifactData.content || {};
  const posts = content.posts || [];

  if (!posts.length) {
    return Response.json({ skipped: true, reason: 'no posts in artifact' });
  }

  // Idempotency: check existing drafts from this artifact
  const existingDrafts = await base44.asServiceRole.entities.ContentDraft.filter({
    account_id: accountId,
    source_artifact_id: artifactId,
  });
  const existingKeys = new Set(existingDrafts.map(d => `${d.platform}::${d.hook}`));

  let createdCount = 0;
  const draftIds = [];

  for (const post of posts) {
    const dupeKey = `${post.platform}::${post.hook}`;
    if (existingKeys.has(dupeKey)) continue;

    const draft = await base44.asServiceRole.entities.ContentDraft.create({
      account_id: accountId,
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

  // Optionally kick off media generation for first 10 drafts that have image_prompt
  const first10 = draftIds.slice(0, 10);
  for (const draftId of first10) {
    const drafts = await base44.asServiceRole.entities.ContentDraft.filter({ id: draftId });
    const draft = drafts?.[0];
    if (draft?.image_prompt) {
      // Fire-and-forget — don't block response
      base44.asServiceRole.functions.invoke('generateDraftMedia', {
        draftId,
        type: 'ai_image',
      }).catch(() => {});
    }
  }

  return Response.json({ success: true, createdCount, draftIds });
});