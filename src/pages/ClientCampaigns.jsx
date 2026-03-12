import React, { useState } from 'react';
import { Zap, CheckCircle2, Calendar, ChevronRight, Play, TrendingUp, Clock, Sparkles, Plus, X } from 'lucide-react';

const SEASON_GRAD = { spring:'from-emerald-500 to-teal-600', summer:'from-amber-500 to-orange-600', fall:'from-orange-600 to-red-700', winter:'from-blue-600 to-indigo-700', holiday:'from-red-600 to-rose-700', evergreen:'from-slate-600 to-slate-800' };
const SEASON_EMOJI = { spring:'🌸', summer:'☀️', fall:'🍂', winter:'❄️', holiday:'🎄', evergreen:'🌿' };
const STATUS_CONFIG = {
  suggested:     { label:'Suggested', dot:'bg-violet-400 animate-pulse', badge:'bg-violet-100 text-violet-700' },
  approved:      { label:'Approved ✓', dot:'bg-emerald-400', badge:'bg-emerald-100 text-emerald-700' },
  in_production: { label:'In Production', dot:'bg-blue-400 animate-pulse', badge:'bg-blue-100 text-blue-700' },
  publishing:    { label:'Publishing 🟢', dot:'bg-teal-400 animate-pulse', badge:'bg-teal-100 text-teal-700' },
  completed:     { label:'Completed', dot:'bg-slate-300', badge:'bg-slate-100 text-slate-500' },
  paused:        { label:'Paused', dot:'bg-amber-400', badge:'bg-amber-100 text-amber-700' },
};

const HERO = { id:'h1', campaign_title:'Spring HVAC Tune-Up Push', season:'spring', status:'suggested', marketing_goal:'Capture spring demand before summer rush locks in competitor positions.', channels:'Instagram, Facebook, Google Business, YouTube', content_volume:18, video_count:3, performance_confidence:88, urgency:'urgent', start_date:'2026-03-18', end_date:'2026-04-15', ai_summary:'Spring is your highest-demand window. This campaign activates your full channel mix with seasonal urgency messaging, 3 branded videos, and weekly social publishing to capture homeowners searching for tune-up services.' };

const CAMPAIGNS = [
  { id:'1', campaign_title:'Spring HVAC Tune-Up Push', season:'spring', status:'suggested', channels:'Instagram, Facebook, Google', content_volume:18, video_count:3, performance_confidence:88, urgency:'urgent', start_date:'2026-03-18', marketing_goal:'Capture spring HVAC demand', ai_summary:'Your highest-demand window. Activates full channel mix with seasonal urgency messaging.', end_date:'2026-04-15' },
  { id:'2', campaign_title:'Emergency AC Repair — Early Summer', season:'summer', status:'approved', channels:'Google, Facebook', content_volume:12, video_count:2, performance_confidence:82, urgency:'normal', start_date:'2026-05-01', marketing_goal:'Emergency service visibility', ai_summary:'Hot weather triggers urgent AC repairs. Early positioning wins the summer rush.', end_date:'2026-06-15' },
  { id:'3', campaign_title:'Back-to-Normal Fall Maintenance', season:'fall', status:'suggested', channels:'Instagram, Email, Google', content_volume:10, video_count:1, performance_confidence:74, urgency:'low', start_date:'2026-09-01', marketing_goal:'Pre-winter system preparation', ai_summary:'Homeowners begin thinking about heating systems. Position early for fall tune-ups.', end_date:'2026-10-01' },
  { id:'4', campaign_title:'Energy Savings Authority Series', season:'evergreen', status:'in_production', channels:'YouTube, Website, Instagram', content_volume:8, video_count:4, performance_confidence:91, urgency:'normal', start_date:'2026-03-01', marketing_goal:'Long-term SEO authority', ai_summary:'Educational video series building authority and driving organic search rankings year-round.', end_date:'2026-06-01' },
  { id:'5', campaign_title:'Holiday Home Comfort Promo', season:'holiday', status:'completed', channels:'All Channels', content_volume:20, video_count:3, performance_confidence:79, urgency:'low', start_date:'2025-12-01', marketing_goal:'Holiday service bookings', ai_summary:'Holiday campaign focused on comfort and safety messaging for family gatherings.', end_date:'2026-01-01' },
];

const TIMELINE_ITEMS = [
  { title:'Spring HVAC Tune-Up Push', window:'Mar 18 – Apr 15', season:'spring', urgency:'urgent', status:'suggested' },
  { title:'Seasonal Video Burst — April', window:'Apr 1 – Apr 14', season:'spring', urgency:'normal', status:'approved' },
  { title:'Emergency AC Repair Push', window:'May 1 – Jun 15', season:'summer', urgency:'normal', status:'suggested' },
  { title:'Summer Authority Blog Series', window:'Jun 1 – Aug 1', season:'summer', urgency:'low', status:'suggested' },
  { title:'Back-to-Normal Fall Maintenance', window:'Sep 1 – Oct 1', season:'fall', urgency:'low', status:'suggested' },
];

const PROMOTIONS = [
  { emoji:'🌸', title:'Spring Booking Discount Offer', type:'seasonal', why:'Spring demand peaks mid-March — a limited-time offer drives urgency and bookings.', benefit:'Est. 20–30% increase in April inquiry volume', window:'Now – Mar 20' },
  { emoji:'☀️', title:'Early AC Readiness Special', type:'weather_push', why:'Weather forecasts show early warm spells incoming. First-mover campaigns capture demand.', benefit:'Position ahead of summer competitor rush', window:'Apr 15 – May 1' },
  { emoji:'🏠', title:'Spring Home Maintenance Bundle', type:'local_event', why:'Local home shows happening nearby create co-marketing opportunities.', benefit:'Cross-promotion with home services audience', window:'Apr 1 – Apr 30' },
];

const PERFORMANCE = [
  { label:'Reach Growth', value:'+64%', note:'vs. previous period', color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
  { label:'Engagement Signal', value:'+38%', note:'across all channels', color:'text-blue-600', bg:'bg-blue-50 border-blue-200' },
  { label:'Visibility Impact', value:'+18 pts', note:'search visibility score', color:'text-violet-600', bg:'bg-violet-50 border-violet-200' },
  { label:'Campaign Consistency', value:'94/100', note:'publishing schedule adherence', color:'text-amber-600', bg:'bg-amber-50 border-amber-200' },
];

const DetailModal = ({ campaign, onApprove, onClose }) => {
  const grad = SEASON_GRAD[campaign.season] || SEASON_GRAD.evergreen;
  const emoji = SEASON_EMOJI[campaign.season] || '📣';
  const cfg = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.suggested;
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        <div className={`h-36 bg-gradient-to-br ${grad} flex items-center justify-between px-6 rounded-t-3xl`}>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">{campaign.season} Campaign</p>
            <h3 className="text-xl font-black text-white">{campaign.campaign_title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-5xl">{emoji}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${campaign.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{campaign.urgency}</span>
            <span className="text-xs text-slate-400 ml-auto">{campaign.start_date} → {campaign.end_date}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">AI Campaign Summary</p>
            <p className="text-sm text-slate-700 leading-relaxed">{campaign.ai_summary}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:'Marketing Goal', value:campaign.marketing_goal, icon:'🎯' },
              { label:'Channels', value:campaign.channels, icon:'📡' },
              { label:'Content Pieces', value:`${campaign.content_volume} pieces`, icon:'📄' },
              { label:'Video Campaigns', value:`${campaign.video_count} videos`, icon:'🎬' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
                <span className="block text-base mb-1">{s.icon}</span>
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">{s.label}</p>
                <p className="text-xs font-semibold text-slate-700">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
            <div>
              <p className="text-[9px] text-emerald-600 font-bold uppercase">Performance Confidence</p>
              <p className="text-sm font-black text-emerald-700">{campaign.performance_confidence}% — High confidence</p>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          {showNote ? (
            <div className="space-y-2">
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note, special offer, or timing request..." rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <div className="flex gap-2">
                <button onClick={() => { onApprove(campaign, note); onClose(); }} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold">Approve with Note</button>
                <button onClick={() => setShowNote(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {campaign.status === 'suggested' && (
                <button onClick={() => { onApprove(campaign, ''); onClose(); }} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-sm font-black transition-colors shadow-lg shadow-emerald-900/20">
                  <CheckCircle2 className="w-4 h-4" /> Activate This Campaign
                </button>
              )}
              <button onClick={() => setShowNote(true)} className="flex items-center gap-2 px-5 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-600">
                <Plus className="w-4 h-4" /> Add Special Offer
              </button>
              <button className="flex items-center gap-2 px-5 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-600">
                <Calendar className="w-4 h-4" /> Adjust Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ClientCampaigns() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [promotions, setPromotions] = useState(PROMOTIONS);
  const [detail, setDetail] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');

  const active = campaigns.filter(c => ['in_production','publishing'].includes(c.status)).length;
  const upcoming = campaigns.filter(c => c.status === 'suggested').length;
  const approvalNeeded = campaigns.filter(c => c.status === 'suggested' && c.urgency === 'urgent').length;

  const handleApprove = (campaign) => setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status:'approved' } : c));

  const statusGroups = ['suggested','approved','in_production','publishing','completed'];
  const filtered = activeStatus === 'all' ? campaigns : campaigns.filter(c => c.status === activeStatus);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-40 bg-white/97 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-6xl mx-auto">
          <div className="flex items-stretch overflow-x-auto">
            <div className="flex items-center gap-2 px-4 border-r border-slate-200 shrink-0">
              <Zap className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-black text-slate-800 whitespace-nowrap">Campaign Engine</p>
            </div>
            {[{ l:'Active', v:active, c:'text-emerald-600' },{ l:'Upcoming', v:upcoming, c:'text-violet-600' },{ l:'Approval Needed', v:approvalNeeded, c:approvalNeeded>0?'text-red-500':'text-slate-400' }].map(t => (
              <div key={t.l} className="flex flex-col px-4 py-1.5 border-r border-slate-200 min-w-[80px]">
                <span className="text-[9px] text-slate-400 font-medium uppercase">{t.l}</span>
                <span className={`text-base font-black ${t.c}`}>{t.v}</span>
              </div>
            ))}
            <div className="flex flex-col px-4 py-1.5 min-w-[160px]">
              <span className="text-[9px] text-slate-400 font-medium uppercase">Suggested Next</span>
              <span className="text-xs font-bold text-emerald-600">Spring Tune-Up Push</span>
            </div>
          </div>
          <button onClick={() => handleApprove(CAMPAIGNS.find(c => c.urgency==='urgent'&&c.status==='suggested')||CAMPAIGNS[0])}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve Plan
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${SEASON_GRAD[HERO.season]} rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden`}>
          <div className="absolute top-4 right-6 text-8xl opacity-20 select-none">{SEASON_EMOJI[HERO.season]}</div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest">AI-Recommended Campaign</span>
              <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">Urgent</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">{HERO.campaign_title}</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-4">{HERO.ai_summary}</p>
            <div className="flex flex-wrap gap-3 mb-5 text-sm">
              {[{ icon:Calendar, label:`${HERO.start_date} → ${HERO.end_date}` },{ icon:Zap, label:`${HERO.content_volume} content pieces` },{ icon:Play, label:`${HERO.video_count} video campaigns` },{ icon:TrendingUp, label:`${HERO.performance_confidence}% confidence` }].map(s => (
                <div key={s.label} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => handleApprove(HERO)} className="flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-700 rounded-2xl text-sm font-black hover:bg-emerald-50 transition-all shadow-xl">
                <CheckCircle2 className="w-4 h-4" /> Activate This Campaign
              </button>
              <button onClick={() => setDetail(HERO)} className="flex items-center gap-2 px-6 py-3.5 bg-white/15 border border-white/20 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Your 90-Day Campaign Roadmap</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 via-blue-400 to-slate-200 rounded-full" />
            <div className="space-y-3">
              {TIMELINE_ITEMS.map((item, i) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.suggested;
                return (
                  <div key={i} className={`relative flex items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all ${item.urgency==='urgent'?'border-red-200':'border-slate-200'}`}>
                    <div className="absolute -left-5 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-base shadow-sm">{SEASON_EMOJI[item.season]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{item.window}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.urgency==='urgent' && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Urgent</span>}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campaign Grid */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-black text-slate-800">All Campaigns</h2>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[{ v:'all', l:'All' },...statusGroups.map(s => ({ v:s, l:STATUS_CONFIG[s]?.label||s }))].map(({ v, l }) => (
                <button key={v} onClick={() => setActiveStatus(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${activeStatus===v?'bg-slate-800 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => {
              const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.suggested;
              return (
                <div key={c.id} onClick={() => setDetail(c)} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className={`h-24 bg-gradient-to-br ${SEASON_GRAD[c.season]} flex items-center justify-between px-5`}>
                    <div>
                      <p className="text-white/70 text-[10px] font-bold uppercase">{c.season}</p>
                      <p className="text-white font-black text-sm">{c.campaign_title}</p>
                    </div>
                    <span className="text-3xl">{SEASON_EMOJI[c.season]}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      <span className="ml-auto text-[9px] text-slate-400">{c.start_date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{c.marketing_goal}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>📄 {c.content_volume} pieces · 🎬 {c.video_count} videos</span>
                      <span className="text-emerald-600 font-bold">{c.performance_confidence}% conf.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Campaign Performance Highlights</h2>
          <p className="text-sm text-slate-500 mb-4">How your campaigns are building your brand presence.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PERFORMANCE.map(p => (
              <div key={p.label} className={`border rounded-2xl p-4 ${p.bg}`}>
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">{p.label}</p>
                <p className={`text-2xl font-black ${p.color}`}>{p.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-4 bg-white border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-600 leading-relaxed"><span className="font-bold text-slate-800">Your spring push campaign </span>helped increase awareness of your seasonal services across all active channels.</p>
          </div>
        </div>

        {/* Promotions */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Suggested Promotions</h2>
          <p className="text-sm text-slate-500 mb-4">AI-identified promotional windows for your business.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {promotions.filter(p => p.status === 'new').map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{p.emoji}</span>
                <p className="text-sm font-black text-slate-800 mb-1">{p.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{p.why}</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3">
                  <p className="text-[10px] text-emerald-700 font-semibold">{p.benefit}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{p.window}</span>
                  <button onClick={() => setPromotions(prev => prev.map((pp, j) => j===i ? { ...pp, status:'launched' } : pp))}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">Launch <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Video */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-56 h-32 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-white/15 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-500/80 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Campaign Strategy Video</p>
              <p className="text-xl font-black text-white mb-2">Why This Campaign Matters Now</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">"Spring is when homeowners decide who they'll trust for their seasonal HVAC needs. This campaign positions you early..."</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-bold text-white transition-colors">
                <Play className="w-4 h-4" /> Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {detail && <DetailModal campaign={detail} onApprove={handleApprove} onClose={() => setDetail(null)} />}
    </div>
  );
}