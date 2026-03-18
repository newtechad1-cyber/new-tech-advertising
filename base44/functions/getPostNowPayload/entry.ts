import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PLATFORM_STEPS = {
  instagram: [
    'Open Instagram app on your phone',
    'Tap the + icon to create a new post',
    'Upload the media image (copy URL or save image)',
    'Paste the full caption (already copied)',
    'Paste the hashtags below the caption',
    'Add location tag if relevant',
    'Tap Share',
  ],
  facebook: [
    'Open Facebook on your browser or app',
    'Click "What\'s on your mind?" on your Page',
    'Paste the full caption',
    'Attach the media image if present',
    'Click Post',
  ],
  linkedin: [
    'Open LinkedIn and go to your Company Page',
    'Click "Start a post"',
    'Paste the full caption and hashtags',
    'Attach the media image if present',
    'Click Post',
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { scheduledPostId } = await req.json();
    if (!scheduledPostId) return Response.json({ error: 'scheduledPostId required' }, { status: 400 });

    const post = await base44.asServiceRole.entities.ScheduledPost.get(scheduledPostId);
    if (!post) return Response.json({ error: 'ScheduledPost not found' }, { status: 404 });

    const draft = await base44.asServiceRole.entities.ContentDraft.get(post.draft_id);
    if (!draft) return Response.json({ error: 'Draft not found' }, { status: 404 });

    const hashtags = draft.hashtags || [];
    const hashtagString = hashtags.join(' ');
    const full_post_text = [draft.caption, hashtagString].filter(Boolean).join('\n\n');

    return Response.json({
      success: true,
      scheduled_post: {
        id: post.id,
        platform: post.platform,
        scheduled_for: post.scheduled_for,
        status: post.status,
        publish_mode: post.publish_mode,
      },
      draft: {
        id: draft.id,
        hook: draft.hook,
        cta: draft.cta,
        caption: draft.caption,
        hashtags,
        hashtag_string: hashtagString,
        full_post_text,
        image_prompt: draft.image_prompt,
        media_url: draft.media_url || null,
        media_type: draft.media_type || 'none',
        platform: draft.platform,
      },
      posting_steps: PLATFORM_STEPS[post.platform] || [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});