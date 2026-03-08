import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import ClientGuard from '@/components/auth/ClientGuard';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, FileText, Zap, BarChart2, Share2, Video,
  CheckCircle, Clock, ArrowRight, LogOut, Mail, Phone,
  TrendingUp, Calendar, Star
} from 'lucide-react';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png';

function MetricCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-500 text-sm">{label}</p>
      {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (!u) { base44.auth.redirectToLogin(); return; }
        // If admin accidentally hits this page, send them to command center
        if (u.role === 'admin') {
          window.location.href = createPageUrl('AdminCommandCenter');
          return;
        }
        setUser(u);
      } catch {
        base44.auth.redirectToLogin();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load client's trial account by email
  const { data: trialAccounts = [] } = useQuery({
    queryKey: ['client-trial', user?.email],
    queryFn: () => base44.entities.TrialAccount.filter({ email: user.email }),
    enabled: !!user?.email
  });
  const trial = trialAccounts[0];

  // Load client's proposals (filtered by their email via created_by)
  const { data: proposals = [] } = useQuery({
    queryKey: ['client-proposals', user?.email],
    queryFn: () => base44.entities.Proposal.list('-created_date', 10),
    enabled: !!user
  });

  // Load social posts for this client
  const { data: socialPosts = [] } = useQuery({
    queryKey: ['client-posts', user?.email],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 20),
    enabled: !!user
  });

  // Load leads attributed to client
  const { data: leads = [] } = useQuery({
    queryKey: ['client-leads', user?.email],
    queryFn: () => base44.entities.Lead.list('-created_date', 50),
    enabled: !!user
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const recentPosts = socialPosts.filter(p => new Date(p.created_date) > thirtyDaysAgo).length;
  const recentLeads = leads.filter(l => new Date(l.created_date) > thirtyDaysAgo).length;
  const activeProposals = proposals.filter(p => ['sent', 'viewed'].includes(p.status));

  const STATUS_BADGE = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-violet-100 text-violet-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    expired: 'bg-orange-100 text-orange-700',
  };

  const handleLogout = () => base44.auth.logout();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  const companyName = trial?.name || user?.full_name || 'Your Company';

  return (
    <ClientGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Top Nav */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <img src={LOGO} alt="NTA" className="h-8 w-auto" />
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
              <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Dashboard</span>
              <a href={createPageUrl('ScheduledQueue')} className="hover:text-slate-800">Content</a>
              <a href={createPageUrl('Dashboard')} className="hover:text-slate-800">Proposals</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{companyName}</p>
              </div>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Hero Welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-7 text-white">
            <p className="text-blue-100 text-sm mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold mb-1">{companyName}</h1>
            <p className="text-blue-100 text-sm">
              {trial?.industry && `${trial.industry} · `}
              {trial?.location_city && `${trial.location_city}, ${trial?.location_state}`}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {trial?.trial_status && (
                <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium capitalize">
                  Status: {trial.trial_status}
                </span>
              )}
              {trial?.primary_goal && (
                <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium capitalize">
                  Goal: {trial.primary_goal?.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Users} label="New Leads (30 days)" value={recentLeads} color="bg-blue-500" />
            <MetricCard icon={Share2} label="Posts Published (30 days)" value={recentPosts} color="bg-pink-500" />
            <MetricCard icon={FileText} label="Active Proposals" value={activeProposals.length} color="bg-violet-500" />
            <MetricCard icon={TrendingUp} label="Total Leads" value={leads.length} color="bg-emerald-500" sub="All time" />
          </div>

          {/* Proposals */}
          {proposals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-500" />
                  <h2 className="font-semibold text-slate-800">Your Proposals</h2>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {proposals.slice(0, 5).map(p => (
                  <div key={p.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.service_type?.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE[p.status] || 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                      {p.monthly_fee && (
                        <p className="text-xs text-slate-400 mt-1">${p.monthly_fee}/mo</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Content */}
          {socialPosts.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-500" />
                  <h2 className="font-semibold text-slate-800">Recent Content</h2>
                </div>
                <a href={createPageUrl('ScheduledQueue')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <div className="divide-y divide-slate-100">
                {socialPosts.slice(0, 5).map(post => (
                  <div key={post.id} className="px-5 py-4 flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      post.platform === 'facebook' ? 'bg-blue-100' :
                      post.platform === 'instagram' ? 'bg-pink-100' :
                      post.platform === 'linkedin' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-2">{post.caption?.slice(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 capitalize">{post.platform}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          post.scheduling_status === 'published' ? 'bg-green-100 text-green-700' :
                          post.scheduling_status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>{post.scheduling_status || 'draft'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support / Next Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Schedule a Call
              </h3>
              <p className="text-sm text-slate-500 mb-4">Want to review your campaigns or discuss strategy?</p>
              <a href="https://calendly.com" target="_blank" rel="noreferrer">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">Book a Strategy Call</Button>
              </a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-500" /> Contact Support
              </h3>
              <p className="text-sm text-slate-500 mb-4">Have a question or need changes to your content?</p>
              <a href="mailto:support@newtechadvertising.com">
                <Button size="sm" variant="outline" className="w-full border-slate-300">Email Our Team</Button>
              </a>
            </div>
          </div>

          {/* Empty state if no data */}
          {proposals.length === 0 && socialPosts.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <Zap className="w-10 h-10 text-violet-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700 mb-2">Your dashboard is being set up</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Your content, campaigns, and reports will appear here once your account is configured by our team.
              </p>
            </div>
          )}
        </main>
      </div>
    </ClientGuard>
  );
}