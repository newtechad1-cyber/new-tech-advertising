// Production runtime refresh: schema-free AI JSON parsing
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function parseJsonResult(value) {
  const candidate = value?.data ?? value;
  if (candidate && typeof candidate === 'object') return candidate;

  const text = String(candidate || '').trim()
    .replace(/^\`\`\`(?:json)?\s*/i, '')
    .replace(/\s*\`\`\`$/i, '')
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        // Fall through to a useful failure message below.
      }
    }
    throw new Error('AI returned an invalid JSON audit report.');
  }
}

const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 1_000_000;
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata',
  'metadata.google.internal',
]);

function normalizeHostname(hostname) {
  return String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
}

function isIpv4Address(value) {
  const parts = String(value || '').split('.');
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isBlockedIpv4(value) {
  if (!isIpv4Address(value)) return false;
  const [first, second] = value.split('.').map(Number);
  return first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && (second === 0 || second === 168))
    || (first === 198 && (second === 18 || second === 19 || second === 51))
    || (first === 203 && second === 0)
    || first >= 224;
}

function isBlockedIpv6(value) {
  const address = normalizeHostname(value);
  if (!address.includes(':')) return false;
  if (address === '::' || address === '::1' || /^(?:0{1,4}:){7}0{0,3}1$/.test(address)) return true;

  const mappedIpv4 = address.match(/^(?:::ffff:)?(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mappedIpv4) return isBlockedIpv4(mappedIpv4[1]);

  return /^(?:fc|fd)/i.test(address)
    || /^fe[89ab][0-9a-f]:/i.test(address)
    || /^ff/i.test(address)
    || /^2001:db8:/i.test(address);
}

function isBlockedIpAddress(value) {
  const address = normalizeHostname(value);
  return isBlockedIpv4(address) || isBlockedIpv6(address);
}

function isBlockedHostname(value) {
  const hostname = normalizeHostname(value);
  return !hostname
    || BLOCKED_HOSTNAMES.has(hostname)
    || hostname.endsWith('.localhost')
    || hostname.endsWith('.local')
    || hostname.endsWith('.internal')
    || hostname.endsWith('.home')
    || hostname.endsWith('.lan')
    || isBlockedIpAddress(hostname);
}

function parsePublicWebsiteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) throw new Error('A website URL is required.');

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('Enter a valid public website URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only public HTTP and HTTPS website URLs can be scanned.');
  }
  if (url.username || url.password) {
    throw new Error('Website URLs with embedded credentials cannot be scanned.');
  }
  if (url.port && !((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443'))) {
    throw new Error('Only standard public website ports can be scanned.');
  }
  if (isBlockedHostname(url.hostname)) {
    throw new Error('Private, local, and metadata network addresses cannot be scanned.');
  }

  return url;
}

async function assertPublicNetworkTarget(url) {
  const hostname = normalizeHostname(url.hostname);
  if (isBlockedHostname(hostname)) {
    throw new Error('Private, local, and metadata network addresses cannot be scanned.');
  }
  if (isIpv4Address(hostname) || hostname.includes(':')) return;

  const results = await Promise.allSettled([
    Deno.resolveDns(hostname, 'A'),
    Deno.resolveDns(hostname, 'AAAA'),
  ]);
  const addresses = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);

  if (!addresses.length) {
    throw new Error('The website URL could not be resolved to a public address.');
  }
  if (addresses.some(isBlockedIpAddress)) {
    throw new Error('The website URL resolves to a private or restricted network address.');
  }
}

async function readLimitedText(response) {
  const contentLength = Number(response.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('The website response is too large to scan safely.');
  }

  const reader = response.body?.getReader();
  if (!reader) return '';

  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_RESPONSE_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new Error('The website response is too large to scan safely.');
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

async function fetchPublicWebsite(value) {
  let currentUrl = parsePublicWebsiteUrl(value);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertPublicNetworkTarget(currentUrl);
    const response = await fetch(currentUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NTA-AuditBot/1.0)',
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.1',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel().catch(() => undefined);
      if (!location) throw new Error('The website returned an invalid redirect.');
      currentUrl = parsePublicWebsiteUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error('The website could not be fetched.');
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType && !/^(?:text\/html|application\/xhtml\+xml|text\/plain)(?:;|$)/i.test(contentType)) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error('The website did not return scannable text content.');
    }

    return { html: await readLimitedText(response), finalUrl: currentUrl.toString() };
  }

  throw new Error('The website redirected too many times.');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { businessName, websiteUrl, industry, city, contactName, leadSource, notes, pastedContent } = await req.json();

    if (!businessName || !websiteUrl) {
      return Response.json({ error: 'Business name and website URL are required.' }, { status: 400 });
    }

    // Fetch only a verified public website. If it cannot be safely fetched,
    // retain the existing business-info-only audit fallback.
    let websiteContent = pastedContent || '';
    let rawHtml = '';
    if (!websiteContent && websiteUrl) {
      try {
        const { html } = await fetchPublicWebsite(websiteUrl);
        rawHtml = html;
        websiteContent = rawHtml
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000);
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
      add_context_from_internet: false,
    });

    const audit = parseJsonResult(result);
    return Response.json({ success: true, audit, websiteAccessible: !!websiteContent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});