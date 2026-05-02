import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Zap, Mail, UserCheck, Megaphone, ArrowLeft, RefreshCw,
  CheckCircle2, AlertCircle, Globe, Search, Smartphone, FileText,
  Shield, TrendingUp, Lightbulb, Package, Send, ChevronDown, ChevronUp
} from 'lucide-react';

const SECTIONS = [
  { key: 'first_impression', label: 'Website First Impression', icon: Globe, color: 'text-blue-400' },
  { key: 'seo_gaps', label: 'SEO Gaps', icon: Search, color: 'text-purple-400' },
  { key: 'conversion_gaps', label: 'Conversion Gaps', icon: TrendingUp, color: 'text-orange-400' },
  { key: 'mobile_ux', label: 'Mobile / UX Issues', icon: Smartphone, color: 'text-pink-400' },
  { key: 'content_gaps', label: 'Content Gaps', icon: FileText, color: 'text-sky-400' },
  { key: 'trust_proof', label: 'Trust / Proof Issues', icon: Shield, color: 'text-yellow-400' },
  { key: 'missed_revenue', label: 'Missed Revenue Opportunities', icon: TrendingUp, color: 'text-red-400' },
  { key: 'recommended_fixes', label: 'Recommended Fixes', icon: Lightbulb, color: 'text-emerald-400' },
  { key: 'lead_system_package', label: 'Suggested Lead System Package', icon: Package, color: 'text-violet-400' },
  { key: 'followup_email', label: 'Follow-Up Email Draft', icon: Mail, color: 'text-teal-400' },
];

function ScorePill({ label, value }) {
  if (!value && value !== 0) return null;
  const num = Number(value);
  const color = num >= 70 ? 'bg-emerald-900/40 text-emerald-300' : num >= 40 ? 'bg-yellow-900/40 text-yellow-300' : 'bg-red-900/40 text-red-300';
  return (
    <div className={`rounded-xl px-3 py-2 text-center ${color}`}>
      <p className="text-xl font-black">{num}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

function Section({ icon: Icon, label, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-white font-bold text-sm">{label}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function BulletList({ items, color = 'text-slate-300', bullet, bulletColor = 'text-slate-500' }) {
  if (!items?.length) return <p className="text-slate-600 text-sm italic">No data yet — generate the audit to populate this section.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <span className={`flex-shrink-0 mt-0.5 ${bulletColor}`}>{bullet || '→'}</span>
          <span className={color}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TextBlock({ text, placeholder }) {
  if (!text) return <p className="text-slate-600 text-sm italic">{placeholder || 'No data yet.'}</p>;
  return <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
}

export default function AgencyGapAuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [prospect, setProspect] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [converting, setConverting] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [toast, setToast] = useState('');
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [emailGenerated, setEmailGenerated] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const load = async () => {
    setLoading(true);
    const auditList = await base44.entities.GapAudit.filter({ id });
    const a = auditList[0];
    if (!a) { navigate('/agency/gap-audits'); return; }
    setAudit(a);
    if (a.prospect_id) {
      const ps = await base44.entities.Prospect.filter({ id: a.prospect_id });
      setProspect(ps[0] || null);
    }
    const clientList = await base44.entities.Client.list('-created_date', 100);
    setClients(clientList);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await base44.functions.invoke('ntaGenerateGapAudit', { audit_id: id });
    showToast('✓ Audit generated successfully!');
    setGenerating(false);
    load();
  };

  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    const businessName = prospect?.business_name || audit?.website_url || 'this business';
    const industry = prospect?.industry || 'service business';
    const name = prospect?.contact_name || 'there';
    const issues = audit?.issues_found?.slice(0, 3).join(', ') || 'website, SEO, and lead conversion';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a friendly, consultative follow-up email from Rick at NTA (New Tech Advertising) in North Iowa to ${name} at ${businessName} (${industry}).

Context: We just completed a free Gap Audit. Top issues found: ${issues}.

Email should:
- Be warm and personal, not salesy
- Reference 2-3 specific findings from the audit
- Offer to walk them through the findings on a quick call
- Have a clear CTA: "Schedule a Free 20-min Call"
- Sign off as Rick, NTA North Iowa
- Subject line included at the top as "Subject: [subject here]"
- Total length: 150-200 words`,
    });
    setFollowUpEmail(result);
    setEmailGenerated(true);
    setGeneratingEmail(false);
    showToast('✓ Follow-up email generated!');
  };

  const handleConvertToClient = async () => {
    if (!prospect) return;
    if (!confirm(`Convert ${prospect.business_name} to a Client?`)) return;
    setConverting(true);
    await base44.functions.invoke('ntaConvertProspectToClient', { prospect_id: prospect.id });
    showToast('✓ Converted to Client! Check the Clients module.');
    setConverting(false);
    load();
  };

  const handleCreateCampaign = async () => {
    if (!audit) return;
    setCreatingCampaign(true);
    // Find the converted client if exists
    const clientMatch = clients.find(c => c.business_name === prospect?.business_name);
    if (!clientMatch) {
      showToast('Convert to client first before creating a campaign.');
      setCreatingCampaign(false);
      return;
    }
    const camp = await base44.entities.Campaign.create({
      client_id: clientMatch.id,
      campaign_name: `${prospect?.business_name} — Lead System Launch`,
      season: 'year_round',
      service_focus: prospect?.industry || 'General Services',
      offer: 'Free Estimate',
      status: 'planning',
      notes: `Created from Gap Audit. Top issues: ${(audit.issues_found || []).slice(0, 3).join('; ')}`,
    });
    showToast('✓ Campaign created! Go to Campaigns to manage it.');
    setCreatingCampaign(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!audit) return null;

  // Build structured sections from audit data
  const sectionData = {
    first_impression: audit.summary ? [audit.summary] : [],
    seo_gaps: (audit.issues_found || []).filter(i => /seo|search|rank|google|keyword|page|site/i.test(i)),
    conversion_gaps: (audit.issues_found || []).filter(i => /cta|conver|form|call|lead|button|click/i.test(i)),
    mobile_ux: (audit.issues_found || []).filter(i => /mobile|ux|speed|slow|design|responsive/i.test(i)),
    content_gaps: (audit.issues_found || []).filter(i => /content|blog|video|post|social|copy|write/i.test(i)),
    trust_proof: (audit.issues_found || []).filter(i => /review|trust|proof|testimonial|credential|award/i.test(i)),
    missed_revenue: audit.missed_opportunities || [],
    recommended_fixes: audit.recommendations || [],
    lead_system_package: audit.recommendations?.slice(0, 3).map(r => `• ${r}`) || [],
    followup_email: null,
  };

  // Fallback: show all issues_found in first_impression if nothing else populated
  const allIssues = audit.issues_found || [];
  SECTIONS.forEach(s => {
    if (s.key !== 'first_impression' && s.key !== 'missed_revenue' && s.key !== 'recommended_fixes' && s.key !== 'lead_system_package' && s.key !== 'followup_email') {
      if (!sectionData[s.key]?.length && allIssues.length) {
        sectionData[s.key] = [];
      }
    }
  });

  const hasData = audit.status !== 'draft';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <button onClick={() => navigate('/agency/gap-audits')} className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Gap Audits
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">{prospect?.business_name || 'Gap Audit'}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {audit.website_url && (
                  <a href={audit.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                    <Globe className="w-3 h-3" />{audit.website_url}
                  </a>
                )}
                {prospect?.industry && <span className="text-slate-500 text-sm">{prospect.industry}</span>}
                {prospect?.city && <span className="text-slate-500 text-sm">{prospect.city}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  audit.status === 'completed' ? 'bg-blue-900/40 text-blue-300' :
                  audit.status === 'delivered' ? 'bg-emerald-900/40 text-emerald-300' :
                  'bg-slate-700 text-slate-400'
                }`}>{audit.status}</span>
              </div>
              {prospect && (
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                  {prospect.contact_name && <span>{prospect.contact_name}</span>}
                  {prospect.email && <span>{prospect.email}</span>}
                  {prospect.phone && <span>{prospect.phone}</span>}
                </div>
              )}
            </div>
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Scores */}
        {(audit.seo_score || audit.conversion_score || audit.mobile_score) && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <ScorePill label="SEO" value={audit.seo_score} />
            <ScorePill label="Conversion" value={audit.conversion_score} />
            <ScorePill label="Mobile" value={audit.mobile_score} />
            <ScorePill label="Content" value={audit.content_score} />
            <ScorePill label="Speed" value={audit.speed_score} />
            <ScorePill label="Trust" value={audit.trust_score} />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl disabled:opacity-50 transition-colors">
            {generating ? <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating…</> : <><Zap className="w-3.5 h-3.5" /> Generate Audit</>}
          </button>
          <button onClick={handleGenerateEmail} disabled={generatingEmail}
            className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl disabled:opacity-50 transition-colors">
            {generatingEmail ? <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating…</> : <><Mail className="w-3.5 h-3.5" /> Follow-Up Email</>}
          </button>
          <button onClick={handleConvertToClient} disabled={converting || !prospect || audit.status === 'draft'}
            className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl disabled:opacity-50 transition-colors">
            {converting ? <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Converting…</> : <><UserCheck className="w-3.5 h-3.5" /> Convert to Client</>}
          </button>
          <button onClick={handleCreateCampaign} disabled={creatingCampaign || audit.status === 'draft'}
            className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl disabled:opacity-50 transition-colors">
            {creatingCampaign ? <><span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Creating…</> : <><Megaphone className="w-3.5 h-3.5" /> Create Campaign</>}
          </button>
        </div>

        {!hasData && (
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-2xl px-5 py-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-semibold text-sm">Audit not generated yet</p>
              <p className="text-amber-400/70 text-xs mt-0.5">Click "Generate Audit" above to run the AI analysis. Requires a website URL.</p>
            </div>
          </div>
        )}

        {/* All 10 sections */}
        <div className="space-y-3">

          <Section icon={SECTIONS[0].icon} label={SECTIONS[0].label} color={SECTIONS[0].color}>
            {audit.summary ? (
              <p className="text-slate-300 text-sm leading-relaxed">{audit.summary}</p>
            ) : (
              <p className="text-slate-600 text-sm italic">Generate the audit to see the first impression analysis.</p>
            )}
          </Section>

          <Section icon={SECTIONS[1].icon} label={SECTIONS[1].label} color={SECTIONS[1].color} defaultOpen={false}>
            <BulletList
              items={sectionData.seo_gaps.length ? sectionData.seo_gaps : hasData ? allIssues.filter((_, i) => i < 2) : []}
              bulletColor="text-purple-400" bullet="✗"
              color="text-slate-300"
            />
          </Section>

          <Section icon={SECTIONS[2].icon} label={SECTIONS[2].label} color={SECTIONS[2].color} defaultOpen={false}>
            <BulletList
              items={sectionData.conversion_gaps.length ? sectionData.conversion_gaps : hasData ? allIssues.filter((_, i) => i >= 2 && i < 4) : []}
              bulletColor="text-orange-400" bullet="✗"
              color="text-slate-300"
            />
          </Section>

          <Section icon={SECTIONS[3].icon} label={SECTIONS[3].label} color={SECTIONS[3].color} defaultOpen={false}>
            <BulletList
              items={sectionData.mobile_ux.length ? sectionData.mobile_ux : hasData ? allIssues.filter((_, i) => i >= 4) : []}
              bulletColor="text-pink-400" bullet="✗"
              color="text-slate-300"
            />
          </Section>

          <Section icon={SECTIONS[4].icon} label={SECTIONS[4].label} color={SECTIONS[4].color} defaultOpen={false}>
            <BulletList
              items={sectionData.content_gaps.length ? sectionData.content_gaps : hasData ? allIssues.slice(0, 2) : []}
              bulletColor="text-sky-400" bullet="✗"
              color="text-slate-300"
            />
          </Section>

          <Section icon={SECTIONS[5].icon} label={SECTIONS[5].label} color={SECTIONS[5].color} defaultOpen={false}>
            <BulletList
              items={sectionData.trust_proof.length ? sectionData.trust_proof : hasData ? allIssues.slice(0, 2) : []}
              bulletColor="text-yellow-400" bullet="✗"
              color="text-slate-300"
            />
          </Section>

          <Section icon={SECTIONS[6].icon} label={SECTIONS[6].label} color={SECTIONS[6].color}>
            <BulletList
              items={sectionData.missed_revenue}
              bulletColor="text-red-400" bullet="$"
              color="text-red-300"
            />
          </Section>

          <Section icon={SECTIONS[7].icon} label={SECTIONS[7].label} color={SECTIONS[7].color}>
            <BulletList
              items={sectionData.recommended_fixes}
              bulletColor="text-emerald-400" bullet="✓"
              color="text-emerald-200"
            />
          </Section>

          <Section icon={SECTIONS[8].icon} label={SECTIONS[8].label} color={SECTIONS[8].color} defaultOpen={false}>
            {hasData ? (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">Based on the audit findings, the recommended NTA package for this business:</p>
                <div className="bg-slate-800 rounded-xl px-4 py-4 space-y-2">
                  {(audit.recommendations || []).slice(0, 5).map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-slate-300">{r}</span>
                    </div>
                  ))}
                  {!audit.recommendations?.length && <p className="text-slate-600 text-sm italic">Generate audit to see package suggestion.</p>}
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-sm italic">Generate the audit first.</p>
            )}
          </Section>

          <Section icon={SECTIONS[9].icon} label={SECTIONS[9].label} color={SECTIONS[9].color}>
            {emailGenerated && followUpEmail ? (
              <div className="space-y-3">
                <div className="bg-slate-800 rounded-xl p-4">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{followUpEmail}</pre>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(followUpEmail); showToast('Email copied to clipboard!'); }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
                  Copy to Clipboard
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-500 text-sm">Click "Follow-Up Email" above to generate a personalized email draft for this prospect.</p>
                {!hasData && <p className="text-slate-600 text-xs">Generate the audit first for better email context.</p>}
              </div>
            )}
          </Section>

        </div>
      </div>
    </div>
  );
}