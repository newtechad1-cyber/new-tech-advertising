import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, TrendingUp, AlertTriangle, Zap, Target, Video, BrainCircuit, BarChart2 } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';

const STATE_COLOR = {
  assumed: 'bg-slate-700 text-slate-400',
  inferred: 'bg-blue-500/20 text-blue-400',
  observed: 'bg-amber-500/20 text-amber-400',
  proven: 'bg-green-500/20 text-green-400'
};

function ScoreBar({ label, value, color = 'bg-violet-500' }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-slate-400 text-xs">{label}</span>
        <span className="text-white text-xs font-bold">{value}/100</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TagSection({ icon: IconComp, color, title, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <IconComp className={`w-4 h-4 ${color}`} />
        <h4 className="text-white font-semibold text-sm">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">{item}</span>)}
      </div>
    </div>
  );
}

export default function BusinessIntelProfileAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selected, setSelected] = useState('');
  const [bip, setBip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bpId = params.get('business_profile_id');
    base44.entities.BusinessProfile.list().then(bs => {
      setBusinesses(bs);
      if (bpId) setSelected(bpId);
      else if (bs.length > 0) setSelected(bs[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    base44.entities.BusinessIntelProfile.filter({ business_profile_id: selected }).then(r => {
      setBip(r[0] || null);
      setLoading(false);
    });
  }, [selected]);

  const handleRegenerate = async () => {
    if (!selected) return;
    setRegenerating(true);
    await base44.functions.invoke('generateBusinessIntelProfile', { business_profile_id: selected });
    await base44.functions.invoke('generateOpportunitySignals', { business_profile_id: selected });
    await base44.functions.invoke('generateWeeklyMarketingPlan', { business_profile_id: selected });
    const r = await base44.entities.BusinessIntelProfile.filter({ business_profile_id: selected });
    setBip(r[0] || null);
    setRegenerating(false);
  };

  const business = businesses.find(b => b.id === selected);

  return (
    <AdminGuard>
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-extrabold text-white">Marketing Brain</h1>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            {businesses.map(b => <option key={b.id} value={b.id}>{b.business_name}</option>)}
          </select>
          <button onClick={handleRegenerate} disabled={regenerating || !selected}
            className="ml-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Regenerate Intel'}
          </button>
        </div>

        {loading ? <div className="text-slate-500 text-sm py-20 text-center">Loading...</div> :
          !bip ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">No intelligence profile found for this business.</p>
              <button onClick={handleRegenerate} disabled={regenerating} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-50">
                {regenerating ? 'Generating...' : '⚡ Generate Now'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-white font-extrabold text-lg">{business?.business_name}</h2>
                    <p className="text-slate-400 text-sm mt-1">{business?.city}, {business?.state} · {bip.industry_slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[['positioning', bip.positioning_source_state],['offer', bip.offer_source_state],['content', bip.content_source_state],['campaign', bip.campaign_source_state]].map(([k,v]) => (
                      <span key={k} className={`text-xs px-2.5 py-1 rounded-full ${STATE_COLOR[v] || STATE_COLOR.assumed}`}>{k}: {v}</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm mt-4 leading-relaxed">{bip.recommended_positioning}</p>
              </div>

              {/* Confidence Scores */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-violet-400" />Confidence Scores</h3>
                <div className="space-y-3">
                  <ScoreBar label="Overall" value={bip.overall_confidence_score} color="bg-violet-500" />
                  <ScoreBar label="SEO" value={bip.seo_confidence_score} color="bg-sky-500" />
                  <ScoreBar label="Content" value={bip.content_confidence_score} color="bg-cyan-500" />
                  <ScoreBar label="Offers" value={bip.offer_confidence_score} color="bg-amber-500" />
                  <ScoreBar label="Campaigns" value={bip.campaign_confidence_score} color="bg-pink-500" />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-4 border-t border-slate-800">
                  {[['Industry', bip.industry_weight],['Local Market', bip.local_market_weight],['Business Input', bip.business_input_weight],['Performance', bip.performance_weight]].map(([l,w]) => (
                    <div key={l}>
                      <div className="text-slate-400 text-xs mb-0.5">{l}</div>
                      <div className="text-white font-bold text-sm">{Math.round((w||0)*100)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Offer */}
              <div className="bg-violet-900/20 border border-violet-700/30 rounded-2xl p-5">
                <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">Primary Offer</p>
                <p className="text-white font-bold text-lg">{bip.recommended_primary_offer}</p>
                {bip.recommended_secondary_offers?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {bip.recommended_secondary_offers.map((o,i) => <span key={i} className="text-xs bg-violet-500/10 border border-violet-700/30 text-violet-300 px-2.5 py-1 rounded-lg">{o}</span>)}
                  </div>
                )}
              </div>

              {/* Intelligence Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <TagSection icon={BrainCircuit} color="text-violet-400" title="Content Pillars" items={bip.recommended_content_pillars} />
                  <TagSection icon={Video} color="text-pink-400" title="Video Pillars" items={bip.recommended_video_pillars} />
                  <TagSection icon={Target} color="text-sky-400" title="Streaming TV Angles" items={bip.recommended_streaming_tv_angles} />
                  <TagSection icon={TrendingUp} color="text-cyan-400" title="CTA Mix" items={bip.recommended_cta_mix} />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <TagSection icon={TrendingUp} color="text-green-400" title="Priority Service Pages" items={bip.priority_service_pages} />
                  <TagSection icon={TrendingUp} color="text-amber-400" title="Priority Location Pages" items={bip.priority_location_pages} />
                  <TagSection icon={BrainCircuit} color="text-blue-400" title="Priority Problem Articles" items={bip.priority_problem_articles} />
                  <TagSection icon={Video} color="text-cyan-400" title="Priority Social Series" items={bip.priority_social_series} />
                </div>
              </div>

              {/* Opportunities, Gaps, Risks, Quick Wins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-900/10 border border-green-800/30 rounded-2xl p-5">
                  <h4 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />Top Opportunities</h4>
                  <ul className="space-y-2">
                    {(bip.top_opportunities || []).map((o,i) => <li key={i} className="text-slate-300 text-xs flex items-start gap-2"><span className="text-green-400 font-bold flex-shrink-0">{i+1}.</span>{o}</li>)}
                  </ul>
                </div>
                <div className="bg-red-900/10 border border-red-800/30 rounded-2xl p-5">
                  <h4 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Top Gaps</h4>
                  <ul className="space-y-2">
                    {(bip.top_gaps || []).map((g,i) => <li key={i} className="text-slate-300 text-xs flex items-start gap-2"><span className="text-red-400 font-bold flex-shrink-0">·</span>{g}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-900/10 border border-amber-800/30 rounded-2xl p-5">
                  <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Top Risks</h4>
                  <ul className="space-y-2">
                    {(bip.top_risks || []).map((r,i) => <li key={i} className="text-slate-300 text-xs flex items-start gap-2"><span className="text-amber-400 font-bold flex-shrink-0">·</span>{r}</li>)}
                  </ul>
                </div>
                <div className="bg-violet-900/10 border border-violet-800/30 rounded-2xl p-5">
                  <h4 className="text-violet-400 font-bold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4" />Quick Wins</h4>
                  <ul className="space-y-2">
                    {(bip.quick_win_actions || []).map((w,i) => <li key={i} className="text-slate-300 text-xs flex items-start gap-2"><span className="text-violet-400 font-bold flex-shrink-0">{i+1}.</span>{w}</li>)}
                  </ul>
                </div>
              </div>

              <p className="text-slate-600 text-xs text-center">Last generated: {bip.last_generated_at ? new Date(bip.last_generated_at).toLocaleString() : '—'} · Version: {bip.version || '—'}</p>
            </div>
          )}
      </div>
    </div>
    </AdminGuard>
  );
}