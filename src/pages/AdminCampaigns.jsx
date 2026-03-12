import React, { useState } from 'react';
import { Zap, CheckCircle2, TrendingUp, AlertTriangle, X, RefreshCw, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, ResponsiveContainer } from 'recharts';

const TP = { background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 11, color: '#e2e8f0' };
const SEASON_GRAD = { spring:'from-emerald-500 to-teal-600', summer:'from-amber-500 to-orange-600', fall:'from-orange-600 to-red-700', winter:'from-blue-600 to-indigo-700', holiday:'from-red-600 to-rose-700', evergreen:'from-slate-600 to-slate-800' };
const SEASON_EMOJI = { spring:'🌸', summer:'☀️', fall:'🍂', winter:'❄️', holiday:'🎄', evergreen:'🌿' };

const PIPELINE_STAGES = ['strategy_planning','content_generation','approval_queue','publishing','performance_monitoring'];
const STAGE_LABELS = { strategy_planning:'Strategy Planning', content_generation:'Content Generation', approval_queue:'Approval Queue', publishing:'Publishing Live', performance_monitoring:'Performance Monitoring' };
const STAGE_DOTS = { strategy_planning:'bg-slate-400', content_generation:'bg-blue-400 animate-pulse', approval_queue:'bg-amber-400 animate-pulse', publishing:'bg-emerald-400 animate-pulse', performance_monitoring:'bg-violet-400' };

const PIPELINE_ITEMS = [
  { id:'1', title:'Spring HVAC Tune-Up', vertical:'HVAC', region:'Chicago North', stage:'approval_queue', urgency:'urgent', content_volume:18, roi_signal:'high' },
  { id:'2', title:'Emergency AC Repair', vertical:'HVAC', region:'Chicago South', stage:'content_generation', urgency:'normal', content_volume:12, roi_signal:'high' },
  { id:'3', title:'Legal Spring Push', vertical:'Legal', region:'Metro', stage:'strategy_planning', urgency:'normal', content_volume:8, roi_signal:'medium' },
  { id:'4', title:'Restaurant Holiday Promo', vertical:'Restaurant', region:'Downtown', stage:'performance_monitoring', urgency:'low', content_volume:20, roi_signal:'medium' },
  { id:'5', title:'Energy Authority Series', vertical:'HVAC', region:'All', stage:'publishing', urgency:'normal', content_volume:8, roi_signal:'high' },
];

const TEMPLATES = [
  { emoji:'🌸', name:'HVAC Spring Tune-Up', vertical:'HVAC', season:'spring', window:'Mar 1 – Apr 30', channels:'Instagram, Facebook, Google, YouTube', content_mix:'4 videos, 12 posts, 2 GBP updates', perf:'92% avg engagement lift', history:'Best performer — 3 consecutive seasons' },
  { emoji:'🍽️', name:'Restaurant Holiday Promotion', vertical:'Restaurant', season:'holiday', window:'Nov 15 – Dec 31', channels:'Facebook, Instagram, Email', content_mix:'3 videos, 16 posts, 4 email blasts', perf:'78% avg reach increase', history:'High conversion — tied to direct reservation spikes' },
  { emoji:'📚', name:'Back-to-School Business Visibility', vertical:'Retail', season:'fall', window:'Aug 1 – Sep 15', channels:'Google, Instagram, YouTube', content_mix:'2 videos, 8 posts, landing page', perf:'65% search visibility boost', history:'Strong SEO authority signal' },
  { emoji:'❄️', name:'Winter Emergency Services', vertical:'Home Services', season:'winter', window:'Nov 1 – Feb 28', channels:'Google, Facebook', content_mix:'4 videos, 10 posts', perf:'71% emergency inquiry lift', history:'Critical for weather-sensitive verticals' },
];

const SEASONALITY_DATA = [
  { month:'Jan', hvac:40, restaurant:55, home:35 },
  { month:'Feb', hvac:45, restaurant:60, home:42 },
  { month:'Mar', hvac:85, restaurant:68, home:72 },
  { month:'Apr', hvac:100, restaurant:70, home:88 },
  { month:'May', hvac:92, restaurant:74, home:80 },
  { month:'Jun', hvac:80, restaurant:82, home:62 },
];

const DEMAND_INTEL = [
  { emoji:'🌡️', headline:'HVAC spring demand spiking 2 weeks earlier than last year', detail:'Search volume for "AC tune-up near me" up 34% vs same period last year. Accelerate spring campaign launches for HVAC clients.', severity:'high' },
  { emoji:'🍽️', headline:'Restaurant holiday content engagement window opening', detail:'Restaurant clients who publish 6+ weeks before holidays see 2× the reservation inquiry rate.', severity:'medium' },
  { emoji:'💡', headline:'Campaign confidence scores highest for video-led campaigns', detail:'Video-first campaigns show 40% higher engagement signal vs. post-only campaigns.', severity:'info' },
];

const ROI_SIGNALS = [
  { company:'Arctic Air HVAC', signal:'Campaign driving upsell interest', value:'+$800 MRR opportunity' },
  { company:'Midwest Plumbing', signal:'Expansion market readiness detected', value:'+$1,200 MRR opportunity' },
  { company:'Green Valley Landscaping', signal:'Premium video conversion signal', value:'+$400/mo upgrade' },
];

export default function AdminCampaigns() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [dismissed, setDismissed] = useState([]);
  const [pipeline, setPipeline] = useState(PIPELINE_ITEMS);

  const stats = [
    { label:'Active Campaigns', value:pipeline.filter(p=>p.stage==='publishing').length, icon:Zap, color:'text-emerald-600' },
    { label:'Approval Queue', value:pipeline.filter(p=>p.stage==='approval_queue').length, icon:AlertTriangle, color:'text-amber-600' },
    { label:'In Production', value:pipeline.filter(p=>p.stage==='content_generation').length, icon:Sparkles, color:'text-blue-600' },
    { label:'High ROI Signals', value:ROI_SIGNALS.length, icon:TrendingUp, color:'text-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Seasonal Campaign Engine — Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Campaign pipeline, templates, demand intelligence, and ROI signals</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors">
              <Sparkles className="w-4 h-4" /> Generate Seasonal Batch
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">{s.label}</p>
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-0 mb-5 border-b border-slate-200">
          {['pipeline','templates','demand','roi'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab===t?'border-emerald-500 text-emerald-600':'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t==='pipeline'?'Campaign Pipeline':t==='templates'?'Template Library':t==='demand'?'Demand Intelligence':'ROI Signals'}
            </button>
          ))}
        </div>

        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PIPELINE_STAGES.map(stage => {
              const items = pipeline.filter(p => p.stage === stage);
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl">
                    <div className={`w-2 h-2 rounded-full ${STAGE_DOTS[stage]}`} />
                    <p className="text-[10px] font-bold text-slate-700">{STAGE_LABELS[stage]}</p>
                    <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 rounded-full px-1.5 font-bold">{items.length}</span>
                  </div>
                  {items.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all">
                      <p className="text-xs font-black text-slate-800 mb-0.5">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mb-2">{item.vertical} · {item.region}</p>
                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.urgency==='urgent'?'bg-red-100 text-red-600':'bg-slate-100 text-slate-500'}`}>{item.urgency}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.roi_signal==='high'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{item.roi_signal} ROI</span>
                      </div>
                      <p className="text-[9px] text-slate-400">{item.content_volume} pieces</p>
                      {stage === 'approval_queue' && (
                        <button onClick={() => setPipeline(prev => prev.map(p => p.id===item.id ? { ...p, stage:'content_generation' } : p))}
                          className="mt-2 w-full py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-[9px] font-bold text-emerald-700 transition-colors">
                          Approve
                        </button>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-center py-4 text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl">Empty</div>}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((t, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className={`h-16 bg-gradient-to-br ${SEASON_GRAD[t.season]} flex items-center gap-3 px-5`}>
                  <span className="text-3xl">{t.emoji}</span>
                  <div>
                    <p className="text-white font-black text-sm">{t.name}</p>
                    <p className="text-white/70 text-[10px]">{t.vertical} · {t.window}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Channels</p>
                      <p className="text-[10px] text-slate-600 font-semibold">{t.channels}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Content Mix</p>
                      <p className="text-[10px] text-slate-600 font-semibold">{t.content_mix}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 rounded-lg px-2 py-1">{t.perf}</p>
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-500">Use Template</button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">{t.history}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'demand' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-800 mb-1">Seasonal Demand by Vertical</p>
                <p className="text-[11px] text-slate-500 mb-3">Relative engagement intensity by month</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={SEASONALITY_DATA}>
                    <defs>
                      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={TP} />
                    <Area type="monotone" dataKey="hvac" stroke="#10b981" fill="url(#hg)" strokeWidth={2} name="HVAC" />
                    <Area type="monotone" dataKey="restaurant" stroke="#f59e0b" fill="url(#rg)" strokeWidth={2} name="Restaurant" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {DEMAND_INTEL.filter((_, i) => !dismissed.includes(i)).map((ins, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 bg-white border rounded-2xl shadow-sm ${ins.severity==='high'?'border-orange-200':'border-slate-200'}`}>
                    <span className="text-xl flex-shrink-0">{ins.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 mb-1">{ins.headline}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{ins.detail}</p>
                    </div>
                    <button onClick={() => setDismissed(d => [...d, i])} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-3">
            {ROI_SIGNALS.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">{r.company}</p>
                  <p className="text-xs text-slate-500">{r.signal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-emerald-600">{r.value}</span>
                  <button className="px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">Act Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}