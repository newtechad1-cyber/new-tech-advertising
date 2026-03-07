import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Filter } from 'lucide-react';

const TYPE_COLOR = {
  missing_service_page: 'bg-violet-500/20 text-violet-300',
  missing_location_page: 'bg-sky-500/20 text-sky-300',
  streaming_tv_gap: 'bg-pink-500/20 text-pink-300',
  review_gap: 'bg-amber-500/20 text-amber-300',
  missing_offer: 'bg-green-500/20 text-green-300',
  missing_social_theme: 'bg-cyan-500/20 text-cyan-300',
  cta_gap: 'bg-orange-500/20 text-orange-300',
  seasonal_gap: 'bg-blue-500/20 text-blue-300',
  missing_video_type: 'bg-red-500/20 text-red-300',
  campaign_gap: 'bg-slate-500/20 text-slate-300',
};

const ACTION_COLOR = {
  create_page: 'text-violet-400',
  create_article: 'text-sky-400',
  create_video: 'text-pink-400',
  create_campaign: 'text-amber-400',
  create_offer: 'text-green-400',
  create_social_series: 'text-cyan-400',
  create_email_sequence: 'text-blue-400',
  improve_cta: 'text-orange-400',
  improve_reviews: 'text-red-400',
};

function ScoreChip({ label, value, color }) {
  return (
    <div className="text-center">
      <div className={`text-sm font-bold ${color}`}>{value}</div>
      <div className="text-slate-600 text-xs">{label}</div>
    </div>
  );
}

export default function OpportunitySignalAdmin() {
  const [signals, setSignals] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBiz, setFilterBiz] = useState('');
  const [filterType, setFilterType] = useState('');

  const load = async () => {
    setLoading(true);
    const [sigs, biz] = await Promise.all([
      base44.entities.OpportunitySignal.list('-overall_opportunity_score', 50),
      base44.entities.BusinessProfile.list()
    ]);
    setSignals(sigs);
    setBusinesses(biz);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = signals.filter(s =>
    (!filterBiz || s.business_profile_id === filterBiz) &&
    (!filterType || s.opportunity_type === filterType)
  );

  const getBizName = (id) => businesses.find(b => b.id === id)?.business_name || id;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link to={createPageUrl('IntelAdmin')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Opportunity Signals</h1>
            <p className="text-slate-500 text-xs">{filtered.length} signals</p>
          </div>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          <select value={filterBiz} onChange={e => setFilterBiz(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Businesses</option>
            {businesses.map(b => <option key={b.id} value={b.id}>{b.business_name}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Types</option>
            {Object.keys(TYPE_COLOR).map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
          </select>
        </div>

        {loading ? <div className="text-slate-500 text-sm py-20 text-center">Loading...</div> : (
          <div className="space-y-3">
            {filtered.map(sig => (
              <div key={sig.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  {/* Score bubble */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <span className={`text-base font-extrabold ${sig.overall_opportunity_score >= 70 ? 'text-green-400' : sig.overall_opportunity_score >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {sig.overall_opportunity_score}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <span className="text-white font-bold text-sm">{sig.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLOR[sig.opportunity_type] || 'bg-slate-700 text-slate-400'}`}>
                        {sig.opportunity_type?.replace(/_/g,' ')}
                      </span>
                      <span className={`text-xs font-semibold ${TYPE_COLOR[sig.truth_state] || 'text-slate-400'}`}>{sig.truth_state}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-3">{sig.description}</p>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <ScoreChip label="Demand" value={sig.demand_score} color="text-violet-400" />
                      <ScoreChip label="Competition" value={sig.competition_score} color="text-red-400" />
                      <ScoreChip label="Readiness" value={sig.readiness_score} color="text-amber-400" />
                      <ScoreChip label="Revenue" value={sig.revenue_potential_score} color="text-green-400" />
                      <ScoreChip label="Confidence" value={sig.confidence_score} color="text-sky-400" />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {sig.recommended_action_type && (
                        <span className={`text-xs font-bold flex items-center gap-1 ${ACTION_COLOR[sig.recommended_action_type] || 'text-slate-400'}`}>
                          <Zap className="w-3 h-3" /> {sig.recommended_action_type?.replace(/_/g,' ')}
                        </span>
                      )}
                      {sig.recommended_cta && <span className="text-slate-400 text-xs">CTA: "{sig.recommended_cta}"</span>}
                      {sig.recommended_offer && <span className="text-slate-400 text-xs">Offer: {sig.recommended_offer}</span>}
                      <span className="text-slate-600 text-xs ml-auto">{getBizName(sig.business_profile_id)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-slate-500 text-sm py-10 text-center">No signals found. Generate intel for a business profile to see opportunities.</div>}
          </div>
        )}
      </div>
    </div>
  );
}