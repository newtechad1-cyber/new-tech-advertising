import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accountId } = await req.json();
    if (!accountId) return Response.json({ error: 'accountId required' }, { status: 400 });

    // Get account info
    const account = await base44.asServiceRole.entities.TrialAccount.get(accountId);
    if (!account) return Response.json({ error: 'Account not found' }, { status: 404 });

    // Find posts that need manual posting and haven't been notified today
    const posts = await base44.asServiceRole.entities.ScheduledPost.filter({
      account_id: accountId,
      status: 'manual_required',
      notified_daily: false,
    });

    if (posts.length === 0) {
      return Response.json({ success: true, sent: false, reason: 'No posts needing notification' });
    }

    // Get draft info for each post
    const draftIds = [...new Set(posts.map(p => p.draft_id).filter(Boolean))];
    const allDrafts = await base44.asServiceRole.entities.ContentDraft.filter({ account_id: accountId });
    const draftsMap = {};
    allDrafts.forEach(d => { draftsMap[d.id] = d; });

    const postLines = posts.map(p => {
      const draft = draftsMap[p.draft_id];
      const hook = draft?.hook || 'Untitled post';
      const platform = p.platform.charAt(0).toUpperCase() + p.platform.slice(1);
      const time = p.scheduled_for ? new Date(p.scheduled_for).toLocaleString('en-US', { timeZone: 'America/Chicago' }) : '';
      return `• [${platform}] ${hook}${time ? ` — ${time}` : ''}`;
    }).join('\n');

    const count = posts.length;
    const queueUrl = `https://app.base44.com/content/scheduled?account_id=${accountId}`;

    const emailBody = `
Hi ${account.name || 'there'},

You have <strong>${count} post${count !== 1 ? 's' : ''}</strong> ready to publish today!

${postLines.split('\n').map(l => `<p style="margin:4px 0;">${l}</p>`).join('')}

<br/>
<a href="${queueUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Open Posting Queue →</a>

<br/><br/>
<small>You're receiving this because you have posts scheduled on your NTA account. To manage notification preferences, visit your account settings.</small>
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: account.email,
      subject: `You have ${count} post${count !== 1 ? 's' : ''} ready to publish today`,
      body: emailBody,
      from_name: 'NTA Content Team',
    });

    // Mark all as notified
    for (const post of posts) {
      await base44.asServiceRole.entities.ScheduledPost.update(post.id, { notified_daily: true });
    }

    return Response.json({ success: true, sent: true, count, email: account.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});