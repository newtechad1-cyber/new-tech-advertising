import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
// Keep URL safeguards in this entry point: the remote function is deployed independently.
const PRIVATE_HOST_SUFFIXES = [
  '.localhost',
  '.local',
  '.internal',
  '.lan',
  '.home',
];

function stripIpv6Brackets(hostname) {
  return String(hostname || '').replace(/^\[|\]$/g, '').toLowerCase();
}

function isPrivateIpv4(hostname) {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

function isPrivateIpv6(hostname) {
  const value = hostname.replace(/^::ffff:/i, '');
  if (value.includes('.') && isPrivateIpv4(value)) return true;

  return (
    value === '::' ||
    value === '::1' ||
    value.startsWith('fc') ||
    value.startsWith('fd') ||
    value.startsWith('fe8') ||
    value.startsWith('fe9') ||
    value.startsWith('fea') ||
    value.startsWith('feb')
  );
}

function isPrivateOrLocalHostname(input) {
  const hostname = stripIpv6Brackets(input);
  if (!hostname) return true;
  if (hostname === 'localhost' || hostname === 'metadata.google.internal' || hostname === 'instance-data') return true;
  if (PRIVATE_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix))) return true;
  if (isPrivateIpv4(hostname) || (hostname.includes(':') && isPrivateIpv6(hostname))) return true;
  return false;
}

function validatePublicHttpUrl(input, { allowPath = true } = {}) {
  const raw = String(input || '').trim();
  if (!raw || raw.length > 2048) {
    throw new Error('A valid public website URL is required.');
  }

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('Invalid website URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS website URLs are allowed.');
  }
  if (url.username || url.password) {
    throw new Error('Website URLs may not contain credentials.');
  }
  if (url.port && !['80', '443'].includes(url.port)) {
    throw new Error('Website URLs may only use ports 80 or 443.');
  }
  if (isPrivateOrLocalHostname(url.hostname)) {
    throw new Error('Private and local network addresses are not allowed.');
  }
  if (!allowPath) {
    url.pathname = '/';
    url.search = '';
    url.hash = '';
  }
  return url;
}

async function assertPublicDns(hostname) {
  const normalized = stripIpv6Brackets(hostname);
  if (isPrivateOrLocalHostname(normalized)) {
    throw new Error('Private and local network addresses are not allowed.');
  }

  // Direct IPs were checked above. Resolve hostnames before fetching so a
  // public-looking hostname cannot point at a private or metadata address.
  if (/^[0-9a-f:.]+$/i.test(normalized)) return;
  if (typeof Deno?.resolveDns !== 'function') return;

  let addresses = [];
  for (const recordType of ['A', 'AAAA']) {
    try {
      const result = await Deno.resolveDns(normalized, recordType);
      addresses = addresses.concat(result || []);
    } catch {
      // A hostname may have only A or only AAAA records.
    }
  }

  if (!addresses.length) {
    throw new Error('The website hostname could not be resolved.');
  }
  if (addresses.some(address => isPrivateOrLocalHostname(address))) {
    throw new Error('The website resolves to a private or local network address.');
  }
}

async function fetchPublicUrl(input, init = {}, maxRedirects = 3) {
  let current = validatePublicHttpUrl(input);

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    await assertPublicDns(current.hostname);

    const response = await fetch(current, {
      ...init,
      redirect: 'manual',
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, url: current };
    }

    const location = response.headers.get('location');
    if (!location || redirectCount === maxRedirects) {
      throw new Error('The website redirected too many times or returned an invalid redirect.');
    }
    current = validatePublicHttpUrl(new URL(location, current).toString());
  }

  throw new Error('The website redirected too many times.');
}



const REQUEST_WINDOW_MS = 60 * 60 * 1000;
const REQUEST_LIMIT = 6;
const MAX_BODY_LENGTH = 12000;
const requestBuckets = new Map();

function requestClientIdentity(req: Request) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
  return 0;
}


Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    // Internal/legacy endpoint. Origin and Referer headers are not authentication.
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Administrator or service access required' }, { status: 403 });
    }

    const retryAfterSeconds = isRateLimited(req);
    if (retryAfterSeconds) {
      return Response.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      );
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return Response.json({ error: 'Request is too large' }, { status: 413 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!payload || Array.isArray(payload) || typeof payload !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const antiSpam = payload.anti_spam && typeof payload.anti_spam === 'object'
      ? payload.anti_spam
      : {};
    if (String(antiSpam.honeypot || '').trim()) {
      return Response.json({ success: true, accepted: false });
    }

    const { website_url, lead_email, lead_phone } = payload;

    if (!website_url) {
      return Response.json({ error: 'website_url required' }, { status: 400 });
    }

    let urlObj;
    try {
      urlObj = validatePublicHttpUrl(website_url);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const normalizedLeadEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(lead_email || '').trim())
      ? String(lead_email).trim()
      : null;
    const normalizedLeadPhone = String(lead_phone || '').trim().slice(0, 40) || null;

    // Perform a public-only accessibility scan with redirect validation.
    const auditResult = await performAccessibilityScan(urlObj.toString());

    // Create audit record
    const audit = await base44.asServiceRole.entities.WebsiteAudit.create({
      website_url: urlObj.toString(),
      audit_type: 'accessibility',
      accessibility_issues: auditResult.issues,
      compliance_score: auditResult.complianceScore,
      risk_level: auditResult.riskLevel,
      risk_score: auditResult.riskScore,
      wcag_level: auditResult.wcagLevel,
      color_contrast_issues: auditResult.colorContrastIssues,
      alt_text_issues: auditResult.altTextIssues,
      heading_structure_issues: auditResult.headingStructureIssues,
      keyboard_navigation_issues: auditResult.keyboardNavigationIssues,
      form_label_issues: auditResult.formLabelIssues,
      video_caption_issues: auditResult.videoCaptionIssues,
      recommended_actions: auditResult.recommendations,
      audit_report: auditResult.report,
      estimated_remediation_cost: auditResult.remediationCost,
      lawsuit_risk: auditResult.lawsuitRisk,
      lead_email: normalizedLeadEmail,
      lead_phone: normalizedLeadPhone,
      lead_source: 'ada-checker-tool',
      audit_date: new Date().toISOString(),
      // Public callers may not bind an audit to internal lead, profile, or
      // sales records. NTA staff can link records later from the back office.
      business_profile_id: null,
      lead_id: null,
      sales_lead_id: null,
    });

    return Response.json({
      success: true,
      result: {
        compliance_score: auditResult.complianceScore,
        risk_level: auditResult.riskLevel,
        wcag_level: auditResult.wcagLevel,
        issues_count: auditResult.issues.length,
        issues: auditResult.issues,
        recommendations: auditResult.recommendations,
        report: auditResult.report,
      },
    });
  } catch (error) {
    console.error('[auditWebsiteAccessibility] Error:', error);
    return Response.json({ error: 'Unable to complete the accessibility audit right now.' }, { status: 500 });
  }
});

async function performAccessibilityScan(url) {
  const issues = [];
  const recommendations = [];
  let complianceScore = 100;
  let riskScore = 0;
  let wcagLevel = 'AAA';

  try {
    // Fetch webpage
    const { response } = await fetchPublicUrl(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NTA-AuditBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        issues: ['Unable to access website'],
        complianceScore: 0,
        riskLevel: 'critical',
        riskScore: 100,
        wcagLevel: 'none',
        colorContrastIssues: false,
        altTextIssues: false,
        headingStructureIssues: false,
        keyboardNavigationIssues: false,
        formLabelIssues: false,
        videoCaptionIssues: false,
        recommendations: ['Ensure website is publicly accessible'],
        report: 'Website could not be accessed for scanning.',
        remediationCost: 'low',
        lawsuitRisk: 'Website accessibility cannot be verified.',
      };
    }

    const html = await response.text();

    // Check for common accessibility issues
    const hasLang = /<html[^>]*lang=/i.test(html);
    if (!hasLang) {
      issues.push('Missing language declaration');
      recommendations.push('Add lang attribute to HTML element');
      complianceScore -= 5;
      wcagLevel = 'A';
    }

    // Check for alt text
    const imgCount = (html.match(/<img/gi) || []).length;
    const imgAlt = (html.match(/<img[^>]*alt=/gi) || []).length;
    if (imgCount > 0 && imgAlt < imgCount * 0.7) {
      issues.push(`Missing alt text on ${imgCount - imgAlt} images (${Math.round((1 - imgAlt / imgCount) * 100)}%)`);
      recommendations.push('Add descriptive alt text to all images');
      complianceScore -= 15;
      riskScore += 20;
      wcagLevel = 'A';
    }

    // Check for heading structure
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count === 0) {
      issues.push('No H1 heading found');
      recommendations.push('Add exactly one H1 heading at the top of the page');
      complianceScore -= 10;
      wcagLevel = 'A';
    } else if (h1Count > 1) {
      issues.push(`Multiple H1 headings (${h1Count} found)`);
      recommendations.push('Use only one H1 heading per page');
      complianceScore -= 5;
    }

    // Check for form labels
    const formCount = (html.match(/<form[^>]*>/gi) || []).length;
    const labelCount = (html.match(/<label[^>]*>/gi) || []).length;
    if (formCount > 0) {
      if (labelCount < formCount) {
        issues.push('Form fields may be missing associated labels');
        recommendations.push('Add <label> elements for all form inputs');
        complianceScore -= 10;
        wcagLevel = 'A';
      }
    }

    // Check for color contrast (basic check)
    if (html.match(/color:\s*#[0-9a-f]{3,6}/gi) && html.match(/background.*#[0-9a-f]{3,6}/gi)) {
      issues.push('Potential color contrast issues detected');
      recommendations.push('Verify text and background colors meet WCAG AA standards (4.5:1 contrast ratio)');
      complianceScore -= 8;
      wcagLevel = 'AA';
    }

    // Check for meta viewport (responsive design)
    if (!html.includes('viewport')) {
      issues.push('Missing responsive design meta tag');
      recommendations.push('Add <meta name="viewport"> for mobile accessibility');
      complianceScore -= 5;
    }

    // Check for keyboard navigation indicators
    if (!html.includes(':focus') && !html.includes('focus-visible')) {
      issues.push('Potential keyboard navigation issues');
      recommendations.push('Ensure all interactive elements are keyboard accessible with visible focus indicators');
      complianceScore -= 10;
      wcagLevel = 'A';
    }

    // Check for video/media
    const videoCount = (html.match(/<video/gi) || []).length + (html.match(/<iframe[^>]*youtube/gi) || []).length;
    if (videoCount > 0) {
      issues.push('Video content detected - verify captions/transcripts are present');
      recommendations.push('Add captions to all videos and provide transcripts');
      complianceScore -= 5;
      wcagLevel = 'A';
    }

    // Check for ARIA landmarks
    if (!html.includes('role="main"') && !html.includes('<main')) {
      issues.push('Missing main content landmark');
      recommendations.push('Add <main> tag or role="main" to main content area');
      complianceScore -= 5;
    }

    // Determine risk level and lawsuit risk
    let riskLevel = 'low';
    let lawsuitRisk = 'This website appears to have moderate accessibility compliance.';

    if (complianceScore < 50) {
      riskLevel = 'critical';
      lawsuitRisk = 'HIGH RISK: Multiple accessibility violations could expose this business to ADA lawsuits. Immediate remediation recommended.';
      riskScore = 90;
    } else if (complianceScore < 70) {
      riskLevel = 'high';
      lawsuitRisk = 'SIGNIFICANT RISK: Several accessibility issues should be addressed to reduce lawsuit exposure.';
      riskScore = 65;
    } else if (complianceScore < 85) {
      riskLevel = 'medium';
      lawsuitRisk = 'MODERATE RISK: Some accessibility improvements needed to reach industry standards.';
      riskScore = 40;
    } else {
      riskLevel = 'low';
      lawsuitRisk = 'LOW RISK: Website appears to meet most accessibility standards, but ongoing monitoring recommended.';
      riskScore = 15;
    }

    const remediationCost = complianceScore < 70 ? 'high' : complianceScore < 85 ? 'medium' : 'low';

    const report = `
ADA Website Accessibility Audit Report
Generated: ${new Date().toISOString()}
Website: ${url}

Compliance Score: ${Math.max(0, complianceScore)}/100
WCAG Level: ${wcagLevel}
Risk Level: ${riskLevel.toUpperCase()}
Risk Score: ${riskScore}/100

Issues Found (${issues.length}):
${issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Recommended Actions:
${recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}

Lawsuit Risk Assessment:
${lawsuitRisk}

Next Steps:
1. Review this audit report
2. Prioritize high-impact fixes
3. Consider professional ADA website remediation
4. Implement accessibility improvements
5. Re-audit after changes
    `;

    return {
      issues,
      complianceScore: Math.max(0, complianceScore),
      riskLevel,
      riskScore,
      wcagLevel,
      colorContrastIssues: html.match(/color:\s*#[0-9a-f]{3,6}/gi) ? true : false,
      altTextIssues: imgCount > 0 && imgAlt < imgCount * 0.7,
      headingStructureIssues: h1Count !== 1,
      keyboardNavigationIssues: !html.includes(':focus'),
      formLabelIssues: formCount > 0 && labelCount < formCount,
      videoCaptionIssues: videoCount > 0,
      recommendations,
      report,
      remediationCost,
      lawsuitRisk,
    };
  } catch (err) {
    console.error('[performAccessibilityScan] Error:', err);
    return {
      issues: ['The website could not be scanned.'],
      complianceScore: 0,
      riskLevel: 'critical',
      riskScore: 100,
      wcagLevel: 'none',
      colorContrastIssues: false,
      altTextIssues: false,
      headingStructureIssues: false,
      keyboardNavigationIssues: false,
      formLabelIssues: false,
      videoCaptionIssues: false,
      recommendations: ['Unable to complete scan. Please verify website URL and try again.'],
      report: 'The accessibility audit could not be completed.',
      remediationCost: 'high',
      lawsuitRisk: 'Website could not be fully analyzed.',
    };
  }
}