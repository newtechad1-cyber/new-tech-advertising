import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { core_id } = await req.json();
  if (!core_id) return Response.json({ error: 'core_id required' }, { status: 400 });

  const cores = await base44.asServiceRole.entities.AuthorityContentCore.filter({ id: core_id });
  if (!cores.length) return Response.json({ error: 'AuthorityContentCore not found' }, { status: 404 });
  const core = cores[0];

  const ctx = `
Topic: ${core.primary_topic}
Title: ${core.title}
Industry: ${core.industry || 'general small business'}
Audience: ${core.target_audience || 'local small business owners'}
Local Market: ${core.local_market_focus || 'national'}
Angle: ${core.content_angle || 'authority positioning'}
Funnel Stage: ${core.funnel_stage || 'Awareness'}
  `.trim();

  const llm = (prompt) =>
    base44.asServiceRole.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });

  // 1 — Long-form authority article
  const articleRes = await llm(`
You are NTA's senior content strategist. Write a 1400-word SEO authority article.
${ctx}
Structure: H1 title, intro with pain point hook, 4-5 H2 sections with actionable insights, CTA close.
Use NTA's authoritative voice. Address small-business pain points directly. No fluff.
Return only the article text with markdown formatting.
  `);
  await base44.asServiceRole.entities.AuthorityContentCore.update(core_id, {
    longform_article: articleRes,
  });

  const save = (asset) =>
    base44.asServiceRole.entities.ContentAsset.create({
      core_content_id: core_id,
      publish_status: 'draft',
      ...asset,
    });

  // 2 — 5 derivative SEO articles
  const seoRes = await llm(`
Generate 5 derivative SEO article outlines + 200-word intro paragraphs based on:
${ctx}
Make each scalable for different cities or service niches.
Return as JSON array: [{ title, keyword_focus, content_body }]
  `);
  let seoItems = [];
  try { seoItems = typeof seoRes === 'object' ? seoRes : JSON.parse(seoRes); } catch (_) {}
  for (const item of (Array.isArray(seoItems) ? seoItems : [])) {
    await save({ asset_type: 'seo_article', ...item });
  }

  // 3 — 3 service page drafts
  const spRes = await llm(`
Write 3 conversion-focused service page copy drafts based on:
${ctx}
Each should have: headline, sub-headline, 3 benefit bullets, social proof placeholder, CTA.
Return as JSON array: [{ title, keyword_focus, content_body }]
  `);
  let spItems = [];
  try { spItems = typeof spRes === 'object' ? spRes : JSON.parse(spRes); } catch (_) {}
  for (const item of (Array.isArray(spItems) ? spItems : [])) {
    await save({ asset_type: 'service_page', platform_target: 'website', ...item });
  }

  // 4 — Video scripts (1 long + 3 short)
  const vsRes = await llm(`
Create 4 video scripts based on: ${ctx}
Script 1: Long YouTube authority video (5-7 min, structured with hook/body/CTA)
Scripts 2-4: Short-form Reels/TikTok hooks (30-60 sec each, pattern interrupt opening)
Return as JSON array: [{ title, platform_target, content_body }]
platform_target values: "YouTube", "Instagram Reels", "TikTok", "TikTok"
  `);
  let vsItems = [];
  try { vsItems = typeof vsRes === 'object' ? vsRes : JSON.parse(vsRes); } catch (_) {}
  for (const item of (Array.isArray(vsItems) ? vsItems : [])) {
    await save({ asset_type: 'video_script', ...item });
  }

  // 5 — Social posts (5 FB + 5 LI + 3 promo)
  const socialRes = await llm(`
Create 13 social media posts based on: ${ctx}
Posts 1-5: Facebook (conversational, story-driven, local feel)
Posts 6-10: LinkedIn (authority, professional insight, thought leadership)
Posts 11-13: Promotional captions (Instagram/Facebook, product benefit, strong CTA)
Return as JSON array: [{ title, platform_target, content_body }]
  `);
  let socialItems = [];
  try { socialItems = typeof socialRes === 'object' ? socialRes : JSON.parse(socialRes); } catch (_) {}
  for (const item of (Array.isArray(socialItems) ? socialItems : [])) {
    await save({ asset_type: 'social_post', ...item });
  }

  // 6 — Ad copy
  const adRes = await llm(`
Create ad creative copy variations based on: ${ctx}
Section 1 — 3 scroll-stopping headlines (max 8 words each)
Section 2 — 3 benefit blocks (problem + solution + outcome format)
Section 3 — 3 CTA variations (urgency-driven, benefit-driven, question-driven)
Return as JSON array: [{ title, content_body }]
  `);
  let adItems = [];
  try { adItems = typeof adRes === 'object' ? adRes : JSON.parse(adRes); } catch (_) {}
  for (const item of (Array.isArray(adItems) ? adItems : [])) {
    await save({ asset_type: 'ad_copy', platform_target: 'Paid Ads', ...item });
  }

  // 7 — Landing page
  const lpRes = await llm(`
Write high-conversion SaaS-style landing page copy based on: ${ctx}
Sections: Hero headline + sub, Problem agitation (3 bullets), Solution intro, Feature/benefit grid (6 items), Social proof section, FAQ (3 Q&A), CTA section.
Return as JSON: { title, content_body }
  `);
  let lpItem = {};
  try { lpItem = typeof lpRes === 'object' ? lpRes : JSON.parse(lpRes); } catch (_) {}
  if (lpItem.title) {
    await save({ asset_type: 'landing_page', platform_target: 'website', ...lpItem });
  }

  // 8 — Email sequence (3 emails)
  const emailRes = await llm(`
Write a 3-email nurture sequence based on: ${ctx}
Email 1: Welcome + Authority positioning (establish credibility)
Email 2: Education email (teach one key insight, build trust)
Email 3: Urgency + Conversion email (limited offer, strong CTA)
Return as JSON array: [{ title, content_body }]
  `);
  let emailItems = [];
  try { emailItems = typeof emailRes === 'object' ? emailRes : JSON.parse(emailRes); } catch (_) {}
  for (const item of (Array.isArray(emailItems) ? emailItems : [])) {
    await save({ asset_type: 'email', platform_target: 'Email', ...item });
  }

  // 9 — GBP posts
  const gbpRes = await llm(`
Write 3 Google Business Profile posts based on: ${ctx}
Each should be 150-200 words, local visibility focused, include a keyword naturally, end with a CTA.
Return as JSON array: [{ title, keyword_focus, content_body }]
  `);
  let gbpItems = [];
  try { gbpItems = typeof gbpRes === 'object' ? gbpRes : JSON.parse(gbpRes); } catch (_) {}
  for (const item of (Array.isArray(gbpItems) ? gbpItems : [])) {
    await save({ asset_type: 'gbp_post', platform_target: 'Google Business Profile', ...item });
  }

  // 10 — Ebook chapter
  const ebookRes = await llm(`
Expand the following topic into a structured ebook chapter (800-1000 words): ${ctx}
Include: Chapter title, intro paragraph, 3-4 sections with subheadings, key takeaways box, transition teaser to next chapter.
Return as JSON: { title, content_body }
  `);
  let ebookItem = {};
  try { ebookItem = typeof ebookRes === 'object' ? ebookRes : JSON.parse(ebookRes); } catch (_) {}
  if (ebookItem.title) {
    await save({ asset_type: 'ebook_chapter', platform_target: 'Ebook / Lead Magnet', ...ebookItem });
  }

  // Mark complete
  await base44.asServiceRole.entities.AuthorityContentCore.update(core_id, { status: 'complete' });

  return Response.json({ success: true, message: 'Content multiplication complete' });
});