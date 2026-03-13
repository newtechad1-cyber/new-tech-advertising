import React, { useEffect, useState } from 'react';
import { TrendingDown, AlertTriangle, Target, Eye, ChevronRight, Loader2 } from 'lucide-react';

// Deterministic-ish "simulation" based on industry/city
function generateInsights(data) {
  const industryMultipliers = {
    hvac: 1.3, roofing: 1.2, plumbing: 1.15, electrical: 1.1,
    restaurant: 0.9, dental: 1.05, real_estate: 1.1, other: 1.0,
  };
  const m = industryMultipliers[data.industry] || 1.0;
  return {
    visibility_gap_score:              Math.min(94, Math.round(62 * m)),
    competitor_count_active:           Math.round(7 * m),
    content_opportunity_index:         Math.round(78 * m),
    estimated_missed_leads_monthly:    Math.round(18 * m),
    keywords_not_ranking:              Math.round(140 * m),
    streaming_gap_present:             true,
    top_competitors:                   [`Top ${data.industry} Pro in ${data.city}`, `${data.city} ${data.industry} Experts`, `Premier ${data.industry} Services`],
  };
}

function AnimatedCount({ target, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val}{suffix}</span>;
}

function GaugeBar({ label, value, max = 100, color, icon: Icon, description }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 200); }, []);
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="text-slate-800 text-sm font-bold">{label}</p>
            <p className="text-slate-400 text-xs">{description}</p>
          </div>
        </div>
        <span className="text-2xl font-black" style={{ color }}>
          <AnimatedCount target={value} suffix={max === 100 ? '%' : ''} />
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animate ? `${pct}%` : '0%', background: color }} />
      </div>
    </div>
  );
}

export default function StepInsights({ data, onNext, loading }) {
  const [revealed, setRevealed] = useState(false);
  const insights = generateInsights(data);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const INDUSTRY_LABELS = {
    hvac: 'HVAC', plumbing: 'Plumbing', roofing: 'Roofing', electrical: 'Electrical',
    landscaping: 'Landscaping', painting: 'Painting', restaurant: 'Restaurant',
    dental: 'Dental', real_estate: 'Real Estate', fitness: 'Fitness', med_spa: 'Med Spa', other: 'Local Business',
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold mb-4">
          <AlertTriangle className="w-4 h-4" /> Market Gap Detected — {data.city}
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Your {INDUSTRY_LABELS[data.industry] || 'Business'} Authority Gap
        </h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Based on your market and industry, here's what we found in the <strong>{data.city}</strong> area.
          These signals indicate significant untapped growth opportunity.
        </p>
      </div>

      {revealed && (
        <div className="space-y-4 mb-6">
          <GaugeBar
            label="Visibility Gap Score"
            value={insights.visibility_gap_score}
            color="#ef4444"
            icon={TrendingDown}
            description="How much visibility you're currently missing"
          />
          <GaugeBar
            label="Content Opportunity Index"
            value={insights.content_opportunity_index}
            color="#3b82f6"
            icon={Target}
            description="Untapped content topics your competitors aren't covering"
          />
          <GaugeBar
            label="Competitor Activity Level"
            value={Math.round((insights.competitor_count_active / 12) * 100)}
            color="#f59e0b"
            icon={Eye}
            description="Active competitors investing in digital visibility"
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Leads Missed / Month', val: insights.estimated_missed_leads_monthly, color: '#ef4444', suffix: '+' },
          { label: 'Keywords Not Ranking', val: insights.keywords_not_ranking, color: '#f59e0b', suffix: '' },
          { label: 'Competitors Publishing', val: insights.competitor_count_active, color: '#3b82f6', suffix: '' },
        ].map((s, i) => (
          <div key={i} className="text-center p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <p className="text-2xl font-black" style={{ color: s.color }}>
              {revealed ? <AnimatedCount target={s.val} suffix={s.suffix} /> : '—'}
            </p>
            <p className="text-slate-500 text-xs mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Streaming gap */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-6 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-sm">📺</span>
        </div>
        <div>
          <p className="text-blue-900 font-black text-sm">Streaming TV Gap Confirmed</p>
          <p className="text-blue-700 text-xs mt-0.5">
            No {INDUSTRY_LABELS[data.industry] || 'local'} businesses in {data.city} are currently running Connected TV campaigns. First-mover advantage is available.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 text-white mb-6">
        <p className="text-sm font-semibold text-slate-300 mb-1">What this means for <span className="text-white font-black">{data.business_name}</span>:</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your market has an active gap that the NTA Authority System is specifically built to close. During your demo, we'll show you exactly what a 90-day growth roadmap looks like for your business.
        </p>
      </div>

      <button onClick={onNext} disabled={loading}
        className="w-full py-4 rounded-2xl text-base font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Book My Strategy Session <ChevronRight className="w-5 h-5" /></>}
      </button>
    </div>
  );
}