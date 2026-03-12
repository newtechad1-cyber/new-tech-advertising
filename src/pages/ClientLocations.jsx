import React, { useState } from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus, ChevronRight, Plus, X, Zap, CheckCircle2, AlertTriangle, Star } from 'lucide-react';

// ── Demo Data ─────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { id:'l1', name:'Downtown Chicago', city:'Chicago', state:'IL', region:'North', momentum:'strong', visibility:87, visibility_trend:'up', content_activity:'high', campaign_status:'Spring Push Active', lead_signals:14, engagement:82, ranking_avg:3.2, campaign_pct:94 },
  { id:'l2', name:'Lincoln Park', city:'Chicago', state:'IL', region:'North', momentum:'strong', visibility:79, visibility_trend:'up', content_activity:'high', campaign_status:'Spring Push Active', lead_signals:9, engagement:74, ranking_avg:4.1, campaign_pct:88 },
  { id:'l3', name:'Oak Park', city:'Oak Park', state:'IL', region:'West', momentum:'stable', visibility:64, visibility_trend:'stable', content_activity:'medium', campaign_status:'Authority Series', lead_signals:5, engagement:61, ranking_avg:5.8, campaign_pct:72 },
  { id:'l4', name:'Naperville', city:'Naperville', state:'IL', region:'West', momentum:'stable', visibility:68, visibility_trend:'stable', content_activity:'medium', campaign_status:'Spring Push Pending', lead_signals:6, engagement:64, ranking_avg:5.2, campaign_pct:75 },
  { id:'l5', name:'Schaumburg', city:'Schaumburg', state:'IL', region:'Northwest', momentum:'needs_focus', visibility:41, visibility_trend:'down', content_activity:'low', campaign_status:'No Active Campaign', lead_signals:2, engagement:38, ranking_avg:9.4, campaign_pct:31 },
  { id:'l6', name:'Evanston', city:'Evanston', state:'IL', region:'North', momentum:'stable', visibility:71, visibility_trend:'up', content_activity:'medium', campaign_status:'Spring Push Active', lead_signals:7, engagement:68, ranking_avg:4.7, campaign_pct:80 },
];

const CAMPAIGNS = [
  { name:'Spring HVAC Tune-Up Push', type:'all_locations', locations:6, status:'active', start:'Mar 18', end:'Apr 15' },
  { name:'Energy Authority Series', type:'regional', region:'North', locations:3, status:'active', start:'Mar 1', end:'Jun 1' },
  { name:'Northwest Awareness Push', type:'regional', region:'Northwest', locations:1, status:'planned', start:'Apr 1', end:'May 1' },
];

const EXPANSION = [
  { type:'new_location', emoji:'🏙️', headline:'Wicker Park territory underserved', detail:'Competitor gap detected in Wicker Park. Strong HVAC demand with no dominant local presence.', benefit:'Estimated +$1,200 MRR new location', timeline:'Launch within 30 days' },
  { type:'authority_campaign', emoji:'📡', headline:'Northwest region needs authority push', detail:'Schaumburg visibility 46% below network average. A regional campaign would close the gap in 6–8 weeks.', benefit:'Bring Schaumburg to 65+ visibility score', timeline:'Start this month' },
  { type:'branding_consistency', emoji:'🎨', headline:'Improve branding consistency across 3 locations', detail:'Oak Park, Naperville, and Schaumburg using outdated visual templates. Unified brand identity will improve recognition.', benefit:'Higher engagement and recognition across mid-tier locations', timeline:'Immediate' },
];

const MOMENTUM_CONFIG = {
  strong:      { label:'Strong', dot:'bg-emerald-400', badge:'bg-emerald-100 text-emerald-700', bar:'bg-emerald-400', ring:'border-emerald-200' },
  stable:      { label:'Stable', dot:'bg-amber-400', badge:'bg-amber-100 text-amber-700', bar:'bg-amber-400', ring:'border-slate-200' },
  needs_focus: { label:'Needs Focus', dot:'bg-red-400 animate-pulse', badge:'bg-red-100 text-red-700', bar:'bg-red-400', ring:'border-red-200' },
};

const TrendIcon = ({ dir }) => dir === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : dir === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-slate-400" />;

// ── Location Modal ────────────────────────────────────────────────────────────
const LocationModal = ({ loc, onClose }) => {
  const cfg = MOMENTUM_CONFIG[loc.momentum];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className="text-lg font-black text-slate-800">{loc.name}</p>
            </div>
            <p className="text-xs text-slate-500">{loc.city}, {loc.state} · {loc.region} Region</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-500" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { l:'Visibility Score', v:`${loc.visibility}/100`, c: loc.visibility > 70 ? 'text-emerald-600' : loc.visibility > 50 ? 'text-amber-600' : 'text-red-600' },
              { l:'Engagement Signal', v:`${loc.engagement}/100`, c: loc.engagement > 70 ? 'text-emerald-600' : 'text-amber-600' },
              { l:'Lead Signals', v:loc.lead_signals, c:'text-blue-600' },
              { l:'Campaign Part.', v:`${loc.campaign_pct}%`, c: loc.campaign_pct > 75 ? 'text-emerald-600' : 'text-amber-600' },
              { l:'Avg Ranking', v:`#${loc.ranking_avg}`, c: loc.ranking_avg < 5 ? 'text-emerald-600' : 'text-amber-600' },
              { l:'Content Activity', v:loc.content_activity, c:'text-slate-700' },
            ].map(m => (
              <div key={m.l} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">{m.l}</p>
                <p className={`text-xl font-black capitalize ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Current Campaign</p>
            <p className="text-sm font-semibold text-slate-700">{loc.campaign_status}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { l:'Prioritize Location', c:'bg-emerald-500 hover:bg-emerald-400 text-white' },
              { l:'Request Promotion', c:'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100' },
              { l:'Adjust Campaign', c:'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100' },
            ].map(a => (
              <button key={a.l} onClick={onClose} className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-bold transition-colors ${a.c}`}>{a.l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ClientLocations() {
  const [selected, setSelected] = useState(null);
  const [dismissed, setDismissed] = useState([]);

  const growing = LOCATIONS.filter(l => l.momentum === 'strong').length;
  const attention = LOCATIONS.filter(l => l.momentum === 'needs_focus').length;
  const avgVis = Math.round(LOCATIONS.reduce((s, l) => s + l.visibility, 0) / LOCATIONS.length);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/97 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-6xl mx-auto">
          <div className="flex items-stretch overflow-x-auto">
            <div className="flex items-center gap-2 px-4 border-r border-slate-200 shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-black text-slate-800 whitespace-nowrap">Multi-Location Manager</p>
            </div>
            {[
              { l:'Locations', v:LOCATIONS.length, c:'text-slate-800' },
              { l:'Growing', v:growing, c:'text-emerald-600' },
              { l:'Needs Attention', v:attention, c:attention>0?'text-red-500':'text-slate-400' },
              { l:'Avg Visibility', v:`${avgVis}/100`, c:'text-blue-600' },
            ].map(t => (
              <div key={t.l} className="flex flex-col px-4 py-1.5 border-r border-slate-200 min-w-[80px]">
                <span className="text-[9px] text-slate-400 font-medium uppercase">{t.l}</span>
                <span className={`text-base font-black ${t.c}`}>{t.v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Location
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold transition-colors">
              <Zap className="w-3.5 h-3.5" /> Regional Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* S1 — Location Grid */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Your Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOCATIONS.map(loc => {
              const cfg = MOMENTUM_CONFIG[loc.momentum];
              return (
                <div key={loc.id} onClick={() => setSelected(loc)}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${cfg.ring}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-slate-800 text-sm">{loc.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{loc.city} · {loc.region} Region</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                  </div>
                  {/* Visibility bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Visibility</span>
                      <div className="flex items-center gap-1">
                        <TrendIcon dir={loc.visibility_trend} />
                        <span className="text-xs font-black text-slate-700">{loc.visibility}/100</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width:`${loc.visibility}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>📄 Content: <span className="font-bold capitalize">{loc.content_activity}</span></span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{loc.campaign_status}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">🎯 {loc.lead_signals} lead signals</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* S2 — Regional Campaigns */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Regional Campaign Coordination</h2>
          <p className="text-sm text-slate-500 mb-4">Campaigns active across your location network.</p>
          <div className="space-y-3">
            {CAMPAIGNS.map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-slate-800">{c.name}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.status==='active'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{c.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {c.type === 'all_locations' ? `All ${c.locations} locations` : `${c.region} Region — ${c.locations} location${c.locations>1?'s':''}`} · {c.start} → {c.end}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex gap-1">
                      {LOCATIONS.slice(0, Math.min(c.locations, 4)).map((l, j) => (
                        <div key={j} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[9px] font-black text-white border-2 border-white -ml-1 first:ml-0">{l.city[0]}</div>
                      ))}
                      {c.locations > 4 && <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500 border-2 border-white -ml-1">+{c.locations-4}</div>}
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1">Manage <ChevronRight className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S3 — Marketing Calendar Preview */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Location Marketing Calendar — March 2026</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <p key={d} className="text-[9px] text-slate-400 font-bold uppercase text-center">{d}</p>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6;
                const active = [18,19,20,21,22,25,26,27,28,29].includes(day);
                const campaign = [18,25].includes(day);
                return (
                  <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-colors ${day < 1 || day > 31 ? 'opacity-0' : campaign ? 'bg-emerald-500 text-white cursor-pointer' : active ? 'bg-emerald-100 text-emerald-700 cursor-pointer' : 'bg-slate-50 text-slate-400'}`}>
                    {day > 0 && day <= 31 && day}
                    {campaign && <div className="w-1 h-1 rounded-full bg-white/80 mt-0.5" />}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-[10px] text-slate-500">Campaign launch</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100" /><span className="text-[10px] text-slate-500">Content publishing</span></div>
            </div>
          </div>
        </div>

        {/* S4 — Expansion Opportunities */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Expansion Opportunities</h2>
          <p className="text-sm text-slate-500 mb-4">AI-detected growth opportunities for your location network.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPANSION.filter((_, i) => !dismissed.includes(i)).map((e, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{e.emoji}</span>
                <p className="text-sm font-black text-slate-800 mb-1">{e.headline}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{e.detail}</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3">
                  <p className="text-[10px] text-blue-700 font-semibold">{e.benefit}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">⏱ {e.suggested_timeline}</span>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1">Activate <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S5 — Enterprise Performance Snapshot */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Enterprise Performance Snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label:'Brand Visibility Trend', value:'+14%', note:'across all locations', color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
              { label:'Engagement Growth', value:'+28%', note:'month over month', color:'text-blue-600', bg:'bg-blue-50 border-blue-200' },
              { label:'Campaign Consistency', value:'81%', note:'publishing on schedule', color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
              { label:'Strongest Region', value:'North', note:'Downtown + Lincoln Park', color:'text-violet-600', bg:'bg-violet-50 border-violet-200' },
            ].map(p => (
              <div key={p.label} className={`border rounded-2xl p-4 ${p.bg}`}>
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">{p.label}</p>
                <p className={`text-2xl font-black ${p.color}`}>{p.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Your North Region locations </span>
              are driving the strongest visibility and engagement growth. The Northwest region presents the biggest opportunity to close the performance gap with a targeted campaign.
            </p>
          </div>
        </div>
      </div>

      {selected && <LocationModal loc={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}