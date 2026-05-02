import React, { useState } from 'react';
import { Globe, FileText, Video, Share2, Users, BarChart2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const STATUS_COLORS_ASSET = {
  draft: 'text-slate-500',
  ready: 'text-blue-400',
  approved: 'text-emerald-400',
  scheduled: 'text-purple-400',
  published: 'text-teal-400',
};

function RelatedSection({ icon: Icon, label, count, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-white text-sm font-semibold">{label}</span>
          <span className="text-xs font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">{count}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
      </button>
      {open && (
        <div className="bg-slate-900/60 border-t border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}

function EmptyRow({ label }) {
  return <p className="text-slate-600 text-xs px-4 py-3 italic">No {label} yet.</p>;
}

export default function CampaignRelatedItems({ data, campaignId }) {
  const { seoPages = [], assets = [], videos = [], socialPosts = [], leads = [], reports = [] } = data;

  // Separate assets by type
  const landingPages = assets.filter(a => a.asset_type === 'landing_page');
  const adCopy = assets.filter(a => a.asset_type === 'ad_copy');
  const contentAssets = assets.filter(a => !['landing_page', 'ad_copy'].includes(a.asset_type));

  return (
    <div className="space-y-2">

      {/* SEO Pages */}
      <RelatedSection icon={Globe} label="SEO Pages" count={seoPages.length} color="text-purple-400">
        {seoPages.length === 0 ? <EmptyRow label="SEO pages" /> : (
          <div className="divide-y divide-slate-800">
            {seoPages.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-slate-300 text-xs font-semibold">{p.page_title}</p>
                  {p.target_keyword && <p className="text-slate-500 text-xs mt-0.5">🔑 {p.target_keyword}</p>}
                </div>
                <span className={`text-xs font-medium ${STATUS_COLORS_ASSET[p.status] || 'text-slate-500'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

      {/* Content Assets (Landing Pages + Ad Copy + Other) */}
      <RelatedSection icon={FileText} label="Content Assets" count={assets.length} color="text-blue-400">
        {assets.length === 0 ? <EmptyRow label="content assets" /> : (
          <div className="divide-y divide-slate-800">
            {assets.map(a => (
              <div key={a.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-slate-300 text-xs font-semibold truncate">{a.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-600 text-xs">{a.asset_type?.replace('_', ' ')}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-600 text-xs">{a.platform}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${STATUS_COLORS_ASSET[a.status] || 'text-slate-500'}`}>{a.status}</span>
                  {a.approval_status && a.approval_status !== 'not_needed' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      a.approval_status === 'approved' ? 'bg-emerald-900/40 text-emerald-400' :
                      a.approval_status === 'rejected' ? 'bg-red-900/40 text-red-400' :
                      'bg-yellow-900/40 text-yellow-400'
                    }`}>{a.approval_status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

      {/* Video Scripts */}
      <RelatedSection icon={Video} label="Video Scripts" count={videos.length} color="text-rose-400">
        {videos.length === 0 ? <EmptyRow label="video scripts" /> : (
          <div className="divide-y divide-slate-800">
            {videos.map(v => (
              <div key={v.id} className="flex items-center justify-between px-4 py-2.5">
                <p className="text-slate-300 text-xs font-semibold">{v.title}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${STATUS_COLORS_ASSET[v.status] || 'text-slate-500'}`}>{v.status}</span>
                  {v.heygen_status !== 'not_submitted' && (
                    <span className="text-xs text-purple-400">HeyGen: {v.heygen_status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

      {/* Social Queue */}
      <RelatedSection icon={Share2} label="Social Queue" count={socialPosts.length} color="text-teal-400" defaultOpen={false}>
        {socialPosts.length === 0 ? <EmptyRow label="social posts" /> : (
          <div className="divide-y divide-slate-800">
            {socialPosts.map(p => (
              <div key={p.id} className="flex items-start justify-between px-4 py-2.5 gap-3">
                <p className="text-slate-400 text-xs line-clamp-2 flex-1">{p.post_text}</p>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-medium ${STATUS_COLORS_ASSET[p.status] || 'text-slate-500'}`}>{p.status}</span>
                  <span className="text-slate-600 text-xs">{p.platform}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

      {/* Leads */}
      <RelatedSection icon={Users} label="Leads" count={leads.length} color="text-orange-400" defaultOpen={false}>
        {leads.length === 0 ? <EmptyRow label="leads" /> : (
          <div className="divide-y divide-slate-800">
            {leads.map(l => (
              <div key={l.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-slate-300 text-xs font-semibold">{l.name || 'Unknown'}</p>
                  {l.service_needed && <p className="text-slate-500 text-xs">{l.service_needed}</p>}
                </div>
                <span className={`text-xs font-medium ${
                  l.status === 'new' ? 'text-blue-400' :
                  l.status === 'qualified' ? 'text-emerald-400' :
                  l.status === 'booked' ? 'text-green-400' :
                  'text-slate-500'
                }`}>{l.status}</span>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

      {/* Reports */}
      <RelatedSection icon={BarChart2} label="Reports" count={reports.length} color="text-sky-400" defaultOpen={false}>
        {reports.length === 0 ? <EmptyRow label="reports" /> : (
          <div className="divide-y divide-slate-800">
            {reports.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-slate-300 text-xs font-semibold">{r.report_month}</p>
                  {r.summary && <p className="text-slate-500 text-xs line-clamp-1">{r.summary}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-400 font-semibold">{r.leads_generated} leads</p>
                  <p className="text-xs text-slate-500">{r.pages_created} pages</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </RelatedSection>

    </div>
  );
}