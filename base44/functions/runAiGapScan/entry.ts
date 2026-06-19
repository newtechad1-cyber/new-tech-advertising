import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { businessName, websiteUrl, industry, city, contactName, leadSource, notes, pastedContent } = await req.json();

    if (!businessName || !websiteUrl) {
      return Response.json({ error: 'Business name and website URL are required.' }, { status: 400 });
    }

    // Try to fetch the website content
    let websiteContent = pastedContent || '';
    let rawHtml = '';
    if (!websiteContent && websiteUrl) {
      try {
        const fetchRes = await fetch(websiteUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NTA-AuditBot/1.0)' },
          signal: AbortSignal.timeout(8000),
        });
        if (fetchRes.ok) {
          rawHtml = await fetchRes.text();
          websiteContent = rawHtml
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 4000);
        }
      } catch (_e) {
        websiteContent = '';
      }
    }

    // Basic accessibility signal checks from raw HTML
    const accessibilitySignals = [];
    if (rawHtml) {
      const imgsMissingAlt = (rawHtml.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;
      if (imgsMissingAlt > 0) accessibilitySignals.push(`${imgsMissingAlt} image(s) appear to be missing alt text`);
      if (!/<h1[\s>]/i.test(rawHtml)) accessibilitySignals.push('No H1 heading tag detected');
      if (!/<label[\s>]/i.test(rawHtml) && /<input/i.test(rawHtml)) accessibilitySignals.push('Form inputs may be missing labels');
      if (!/<h2[\s>]/i.test(rawHtml)) accessibilitySignals.push('No H2 headings detected — heading structure may be weak');
    }

    const contextInfo = [
      websiteContent ? `Website content extracted:\n${websiteContent}` : `NOTE: Could not access website directly. Base analysis on URL pattern and business info only.`,
      industry ? `Industry: ${industry}` : '',
      city ? `City/Market: ${city}` : '',
      contactName ? `Contact: ${contactName}` : '',
      notes ? `Extra notes: ${notes}` : '',
      accessibilitySignals.length > 0 ? `Accessibility signals detected: ${accessibilitySignals.join('; ')}` : '',
    ].filter(Boolean).join('\n');

    const prompt = `You are Rick Hesse's AI assistant at New Tech Advertising, a local digital marketing agency in Mason City, Iowa. Your job is to analyze a local business's website and generate a practical, sales-focused gap audit report that Rick can send to a prospect.

Business: ${businessName}
Website: ${websiteUrl}
${contextInfo}

Analyze the website and generate a report in this EXACT JSON format (no markdown, just valid JSON):

{
  "quick_summary": "2-3 sentence plain-language summary of the website's current lead generation situation",
  "doing_well": ["positive point 1", "positive point 2", "positive point 3"],
  "gap_1": "Short title of gap 1",
  "gap_1_why": "Why this gap is costing them leads (1-2 sentences, plain language)",
  "gap_2": "Short title of gap 2",
  "gap_2_why": "Why this gap is costing them leads",
  "gap_3": "Short title of gap 3",
  "gap_3_why": "Why this gap is costing them leads",
  "costing_them": "Plain-language explanation of what these gaps may be costing them in leads/revenue (2-3 sentences, no made-up numbers, just realistic framing)",
  "recommended_fixes": ["Fix 1", "Fix 2", "Fix 3", "Fix 4"],
  "quick_wins": ["Quick win 1", "Quick win 2", "Quick win 3"],
  "suggested_next_step": "A friendly, non-pushy next step suggestion",
  "internal_notes": "Notes for Rick about this prospect — things to mention in the sales call, what services fit best, tone to use",
  "accessibility": {
    "score": 60,
    "summary": "1-2 sentence plain-language summary of the website's usability and accessibility for all visitors",
    "issues": ["Issue 1 described in business-friendly terms", "Issue 2", "Issue 3"],
    "quick_wins": ["Quick accessibility win 1", "Quick accessibility win 2"],
    "executive_note": "One sentence for the executive summary if accessibility is weak (optional, leave blank if score >= 70)"
  },
  "categories": {
    "first_impression": "brief note",
    "offer_clarity": "brief note",
    "cta_strength": "brief note",
    "lead_capture": "brief note",
    "local_seo": "brief note",
    "trust_signals": "brief note",
    "reviews": "brief note",
    "mobile": "brief note",
    "service_pages": "brief note",
    "social_proof": "brief note",
    "conversion_gaps": "brief note",
    "accessibility_usability": "brief note"
  },
  "score": {
    "overall": 62,
    "lead_generation": 55,
    "local_visibility": 60,
    "trust": 65,
    "conversion": 50,
    "website_structure": 58
  }
}

Guidelines:
- Use friendly, direct language a local business owner can understand
- Focus on leads, calls, trust, and conversion — not technical SEO jargon
- Be helpful and encouraging, not harsh
- Scores should be realistic (40-85 range typically), not fake 90s or 30s
- If you can't access the site, make reasonable inferences from the URL and business type
- All text should sound like a helpful local marketing advisor, not a robot
- For accessibility section: NEVER use fear-based language like "ADA violation", "non-compliant", or "you could get sued". Instead frame as usability, mobile experience, and SEO impact. Example: "Several images are missing descriptive alt text, which may reduce accessibility for some visitors and slightly weaken SEO performance."
- The website_structure score should factor in: mobile responsiveness, page speed, SEO structure, accessibility basics, conversion flow, CTA clarity, content organization, local SEO signals, AI discoverability, and trust indicators
- Accessibility score: 70+ = generally good, 50-69 = some improvements recommended, below 50 = notable usability gaps worth addressing`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          quick_summary: { type: 'string' },
          doing_well: { type: 'array', items: { type: 'string' } },
          gap_1: { type: 'string' },
          gap_1_why: { type: 'string' },
          gap_2: { type: 'string' },
          gap_2_why: { type: 'string' },
          gap_3: { type: 'string' },
          gap_3_why: { type: 'string' },
          costing_them: { type: 'string' },
          recommended_fixes: { type: 'array', items: { type: 'string' } },
          quick_wins: { type: 'array', items: { type: 'string' } },
          suggested_next_step: { type: 'string' },
          internal_notes: { type: 'string' },
          accessibility: { type: 'object' },
          categories: { type: 'object' },
          score: { type: 'object' },
        }
      },
      model: 'gpt_5_4',
      add_context_from_internet: false,
    });

    return Response.json({ success: true, audit: result, websiteAccessible: !!websiteContent });
  } catch (error) {
    
    fetch('https://grateful-lynx-44.convex.site/api/webhook/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: 'Y24RdJ7OjvX8lrcjPRDCYcusOnAspC9DbYkqJtY1Zb0',
        source: 'nta-website',
        form: 'ai-gap-scanner',
        name: contactName || '',
        business_name: businessName || '',
        email: '',
        phone: '',
        website: websiteUrl || '',
        industry: industry || '',
        service_interest: '',
        notes: notes || '',
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('Webhook failed:', err));

return Response.json({ error: error.message }, { status: 500 });
  }
});