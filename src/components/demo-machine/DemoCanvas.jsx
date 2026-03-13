import React, { useState } from 'react';
import { TrendingUp, Globe, Zap, BarChart2, ArrowRight, Star, Eye, Users, Activity } from 'lucide-react';

const MODULES = [
  { id: 'visibility', label: 'Market Visibility', icon: Eye },
  { id: 'website', label: 'Authority Website', icon: Globe },
  { id: 'content', label: 'Content Automation', icon: Zap },
  { id: 'roi', label: 'ROI Dashboard', icon: BarChart2 },
  { id: 'before_after', label: 'Before vs After', icon: ArrowRight },
];

function VisibilityModule({ industry }) {
  const ind = industry || 'HVAC';
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Google Visibility Score', before: '12%', after: '84%', color: '#3b82f6' },
          { label: 'Monthly Impressions', before: '340', after: '18,400', color: '#10b981' },
          { label: 'Local Authority Rank', before: '#47', after: '#3', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-3">{m.label}</p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <p className="text-red-400 text-lg font-bold">{m.before}</p>
                <p className="text-slate-600 text-xs">Before</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.after}</p>
                <p className="text-slate-500 text-xs">After NTA</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <p className="text-white font-semibold text-sm mb-3">Local {ind.replace('_', ' ')} Authority Map</p>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 49 }, (_, i) => {
            const rank = [1,2,1,3,1,2,1,2,3,2,1,2,3,2,1,3,1,2,1,3,2,1,2,1,3,2,1,2,3,1,2,1,2,3,1,2,1,2,3,2,1,2,1,3,2,1,3,2,1][i];
            const colors = { 1: 'bg-green-500', 2: 'bg-yellow-500', 3: 'bg-orange-500' };
            return <div key={i} className={`h-6 rounded text-xs flex items-center justify-center text-black font-bold ${colors[rank]}`}>{rank}</div>;
          })}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500 inline-block" /> Rank 1–3</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500 inline-block" /> Rank 4–6</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500 inline-block" /> Rank 7+</span>
        </div>
      </div>
    </div>
  );
}

function WebsiteModule({ company }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="bg-slate-700/60 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" /></div>
        <div className="flex-1 bg-slate-800 rounded px-3 py-1 text-xs text-slate-400 text-center">{company ? company.toLowerCase().replace(/\s+/g, '') : 'yourbusiness'}.ntaauthority.com</div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-12 bg-gradient-to-r from-blue-900/60 to-slate-800 rounded-lg flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/40" />
            <div className="space-y-1"><div className="h-2 w-24 bg-white/20 rounded" /><div className="h-1.5 w-16 bg-white/10 rounded" /></div>
          </div>
          <div className="flex gap-4">{['Home','Services','About','Contact'].map(l => <span key={l} className="text-xs text-white/60">{l}</span>)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-lg p-6 text-center">
          <p className="text-white/80 text-xs mb-1 uppercase tracking-widest">The Local Authority in</p>
          <p className="text-white text-xl font-bold mb-2">HVAC Services</p>
          <div className="flex items-center justify-center gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}</div>
          <div className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-white text-xs font-bold">Get Free Estimate →</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Content', 'Videos', 'Reviews'].map(s => (
            <div key={s} className="bg-slate-800/80 rounded-lg p-3 text-center">
              <div className="h-12 bg-slate-700/40 rounded mb-2" />
              <p className="text-slate-400 text-xs">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentModule() {
  const posts = [
    { type: 'Blog', title: '5 Signs Your HVAC Needs Service This Winter', status: 'Published', channel: 'Website + LinkedIn' },
    { type: 'Social', title: 'Before & After: AC Replacement in Austin', status: 'Scheduled', channel: 'FB + IG' },
    { type: 'Video', title: 'Why Regular Maintenance Saves You Thousands', status: 'In Production', channel: 'YouTube + TV' },
    { type: 'Review', title: 'Customer Spotlight: 5-Star Experience', status: 'Live', channel: 'Google + Web' },
    { type: 'Email', title: 'Spring HVAC Tune-Up Special – Limited Slots', status: 'Sending Today', channel: 'Email List' },
  ];
  const colors = { Blog: '#3b82f6', Social: '#10b981', Video: '#f59e0b', Review: '#8b5cf6', Email: '#ec4899' };
  const statusColors = { Published: '#10b981', Scheduled: '#f59e0b', 'In Production': '#3b82f6', Live: '#10b981', 'Sending Today': '#ec4899' };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[{ v: '63', l: 'Pieces This Month' }, { v: '8', l: 'Channels Active' }, { v: '100%', l: 'Managed For You' }, { v: '4.8', l: 'Approval Rating' }].map((s, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-white text-2xl font-bold">{s.v}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
      {posts.map((p, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg">
          <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: `${colors[p.type]}22`, color: colors[p.type] }}>{p.type}</span>
          <p className="flex-1 text-white text-xs font-medium truncate">{p.title}</p>
          <span className="text-xs" style={{ color: statusColors[p.status] }}>{p.status}</span>
          <span className="text-slate-600 text-xs">{p.channel}</span>
        </div>
      ))}
    </div>
  );
}

function ROIModule() {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const leads = [4, 7, 9, 14, 18, 24];
  const maxL = Math.max(...leads);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'New Leads (Mar)', value: '24', change: '+33%', color: '#10b981' },
          { label: 'Revenue Attributed', value: '$18,400', change: '+$4,200', color: '#3b82f6' },
          { label: 'Cost Per Lead', value: '$62', change: '-18%', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-2">{m.label}</p>
            <p className="text-white text-2xl font-bold">{m.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: m.color }}>{m.change} vs last month</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <p className="text-white font-semibold text-sm mb-4">Monthly Lead Growth Trend</p>
        <div className="flex items-end gap-3 h-28">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-white text-xs font-bold">{leads[i]}</span>
              <div
                className="w-full rounded-t-md transition-all duration-700"
                style={{ height: `${(leads[i] / maxL) * 80}px`, background: i === months.length - 1 ? '#3b82f6' : '#1e3a5f' }}
              />
              <span className="text-slate-500 text-xs">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterModule({ company }) {
  const rows = [
    { metric: 'Monthly Content', before: '0–2 posts', after: '63+ pieces', win: true },
    { metric: 'Google Rank (Primary KW)', before: 'Page 4+', after: 'Top 3', win: true },
    { metric: 'Monthly New Leads', before: '3–5 referrals', after: '20–30 inbound', win: true },
    { metric: 'Streaming TV Presence', before: 'None', after: 'Active CTV Ads', win: true },
    { metric: 'Time on Marketing', before: '8–12 hrs/week', after: '< 1 hr/week', win: true },
    { metric: 'Online Reputation', before: '8 reviews', after: '40+ reviews', win: true },
    { metric: 'ROI Visibility', before: 'Unknown', after: 'Monthly Report', win: true },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden border border-slate-700">
        <div className="bg-red-950/40 px-4 py-2 text-center text-red-400 font-bold text-sm border-r border-slate-700">Before NTA</div>
        <div className="bg-green-950/40 px-4 py-2 text-center text-green-400 font-bold text-sm">After NTA</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-3 gap-0 bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden text-sm">
          <div className="bg-red-950/20 px-3 py-2.5 text-red-400 text-xs">{r.before}</div>
          <div className="px-3 py-2.5 text-slate-400 text-xs text-center border-x border-slate-700/50 font-medium">{r.metric}</div>
          <div className="bg-green-950/20 px-3 py-2.5 text-green-400 text-xs text-right font-semibold">{r.after}</div>
        </div>
      ))}
    </div>
  );
}

export default function DemoCanvas({ opportunity, activeModule, setActiveModule }) {
  const renderModule = () => {
    switch (activeModule) {
      case 'visibility': return <VisibilityModule industry={opportunity?.industry} />;
      case 'website': return <WebsiteModule company={opportunity?.company_name} />;
      case 'content': return <ContentModule />;
      case 'roi': return <ROIModule />;
      case 'before_after': return <BeforeAfterModule company={opportunity?.company_name} />;
      default: return <VisibilityModule industry={opportunity?.industry} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Module tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/40">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeModule === m.id
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto p-5">
        {renderModule()}
      </div>
    </div>
  );
}