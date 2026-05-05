import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Save, UserPlus, Search, RefreshCw } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import GapScanForm from '../components/gap-scanner/GapScanForm';
import GapScanReport from '../components/gap-scanner/GapScanReport';

export default function AiGapScanner() {
  const [audit, setAudit] = useState(null);
  const [form, setForm] = useState(null);
  const [websiteAccessible, setWebsiteAccessible] = useState(true);
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [createNew, setCreateNew] = useState(false);

  useEffect(() => {
    base44.entities.SalesLead.list('-created_date', 200).then(setLeads);
  }, []);

  const handleResult = (auditData, formData, accessible) => {
    setAudit(auditData);
    setForm(formData);
    setWebsiteAccessible(accessible);
    setSaved(false);
    setShowAttach(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveToLead = async (leadId) => {
    if (!leadId || !audit) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const fullText = buildFullText(audit, form);
    await base44.entities.SalesLead.update(leadId, {
      audit_gap1: audit.gap_1 || '',
      audit_gap2: audit.gap_2 || '',
      audit_gap3: audit.gap_3 || '',
      audit_cost_to_them: audit.costing_them || '',
      audit_recommended_fix: (audit.recommended_fixes || []).join('\n'),
      audit_notes: audit.internal_notes || '',
      audit_status: 'sent',
      audit_sent_date: today,
      internal_notes: fullText,
    });
    setSaving(false);
    setSaved(true);
  };

  const createLeadFromScan = async () => {
    if (!form || !audit) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const fullText = buildFullText(audit, form);
    const lead = await base44.entities.SalesLead.create({
      business_name: form.businessName,
      website: form.websiteUrl,
      industry: form.industry || '',
      city: form.city ? form.city.split(',')[0].trim() : '',
      state: form.city ? (form.city.split(',')[1] || '').trim() : '',
      contact_name: form.contactName || '',
      lead_source: form.leadSource || 'manual',
      notes: form.notes || '',
      audit_gap1: audit.gap_1 || '',
      audit_gap2: audit.gap_2 || '',
      audit_gap3: audit.gap_3 || '',
      audit_cost_to_them: audit.costing_them || '',
      audit_recommended_fix: (audit.recommended_fixes || []).join('\n'),
      audit_notes: audit.internal_notes || '',
      audit_status: 'sent',
      audit_sent_date: today,
      internal_notes: fullText,
      status: 'new',
    });
    setSaving(false);
    setSaved(true);
    alert(`Lead created: ${form.businessName}`);
  };

  const SaveToLeadUI = (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Save Audit to Lead</p>
      {saved && (
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg px-3 py-2 text-sm text-emerald-300">
          ✅ Audit saved successfully!
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setShowAttach(!showAttach)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg">
          <Save className="w-3.5 h-3.5" /> Attach to Existing Lead
        </button>
        <button onClick={() => { setCreateNew(true); createLeadFromScan(); }}
          disabled={saving || saved}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
          <UserPlus className="w-3.5 h-3.5" /> {saving ? 'Creating...' : 'Create New Lead'}
        </button>
      </div>
      {showAttach && (
        <div className="flex gap-2 items-center">
          <select value={selectedLeadId} onChange={e => setSelectedLeadId(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="">Select a lead...</option>
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.business_name}</option>
            ))}
          </select>
          <button onClick={() => saveToLead(selectedLeadId)} disabled={!selectedLeadId || saving}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AgencyLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Gap Scanner</h1>
            <p className="text-slate-500 text-sm">Generate a prospect-ready audit report from any website URL</p>
          </div>
          {audit && (
            <button onClick={() => { setAudit(null); setForm(null); setSaved(false); }}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5" /> New Scan
            </button>
          )}
        </div>

        {!audit ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <GapScanForm onResult={handleResult} />
          </div>
        ) : (
          <GapScanReport
            audit={audit}
            form={form}
            websiteAccessible={websiteAccessible}
            onSaveToLead={SaveToLeadUI}
          />
        )}
      </div>
    </AgencyLayout>
  );
}

function buildFullText(audit, form) {
  return `AI GAP AUDIT — ${form.businessName}
Website: ${form.websiteUrl}
Date: ${new Date().toLocaleDateString()}

SUMMARY: ${audit.quick_summary}

GAP 1: ${audit.gap_1} — ${audit.gap_1_why}
GAP 2: ${audit.gap_2} — ${audit.gap_2_why}
GAP 3: ${audit.gap_3} — ${audit.gap_3_why}

COSTING THEM: ${audit.costing_them}

FIXES: ${(audit.recommended_fixes || []).join(' | ')}

INTERNAL NOTES: ${audit.internal_notes}`;
}