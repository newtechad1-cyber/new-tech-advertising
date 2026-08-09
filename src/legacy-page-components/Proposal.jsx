import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { CheckCircle, AlertCircle, Clock, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const SERVICE_LABELS = {
  diy_saas: 'DIY Social Media Platform',
  dfy_managed: 'Done-For-You Managed Marketing',
  ada_rebuild: 'ADA Compliance / Website Rebuild',
  streaming_tv: 'Streaming TV Advertising',
  video_production: 'Video Production',
  other: 'Custom Services',
};

function StatusBadge({ status }) {
  const map = {
    draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600' },
    sent: { label: 'Awaiting Your Review', cls: 'bg-blue-100 text-blue-700' },
    viewed: { label: 'Viewed', cls: 'bg-violet-100 text-violet-700' },
    accepted: { label: 'Accepted ✓', cls: 'bg-green-100 text-green-700' },
    rejected: { label: 'Declined', cls: 'bg-red-100 text-red-700' },
    expired: { label: 'Expired', cls: 'bg-amber-100 text-amber-700' },
  };
  const s = map[status] || map.draft;
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

export default function Proposal() {
  const [proposal, setProposal] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const proposalId = urlParams.get('id');

  useEffect(() => {
    if (!proposalId) { setNotFound(true); setLoading(false); return; }
    loadProposal();
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      const proposals = await base44.entities.NtaProposal.filter({ id: proposalId });
      if (!proposals.length) { setNotFound(true); return; }
      const p = proposals[0];
      setProposal(p);
      if (p.status === 'accepted') setAccepted(true);

      // Mark as viewed if sent
      if (p.status === 'sent') {
        await base44.entities.NtaProposal.update(p.id, { status: 'viewed' });
        setProposal({ ...p, status: 'viewed' });
      }

      // Load company for display
      if (p.company_id) {
        const companies = await base44.entities.Company.filter({ id: p.company_id });
        if (companies.length) setCompany(companies[0]);
      }
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!signerName.trim() || !agreed) return;
    setAccepting(true);
    try {
      await base44.entities.NtaProposal.update(proposal.id, {
        status: 'accepted',
        signer_name: signerName,
        signed_at: new Date().toISOString().split('T')[0],
        accepted_at: new Date().toISOString(),
      });

      // Log activity
      await base44.entities.ActivityLog.create({
        company_id: proposal.company_id,
        event_type: 'proposal_accepted',
        summary: `Proposal "${proposal.title}" accepted by ${signerName}`,
        entity_type: 'NtaProposal',
        entity_id: proposal.id,
      });

      // Notify team
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — Proposal Accepted',
        to: 'rick@newtechadvertising.com',
        subject: `Proposal Accepted: ${proposal.title}`,
        body: `Proposal "${proposal.title}" has been accepted.\nSigned by: ${signerName}\nCompany: ${company?.business_name || proposal.company_id}\nDate: ${new Date().toLocaleDateString()}`,
      });

      setAccepted(true);
      setProposal({ ...proposal, status: 'accepted' });
      toast.success('Proposal accepted! We\'ll be in touch shortly.');
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500">Loading proposal…</div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">Proposal Not Found</h1>
        <p className="text-slate-600 mb-6">This link may be invalid or expired. Please contact us for help.</p>
        <a href="tel:6414208816" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
          <Phone className="w-4 h-4" /> 641-420-8816
        </a>
      </div>
    </div>
  );

  const hasDeposit = proposal.deposit_amount && proposal.deposit_payment_link;
  const isActive = !['accepted', 'rejected', 'expired'].includes(proposal.status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <img src={LOGO_URL} alt="NTA" className="h-8 w-auto" />
          <a href="tel:6414208816" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> 641-420-8816
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Title block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Proposal for {company?.business_name || 'Your Business'}</p>
              <h1 className="text-2xl font-extrabold text-slate-900">{proposal.title}</h1>
            </div>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Prepared {new Date(proposal.created_date).toLocaleDateString()}</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{SERVICE_LABELS[proposal.service_type] || proposal.service_type}</span>
          </div>
        </div>

        {/* Scope Summary */}
        {proposal.scope_summary && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Scope of Work</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{proposal.scope_summary}</p>
          </div>
        )}

        {/* Investment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Investment</h2>
          <div className="space-y-3">
            {proposal.one_time_fee > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-700">One-time setup fee</span>
                <span className="text-xl font-bold text-slate-900">${proposal.one_time_fee?.toLocaleString()}</span>
              </div>
            )}
            {proposal.monthly_fee > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-700">Monthly fee</span>
                <span className="text-xl font-bold text-slate-900">${proposal.monthly_fee?.toLocaleString()}<span className="text-sm font-normal text-slate-500">/mo</span></span>
              </div>
            )}
            {hasDeposit && (
              <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3 mt-2">
                <span className="text-blue-800 font-semibold">Deposit to begin</span>
                <span className="text-xl font-bold text-blue-900">${proposal.deposit_amount?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {proposal.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">Notes</h2>
            <p className="text-amber-900 text-sm leading-relaxed">{proposal.notes}</p>
          </div>
        )}

        {/* Accept Section */}
        {!accepted && isActive && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Accept This Proposal</h2>
            <p className="text-slate-500 text-sm mb-6">By signing below, you agree to the scope and terms outlined in this proposal.</p>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-700 mb-1.5">Your Full Name (signature) *</Label>
                <Input value={signerName} onChange={e => setSignerName(e.target.value)} placeholder="Jane Smith" className="max-w-sm" />
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox id="agree" checked={agreed} onCheckedChange={setAgreed} />
                <label htmlFor="agree" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                  I agree to the scope, pricing, and terms outlined in this proposal. I understand that a deposit is required to begin work.
                </label>
              </div>

              <Button
                onClick={handleAccept}
                disabled={!signerName.trim() || !agreed || accepting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 h-auto text-base rounded-xl"
              >
                {accepting ? 'Processing…' : 'Accept Proposal & Proceed'}
              </Button>
            </div>
          </div>
        )}

        {/* Accepted — show deposit button */}
        {accepted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-green-900 mb-2">Proposal Accepted!</h2>
            <p className="text-green-700 mb-6">
              {proposal.signer_name || signerName} has signed off. {hasDeposit ? 'Pay the deposit below to begin.' : 'We\'ll be in touch within 1 business day to get started.'}
            </p>
            {hasDeposit && (
              <a
                href={proposal.deposit_payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
              >
                Pay ${proposal.deposit_amount?.toLocaleString()} Deposit <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Footer contact */}
        <div className="text-center py-4 text-sm text-slate-500">
          Questions? <a href="tel:6414208816" className="text-blue-600 font-semibold">641-420-8816</a>
          {' '}or{' '}
          <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 font-semibold">rick@newtechadvertising.com</a>
        </div>
      </div>
    </div>
  );
}