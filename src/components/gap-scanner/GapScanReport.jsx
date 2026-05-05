import React, { useState } from 'react';
import { Copy, Check, Download, FileText, File } from 'lucide-react';

const today = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function buildFullReport(audit, form) {
  const doingWell = (audit.doing_well || []).map(x => `  • ${x}`).join('\n');
  const fixes = (audit.recommended_fixes || []).map((x, i) => `  ${i + 1}. ${x}`).join('\n');
  const wins = (audit.quick_wins || []).map(x => `  • ${x}`).join('\n');

  return `AI Gap Audit for ${form.businessName}
${'='.repeat(50)}

Prepared by:
Rick Hesse
New Tech Advertising
Phone/Text: 641-420-8816

Website Reviewed: ${form.websiteUrl}
Date: ${today()}

─────────────────────────────────────
QUICK SUMMARY
─────────────────────────────────────
${audit.quick_summary}

─────────────────────────────────────
WHAT YOU'RE DOING WELL
─────────────────────────────────────
${doingWell}

─────────────────────────────────────
TOP 3 GAPS COSTING YOU LEADS
─────────────────────────────────────
1. ${audit.gap_1}
   Why it matters: ${audit.gap_1_why}

2. ${audit.gap_2}
   Why it matters: ${audit.gap_2_why}

3. ${audit.gap_3}
   Why it matters: ${audit.gap_3_why}

─────────────────────────────────────
WHAT THIS MAY BE COSTING YOU
─────────────────────────────────────
${audit.costing_them}

─────────────────────────────────────
RECOMMENDED FIXES
─────────────────────────────────────
${fixes}

─────────────────────────────────────
QUICK WINS (DO THESE FIRST)
─────────────────────────────────────
${wins}

─────────────────────────────────────
SUGGESTED NEXT STEP
─────────────────────────────────────
${audit.suggested_next_step}

─────────────────────────────────────
INTERNAL NOTES (FOR RICK ONLY)
─────────────────────────────────────
${audit.internal_notes}
`;
}

function buildProspectVersion(audit, form) {
  const doingWell = (audit.doing_well || []).map(x => `• ${x}`).join('\n');
  const fixes = (audit.recommended_fixes || []).map((x, i) => `${i + 1}. ${x}`).join('\n');
  const wins = (audit.quick_wins || []).map(x => `• ${x}`).join('\n');

  return `Hi${form.contactName ? ' ' + form.contactName : ''},

I took a look at your website (${form.websiteUrl}) and put together a quick audit.

Here's what I found:

What you're doing well:
${doingWell}

The 3 biggest gaps I spotted:
1. ${audit.gap_1} — ${audit.gap_1_why}
2. ${audit.gap_2} — ${audit.gap_2_why}
3. ${audit.gap_3} — ${audit.gap_3_why}

${audit.costing_them}

Quick wins I'd recommend starting with:
${wins}

${audit.suggested_next_step}

Let me know if you'd like to talk through this.

— Rick Hesse
New Tech Advertising | 641-420-8816`;
}

function buildEmailIntro(audit, form) {
  return `Hi${form.contactName ? ' ' + form.contactName : ''},

I ran a quick audit on ${form.businessName}'s website and wanted to share what I found.

The short version: ${audit.quick_summary}

The biggest gap I spotted was: ${audit.gap_1} — ${audit.gap_1_why}

I put together a full report with specific recommendations. Would you have 15 minutes this week to go over it?

— Rick Hesse
New Tech Advertising | 641-420-8816`;
}

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-emerald-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function ScoreBar({ label, value }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function GapScanReport({ audit, form, websiteAccessible, onSaveToLead }) {
  const fullReport = buildFullReport(audit, form);
  const prospectVersion = buildProspectVersion(audit, form);
  const emailIntro = buildEmailIntro(audit, form);
  const top3 = `Top 3 Gaps for ${form.businessName}:\n1. ${audit.gap_1}\n2. ${audit.gap_2}\n3. ${audit.gap_3}`;
  const fixes = (audit.recommended_fixes || []).map((x, i) => `${i + 1}. ${x}`).join('\n');
  const shortSummary = `${form.businessName} Gap Audit Summary:\n${audit.quick_summary}\n\nTop gap: ${audit.gap_1}`;

  const downloadTxt = () => {
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Gap-Audit-${form.businessName.replace(/\s+/g, '-')}.txt`;
    a.click();
  };

  const downloadRtf = () => {
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f0\\fs24
{\\b\\fs32 AI Gap Audit for ${form.businessName}}\\line
\\line
{\\b Prepared by:}\\line
Rick Hesse\\line
New Tech Advertising\\line
Phone/Text: 641-420-8816\\line
\\line
{\\b Website Reviewed:} ${form.websiteUrl}\\line
{\\b Date:} ${today()}\\line
\\line
{\\b\\fs26 QUICK SUMMARY}\\line
${audit.quick_summary}\\line
\\line
{\\b\\fs26 WHAT YOU'RE DOING WELL}\\line
${(audit.doing_well || []).map(x => `\\bullet  ${x}\\line`).join('')}
\\line
{\\b\\fs26 TOP 3 GAPS COSTING YOU LEADS}\\line
\\line
{\\b 1. ${audit.gap_1}}\\line
Why it matters: ${audit.gap_1_why}\\line
\\line
{\\b 2. ${audit.gap_2}}\\line
Why it matters: ${audit.gap_2_why}\\line
\\line
{\\b 3. ${audit.gap_3}}\\line
Why it matters: ${audit.gap_3_why}\\line
\\line
{\\b\\fs26 WHAT THIS MAY BE COSTING YOU}\\line
${audit.costing_them}\\line
\\line
{\\b\\fs26 RECOMMENDED FIXES}\\line
${(audit.recommended_fixes || []).map((x, i) => `${i + 1}. ${x}\\line`).join('')}
\\line
{\\b\\fs26 QUICK WINS}\\line
${(audit.quick_wins || []).map(x => `\\bullet  ${x}\\line`).join('')}
\\line
{\\b\\fs26 SUGGESTED NEXT STEP}\\line
${audit.suggested_next_step}\\line
}`;
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Gap-Audit-${form.businessName.replace(/\s+/g, '-')}.rtf`;
    a.click();
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const margin = 15;
    const lineH = 7;
    const pageW = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 20;

    const checkPage = (needed = lineH * 2) => {
      if (y + needed > 270) { doc.addPage(); y = 20; }
    };

    const line = (text, bold = false, size = 11, color = [30, 30, 30]) => {
      checkPage();
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, pageW);
      doc.text(lines, margin, y);
      y += lines.length * lineH;
    };

    const section = (title) => {
      checkPage(lineH * 3);
      y += 4;
      doc.setFillColor(30, 58, 138);
      doc.rect(margin, y - 5, pageW, lineH + 2, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin + 3, y + 1);
      y += lineH + 4;
    };

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`AI Gap Audit: ${form.businessName}`, margin, 18);
    y = 40;

    line(`Prepared by: Rick Hesse — New Tech Advertising — 641-420-8816`, true, 10, [100, 100, 100]);
    line(`Website: ${form.websiteUrl}   |   Date: ${today()}`, false, 10, [100, 100, 100]);
    y += 4;

    section('QUICK SUMMARY');
    line(audit.quick_summary);

    section("WHAT YOU'RE DOING WELL");
    (audit.doing_well || []).forEach(x => line(`• ${x}`));

    section('TOP 3 GAPS COSTING YOU LEADS');
    line(`1. ${audit.gap_1}`, true);
    line(`Why it matters: ${audit.gap_1_why}`);
    y += 3;
    line(`2. ${audit.gap_2}`, true);
    line(`Why it matters: ${audit.gap_2_why}`);
    y += 3;
    line(`3. ${audit.gap_3}`, true);
    line(`Why it matters: ${audit.gap_3_why}`);

    section('WHAT THIS MAY BE COSTING YOU');
    line(audit.costing_them);

    section('RECOMMENDED FIXES');
    (audit.recommended_fixes || []).forEach((x, i) => line(`${i + 1}. ${x}`));

    section('QUICK WINS (DO THESE FIRST)');
    (audit.quick_wins || []).forEach(x => line(`• ${x}`));

    section('SUGGESTED NEXT STEP');
    line(audit.suggested_next_step);

    doc.save(`Gap-Audit-${form.businessName.replace(/\s+/g, '-')}.pdf`);
  };

  const score = audit.score || {};
  const categories = audit.categories || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/40 rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">AI Gap Audit: {form.businessName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{form.websiteUrl} · {today()}</p>
            {!websiteAccessible && (
              <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                ⚠ Website couldn't be accessed directly — analysis based on business info & URL
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-white">{score.overall || '—'}</p>
            <p className="text-xs text-slate-500">Overall Score</p>
          </div>
        </div>
      </div>

      {/* Scores */}
      {score.overall && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ScoreBar label="Lead Generation" value={score.lead_generation} />
          <ScoreBar label="Local Visibility" value={score.local_visibility} />
          <ScoreBar label="Trust" value={score.trust} />
          <ScoreBar label="Conversion" value={score.conversion} />
        </div>
      )}

      {/* Copy Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Copy Options</p>
        <div className="flex flex-wrap gap-2">
          <CopyBtn text={fullReport} label="Full Report" />
          <CopyBtn text={prospectVersion} label="Prospect Version" />
          <CopyBtn text={shortSummary} label="Short Summary" />
          <CopyBtn text={top3} label="Top 3 Gaps" />
          <CopyBtn text={emailIntro} label="Email Intro" />
          <CopyBtn text={fixes} label="Recommended Fixes" />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Export</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadPdf}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 transition-colors">
            <Download className="w-3 h-3" /> Download PDF
          </button>
          <button onClick={downloadRtf}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 transition-colors">
            <File className="w-3 h-3" /> Download Word (.rtf)
          </button>
          <button onClick={downloadTxt}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
            <FileText className="w-3 h-3" /> Download TXT
          </button>
        </div>
      </div>

      {/* Report Sections */}
      <ReportSection title="Quick Summary">
        <p className="text-sm text-slate-300 leading-relaxed">{audit.quick_summary}</p>
      </ReportSection>

      <ReportSection title="What You're Doing Well" color="emerald">
        <ul className="space-y-1.5">
          {(audit.doing_well || []).map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{x}
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title="Top 3 Gaps Costing You Leads" color="red">
        <div className="space-y-4">
          {[
            [audit.gap_1, audit.gap_1_why],
            [audit.gap_2, audit.gap_2_why],
            [audit.gap_3, audit.gap_3_why],
          ].map(([gap, why], i) => (
            <div key={i} className="bg-slate-800/60 rounded-xl p-3">
              <p className="text-sm font-bold text-white">{i + 1}. {gap}</p>
              <p className="text-xs text-slate-400 mt-1"><span className="text-slate-500">Why it matters: </span>{why}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title="What This May Be Costing You" color="amber">
        <p className="text-sm text-slate-300 leading-relaxed">{audit.costing_them}</p>
      </ReportSection>

      <ReportSection title="Recommended Fixes">
        <ol className="space-y-1.5">
          {(audit.recommended_fixes || []).map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-blue-400 font-bold flex-shrink-0">{i + 1}.</span>{x}
            </li>
          ))}
        </ol>
      </ReportSection>

      <ReportSection title="Quick Wins (Do These First)" color="violet">
        <ul className="space-y-1.5">
          {(audit.quick_wins || []).map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-violet-400 flex-shrink-0">→</span>{x}
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title="Suggested Next Step">
        <p className="text-sm text-slate-300 leading-relaxed">{audit.suggested_next_step}</p>
      </ReportSection>

      {/* Category breakdown */}
      {Object.keys(categories).length > 0 && (
        <ReportSection title="Category Breakdown">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(categories).map(([key, val]) => (
              <div key={key} className="bg-slate-800/60 rounded-lg px-3 py-2">
                <p className="text-xs font-bold text-slate-400 capitalize mb-0.5">{key.replace(/_/g, ' ')}</p>
                <p className="text-xs text-slate-300">{val}</p>
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Internal notes */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Internal Notes (Rick Only)</p>
        <p className="text-sm text-amber-200/80 leading-relaxed">{audit.internal_notes}</p>
      </div>

      {/* Save to Lead CTA */}
      {onSaveToLead && (
        <div className="pt-2">
          {onSaveToLead}
        </div>
      )}
    </div>
  );
}

function ReportSection({ title, children, color = 'blue' }) {
  const headerColors = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${headerColors[color] || headerColors.blue}`}>{title}</p>
      {children}
    </div>
  );
}