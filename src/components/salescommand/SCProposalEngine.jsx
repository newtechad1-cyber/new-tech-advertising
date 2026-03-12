import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, X, Eye, Clock, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_CONFIG = {
  draft: { badge: 'bg-slate-700 text-slate-300', icon: FileText },
  sent: { badge: 'bg-blue-950 text-blue-300', icon: FileText },
  viewed: { badge: 'bg-violet-950 text-violet-300', icon: Eye },
  negotiating: { badge: 'bg-amber-950 text-amber-300', icon: Zap },
  accepted: { badge: 'bg-emerald-950 text-emerald-300', icon: CheckCircle2 },
  expired: { badge: 'bg-red-950 text-red-300', icon: Clock },
};

const PACKAGES = [
  { key: 'starter', label: 'Starter', price: 997, mrr: 997, setup: 997 },
  { key: 'growth', label: 'Growth', price: 1497, mrr: 1497, setup: 1497 },
  { key: 'professional', label: 'Professional', price: 2497, mrr: 2497, setup: 2497 },
  { key: 'enterprise', label: 'Enterprise', price: 3997, mrr: 3997, setup: 4997 },
];

const ADDONS = ['AI Video (×2/mo)', 'Streaming TV Ad', 'Reputation Management', 'Social Media', 'Authority Blog Pack'];

const GenerateModal = ({ onClose, onSave }) => {
  const [pkg, setPkg] = useState('growth');
  const [addons, setAddons] = useState([]);
  const [company, setCompany] = useState('');
  const [discount, setDiscount] = useState(0);

  const selectedPkg = PACKAGES.find(p => p.key === pkg);
  const addonValue = addons.length * 299;
  const finalMRR = Math.round((selectedPkg?.mrr || 0) + addonValue - ((selectedPkg?.mrr || 0) * discount / 100));
  const roi = Math.round(finalMRR * 4.8);

  const handleSave = async () => {
    if (!company) return;
    await base44.entities.SalesProposal.create({
      company_name: company,
      package_type: pkg,
      base_price: finalMRR,
      expected_mrr: finalMRR,
      setup_fee: selectedPkg?.setup || 0,
      addons: addons.join(', '),
      roi_projection: `Estimated $${roi.toLocaleString()}/mo client revenue impact`,
      status: 'draft',
    }).catch(() => {});
    onSave?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 bg-slate-900 border-slate-700 w-full max-w-lg shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" /> Generate Smart Proposal</CardTitle>
            <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Company Name</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Arctic Air HVAC"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Package Selection</label>
            <div className="grid grid-cols-2 gap-2">
              {PACKAGES.map(p => (
                <button key={p.key} onClick={() => setPkg(p.key)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${pkg === p.key ? 'border-violet-500 bg-violet-950/30' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                  <p className="text-xs font-semibold text-white">{p.label}</p>
                  <p className="text-[10px] text-emerald-300">${p.mrr.toLocaleString()}/mo</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Add-ons</label>
            <div className="flex flex-wrap gap-1.5">
              {ADDONS.map(a => (
                <button key={a} onClick={() => setAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                  className={`text-[10px] px-2 py-1 rounded-full border transition-all ${addons.includes(a) ? 'border-violet-500 bg-violet-950/30 text-violet-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Discount: {discount}%</label>
            <input type="range" min={0} max={30} value={discount} onChange={e => setDiscount(+e.target.value)}
              className="w-full accent-violet-500" />
          </div>

          {/* ROI preview */}
          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">ROI Projection Preview</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-500">MRR</p>
                <p className="font-bold text-emerald-300">${finalMRR.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Setup</p>
                <p className="font-bold text-blue-300">${(selectedPkg?.setup || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Client ROI Est.</p>
                <p className="font-bold text-violet-300">${roi.toLocaleString()}/mo</p>
              </div>
            </div>
          </div>

          <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={handleSave}>
            <FileText className="w-4 h-4 mr-2" /> Create Proposal Draft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function SCProposalEngine({ proposals = [], onRefresh }) {
  const [showGenerate, setShowGenerate] = useState(false);

  const grouped = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = proposals.filter(p => p.status === s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Proposal & Offer Engine</h2>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-xs gap-1"
          onClick={() => setShowGenerate(true)}>
          <Zap className="w-3 h-3" /> Generate Smart Proposal
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const StatusIcon = cfg.icon;
          const list = grouped[status] || [];
          const value = list.reduce((s, p) => s + (p.expected_mrr || 0), 0);
          return (
            <Card key={status} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <StatusIcon className="w-3.5 h-3.5 text-slate-400" />
                  <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{status}</Badge>
                </div>
                <p className="text-2xl font-bold text-white">{list.length}</p>
                {value > 0 && <p className="text-[10px] text-emerald-300 mt-0.5">${(value / 1000).toFixed(0)}k MRR</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Proposal list */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Active Proposals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {proposals.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6">No proposals yet — generate your first one above</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {proposals.slice(0, 10).map((p, i) => {
                const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
                const StatusIcon = cfg.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.company_name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{p.package_type} · {p.assigned_rep || 'Unassigned'}</p>
                    </div>
                    <Badge className={`text-[9px] px-1.5 ${cfg.badge} flex-shrink-0`}>{p.status}</Badge>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-emerald-300">${(p.expected_mrr || 0).toLocaleString()}/mo</p>
                      <p className="text-[10px] text-slate-500">+${(p.setup_fee || 0).toLocaleString()} setup</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showGenerate && <GenerateModal onClose={() => setShowGenerate(false)} onSave={onRefresh} />}
    </div>
  );
}