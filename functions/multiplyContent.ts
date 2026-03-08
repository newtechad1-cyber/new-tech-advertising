import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { asset_id } = await req.json();
    if (!asset_id) return Response.json({ error: 'asset_id required' }, { status: 400 });

    const asset = await base44.asServiceRole.entities.ContentAsset.get(asset_id);
    if (!asset) return Response.json({ error: 'Asset not found' }, { status: 404 });

    await base44.asServiceRole.entities.ContentAsset.update(asset_id, { status: 'generating' });

    const { source_content, content_type, title } = asset;

    const context = `
Title: ${title}
Content Type: ${content_type}
Source Content:
${source_content}
`;

    // Run all generations in parallel
    const [
      blogResult,
      youtubeResult,
      tiktokResult,
      linkedinResult,
      facebookResult,
      emailResult,
      leadMagnetResult,
      imagePromptsResult,
      videoPromptsResult
    ] = await Promise.allSettled([

      // Blog Article
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Write a 1200-1500 word SEO blog article based on this content. Structure: Introduction, Problem, Solution, Example, Call to Action. Write for small business owners. End with a CTA to learn more about NTA's AI marketing platform.\n\n${context}`
          }],
          max_tokens: 2500
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // YouTube Script
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Write a 90-second YouTube video script based on this content. Structure: Hook (0-10s), Problem (10-30s), Explanation (30-60s), Example (60-80s), Call to Action (80-90s). Make it engaging and conversational for a local business audience.\n\n${context}`
          }],
          max_tokens: 800
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // TikTok Scripts
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Write 3 separate TikTok video scripts (15-30 seconds each) based on this content. Each script should have: Hook, Tip, CTA. Label them SCRIPT 1, SCRIPT 2, SCRIPT 3. Keep them punchy and direct for a Gen Z / Millennial small business audience.\n\n${context}`
          }],
          max_tokens: 800
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // LinkedIn Post
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Write a professional LinkedIn post based on this content. Share a strategy or insight valuable to business owners and marketing professionals. Use a story-driven format. Include 3-5 relevant hashtags at the end.\n\n${context}`
          }],
          max_tokens: 600
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // Facebook Posts (JSON)
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: `Generate 5 Facebook posts based on this content. Each post targets local small business owners. Return JSON: { "posts": [ { "caption": "...", "image_prompt": "...", "cta": "..." } ] }\n\n${context}`
          }],
          max_tokens: 1200
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // Email Newsletter
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Write a full email newsletter based on this content. Structure:\nSUBJECT LINE: [compelling subject]\n\nOPENING HOOK: [2-3 sentences to grab attention]\n\nMAIN STORY: [value-packed content, 300-400 words]\n\nCTA: [clear call to action to book a demo or start a trial with NTA]\n\nWrite for small business owners who want to grow.\n\n${context}`
          }],
          max_tokens: 1000
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // Lead Magnet
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Create a short downloadable lead magnet guide based on this content. Format as "5-7 Ways [Topic]" or similar. Include: Title, Introduction, 5-7 numbered tips with explanations (2-3 sentences each), Conclusion with CTA to learn more about NTA's AI marketing platform. Make it genuinely valuable.\n\n${context}`
          }],
          max_tokens: 1200
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // Image Prompts (JSON)
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: `Create image generation prompts based on this content. Return JSON: { "prompts": [ { "type": "social|blog|thumbnail", "prompt": "...", "description": "brief label" } ] }. Generate 6 prompts total (2 social, 2 blog, 2 thumbnail). Make prompts cinematic, professional, and relevant to local small businesses.\n\n${context}`
          }],
          max_tokens: 800
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content),

      // Video Prompts (JSON)
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: `Create video generation prompts for this content. Return JSON: { "prompts": [ { "platform": "youtube|tiktok|instagram|facebook", "style": "...", "prompt": "...", "duration": "..." } ] }. Generate 4 prompts (one per platform). Be specific about visual style, scene, and mood.\n\n${context}`
          }],
          max_tokens: 600
        })
      }).then(r => r.json()).then(r => r.choices[0].message.content)

    ]);

    const getValue = (result) => result.status === 'fulfilled' ? result.value : null;

    let assetsGenerated = 0;
    const updates = {};

    const blog = getValue(blogResult);
    if (blog) { updates.blog_article = blog; assetsGenerated++; }

    const youtube = getValue(youtubeResult);
    if (youtube) { updates.youtube_script = youtube; assetsGenerated++; }

    const tiktok = getValue(tiktokResult);
    if (tiktok) { updates.tiktok_script = tiktok; assetsGenerated++; }

    const linkedin = getValue(linkedinResult);
    if (linkedin) { updates.linkedin_post = linkedin; assetsGenerated++; }

    const facebook = getValue(facebookResult);
    if (facebook) { updates.facebook_posts = facebook; assetsGenerated++; }

    const email = getValue(emailResult);
    if (email) { updates.email_newsletter = email; assetsGenerated++; }

    const leadMagnet = getValue(leadMagnetResult);
    if (leadMagnet) { updates.lead_magnet_content = leadMagnet; assetsGenerated++; }

    const imagePrompts = getValue(imagePromptsResult);
    if (imagePrompts) { updates.image_prompts = imagePrompts; assetsGenerated++; }

    const videoPrompts = getValue(videoPromptsResult);
    if (videoPrompts) { updates.video_prompts = videoPrompts; assetsGenerated++; }

    updates.status = 'complete';
    updates.assets_generated = assetsGenerated;

    await base44.asServiceRole.entities.ContentAsset.update(asset_id, updates);

    return Response.json({ success: true, assets_generated: assetsGenerated });

  } catch (error) {
    console.error('multiplyContent error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});