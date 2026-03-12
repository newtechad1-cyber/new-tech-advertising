import React, { useState } from 'react';
import { ChevronRight, ChevronDown, TrendingUp, AlertTriangle, Zap, Users, RefreshCw, X } from 'lucide-react';

const ENTERPRISE_CLIENTS = [
  {
    id:'e1', name:'Arctic Climate Group', industry:'HVAC', mrr:5982, tier:'enterprise', health:82, status:'active',
    regions: [
      { name:'North Chicago', locations:[
        { name:'Downtown Chicago', score:87, activity:'high', revenue:'$1,997' },
        { name:'Lincoln Park', score:79, activity:'high', revenue:'$1,997' },
        { name:'Evanston', score:71, activity:'medium', revenue:'$997' },
      ]},
      { name:'West Chicago', locations:[
        { name:'Oak Park', score:64, activity:'medium', revenue:'$997' },
        { name:'Naperville', score:68, activity:'medium', revenue:'$997' },
      ]},
      { name:'Northwest', locations:[
        { name:'Schaumburg', score:41, activity:'low', revenue:'$997' },
      ]},
    ]
  },
  {
    id:'e2', name:'Summit Dental Group', industry:'Dental', mrr:3991, tier:'authority', health:74, status:'active',
    regions:[
      { name:'Metro Chicago', locations:[
        { name:'River North', score:75, activity:'high', revenue:'$997' },
        { name:'Wicker Park', score:62, activity:'medium', revenue:'$997' },
        { name:'Hyde Park', score:58, activity:'medium', revenue:'$997' },
        { name:'Lakeview', score:81, activity:'high', revenue:'$997' },
      ]},
    ]
  },
  {
    id:'e3', name:'FastTrack Auto Group', industry:'Auto', mrr:2991, tier:'growth', health:61, status:'at_risk',
    regions:[
      { name:'South Suburbs', locations:[
        { name:'Orland Park', score:55, activity:'medium', revenue:'$997' },
        { name:'Tinley Park', score:48, activity:'low', revenue:'$997' },
        { name:'Joliet', score:44, activity:'low', revenue:'$997' },
      ]},
    ]
  },
];

const UPSELL_OPPS = [
  { client:'Arctic Climate Group', type:'premium_video', headline:'Roll out premium video to all 6 locations', projected_mrr:+2400, confidence:88, strategy:'Upsell current 3-video bundle to premium 6-video suite at each location' },
  { client:'Summit Dental Group', type:'authority_pack', headline:'Authority Pack expansion for all 4 locations', projected_mrr:+1600, confidence:81, strategy:'Dental authority content cluster driving 2× organic traffic at comparable clients' },
  { client:'FastTrack Auto Group', type:'multi_year_contract', headline:'Lock in annual contract before at-risk churn', projected_mrr:+800, confidence:72, strategy:'Offer 15% annual discount to lock in 12-month commitment and stabilize account' },
];

const RISK_FLAGS = [
  { client:'FastTrack Auto Group', location:'Tinley Park', type:'low_content', severity:'critical', action:'Activate emergency content sprint' },
  { client:'FastTrack Auto Group', location:'Joliet', type:'campaign_gap', severity:'critical', action:'Assign to next regional campaign batch' },
  { client:'Arctic Climate Group', location:'Schaumburg', type:'visibility_drop', severity:'high', action:'Launch Northwest authority campaign' },
  { client:'Summit Dental Group', location:'Hyde Park', type:'engagement_decline', severity:'medium', action:'Refresh content strategy for this location' },
];

const TIER_BADGE = { enterprise:'bg-violet-100 text-violet-700', authority:'bg-blue-100 text-blue-700', growth:'bg-emerald-100 text-emerald-700', starter:'bg-slate-100 text-slate-600' };
const SEV_CONFIG = { critical:'border-red-200 bg-red-50', high:'border-orange-200 bg-orange-50', medium:'border-amber-200 bg-amber-50' };

export default function AdminEnterpriseAccounts() {
  const [expanded, setExpanded] = useState({ e1: true });
  const [activeTab, setActiveTab] = useState('accounts');

  const toggleClient = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const totalLocations = ENTERPRISE_CLIENTS.reduce((s, c) => s + c.regions.reduce((rs, r) => rs + r.locations.length, 0), 0);
  const totalMRR = ENTERPRISE_CLIENTS.reduce((s, c) => s + c.mrr, 0);
  const atRisk = ENTERPRISE_CLIENTS.filter(c => c.status === 'at_risk').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Enterprise Account Manager</h1>
            <p className="text-slate-500 text-sm mt-1">Manage multi-location clients, upsell opportunities, and risk signals</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors">
              <Zap className="w-4 h-4" /> Generate Regional Campaign
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Enterprise Clients', value:ENTERPRISE_CLIENTS.length, icon:Users, color:'text-slate-800' },
            { label:'Locations Managed', value:totalLocations, icon:TrendingUp, color:'text-blue-600' },
            { label:'Enterprise MRR', value:`$${totalMRR.toLocaleString()}`, icon:TrendingUp, color:'text-emerald-600' },
            { label:'At-Risk Clients', value:atRisk, icon:AlertTriangle, color:atRisk>0?'text-red-500':'text-slate-400' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">{s.label}</p>
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-5 border-b border-slate-200">
          {[['accounts','Account Hierarchy'],['upsell','Upsell Intelligence'],['risk','Risk Monitor']].map(([v,l]) => (
            <button key={v} onClick={() => setActiveTab(v)}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab===v?'border-blue-500 text-blue-600':'border-transparent text-slate-500 hover:text-slate-700'}`}>{l}</button>
          ))}
        </div>

        {/* Account Hierarchy */}
        {activeTab === 'accounts' && (
          <div className="space-y-3">
            {ENTERPRISE_CLIENTS.map(client => (
              <div key={client.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <button onClick={() => toggleClient(client.id)} className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {expanded[client.id] ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                    <p className="text-sm font-black text-slate-800">{client.name}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[client.tier]}`}>{client.tier}</span>
                    {client.status === 'at_risk' && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">At Risk</span>}
                  </div>
                  <div className="flex items-center gap-6 text-right flex-shrink-0">
                    <div className="hidden sm:block">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">MRR</p>
                      <p className="text-sm font-black text-emerald-600">${client.mrr.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Health</p>
                      <p className={`text-sm font-black ${client.health > 75 ? 'text-emerald-600' : client.health > 60 ? 'text-amber-600' : 'text-red-600'}`}>{client.health}/100</p>
                    </div>
                  </div>
                </button>

                {expanded[client.id] && (
                  <div className="border-t border-slate-100 px-5 pb-4 pt-3">
                    {client.regions.map(region => (
                      <div key={region.name} className="mb-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <span className="w-4 h-px bg-slate-200 inline-block" /> {region.name} Region
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ml-4">
                          {region.locations.map(loc => (
                            <div key={loc.name} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${loc.score > 70 ? 'bg-emerald-400' : loc.score > 55 ? 'bg-amber-400' : 'bg-red-400'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700">{loc.name}</p>
                                <p className="text-[9px] text-slate-400">Score: {loc.score} · {loc.activity} activity</p>
                              </div>
                              <p className="text-xs font-bold text-slate-600 flex-shrink-0">{loc.revenue}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upsell */}
        {activeTab === 'upsell' && (
          <div className="space-y-4">
            {UPSELL_OPPS.map((opp, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{opp.client}</p>
                    <p className="text-sm font-black text-slate-800 mb-1">{opp.headline}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{opp.strategy}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-emerald-600">+${opp.projected_mrr.toLocaleString()}/mo MRR</span>
                      <span className="text-[10px] text-slate-400">{opp.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors">Propose</button>
                    <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors">Dismiss</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk */}
        {activeTab === 'risk' && (
          <div className="space-y-3">
            {RISK_FLAGS.map((r, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 border rounded-2xl ${SEV_CONFIG[r.severity]}`}>
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${r.severity==='critical'?'text-red-500':r.severity==='high'?'text-orange-500':'text-amber-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{r.client} — {r.location}</p>
                  <p className="text-[11px] text-slate-500">{r.type.replace(/_/g,' ')}</p>
                </div>
                <button className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex-shrink-0 transition-colors">{r.action}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}