import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const payload = await req.json();
    const { website_url, lead_email, lead_phone, business_profile_id, lead_id, sales_lead_id } = payload;

    if (!website_url) {
      return Response.json({ error: 'website_url required' }, { status: 400 });
    }

    // Validate URL
    let urlObj;
    try {
      urlObj = new URL(website_url.startsWith('http') ? website_url : `https://${website_url}`);
    } catch (err) {
      return Response.json({ error: 'Invalid website URL' }, { status: 400 });
    }

    // Perform basic accessibility scan
    const auditResult = await performAccessibilityScan(urlObj.toString());

    // Create audit record
    const audit = await base44.entities.WebsiteAudit.create({
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
      lead_email,
      lead_phone,
      lead_source: 'ada-checker-tool',
      audit_date: new Date().toISOString(),
      business_profile_id,
      lead_id: lead_id || null,
      sales_lead_id: sales_lead_id || null,
    });

    // If no lead_id was provided but we have an email, try to link to an existing SalesLead
    if (!lead_id && lead_email) {
      try {
        const matchingLeads = await base44.asServiceRole.entities.SalesLead.filter({ email: lead_email });
        if (matchingLeads.length > 0) {
          const foundLeadId = matchingLeads[0].id;
          await base44.asServiceRole.entities.WebsiteAudit.update(audit.id, {
            lead_id: foundLeadId,
            sales_lead_id: foundLeadId,
          });
          console.log(`[auditWebsiteAccessibility] Linked audit ${audit.id} to SalesLead ${foundLeadId} via email`);
        }
      } catch (linkErr) {
        console.warn('[auditWebsiteAccessibility] SalesLead email lookup failed (non-critical):', linkErr.message);
      }
    }

    return Response.json({
      success: true,
      audit_id: audit.id,
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
    return Response.json({ error: error.message }, { status: 500 });
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
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
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
    if (formCount > 0) {
      const labelCount = (html.match(/<label[^>]*>/gi) || []).length;
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
      issues: [`Error scanning website: ${err.message}`],
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
      report: `Audit failed: ${err.message}`,
      remediationCost: 'high',
      lawsuitRisk: 'Website could not be fully analyzed.',
    };
  }
}