import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Video, Share2, Globe, TrendingUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-slate-400 text-xs">{label}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ContentEngineStats() {
  const { data: blogs = [] } = useQuery({
    queryKey: ['cc-blogs'],
    queryFn: () => base44.entities.BlogPost.list('-created_date', 200)
  });
  const { data: assets = [] } = useQuery({
    queryKey: ['cc-assets'],
    queryFn: () => base44.entities.ContentAsset.list('-created_date', 200)
  });
  const { data: packs = [] } = useQuery({
    queryKey: ['cc-packs'],
    queryFn: () => base44.entities.AuthorityPack.list()
  });
  const { data: cases = [] } = useQuery({
    queryKey: ['cc-cases'],
    queryFn: () => base44.entities.CaseStudy.list()
  });
  const { data: socialPosts = [] } = useQuery({
    queryKey: ['cc-social'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 200)
  });
  const { data: locationPages = [] } = useQuery({
    queryKey: ['cc-location-pages'],
    queryFn: () => base44.entities.LocationPage.filter({ status: 'published' }, '-created_date', 100)
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentBlogs = blogs.filter(b => new Date(b.created_date) > sevenDaysAgo).length;
  const recentSocial = socialPosts.filter(s => new Date(s.created_date) > sevenDaysAgo).length;
  const completedAssets = assets.filter(a => a.status === 'complete').length;
  const publishedCases = cases.filter(c => c.status === 'published').length;

  const stats = [
    { label: 'Blog Articles This Week', value: recentBlogs, icon: FileText, color: 'bg-rose-600', sub: `${blogs.length} total` },
    { label: 'Content Assets Generated', value: completedAssets, icon: Video, color: 'bg-purple-600', sub: `${assets.length} total` },
    { label: 'Social Posts This Week', value: recentSocial, icon: Share2, color: 'bg-pink-600', sub: `${socialPosts.length} total` },
    { label: 'Authority Pages Published', value: locationPages.length, icon: Globe, color: 'bg-emerald-600', sub: `${packs.filter(p => p.status === 'active').length} active packs` },
    { label: 'Case Studies Published', value: publishedCases, icon: TrendingUp, color: 'bg-amber-600', sub: `${cases.length} total` },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Content Engine Activity</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
    </div>
  );
}