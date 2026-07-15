import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Activity, FileText, BarChart3, Users, Heart, Video } from 'lucide-react';

function TikTokStatsCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tiktok-stats'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getTikTokStats', {});
      if (res.data.error) throw new Error(res.data.error);
      return res.data.data?.user || null;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-pink-500/10 rounded-xl">
            <Video className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-white">TikTok Profile</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-24 text-center">
          <p className="text-slate-500 text-sm">TikTok connection pending or unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {data.avatar_url ? (
            <img src={data.avatar_url} alt="TikTok Avatar" className="w-12 h-12 rounded-full border-2 border-slate-800" />
          ) : (
            <div className="p-2.5 bg-pink-500/10 rounded-xl">
              <Video className="w-6 h-6 text-pink-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-white">{data.display_name || 'TikTok Profile'}</h3>
            {data.profile_deep_link && (
              <a href={data.profile_deep_link} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:text-pink-300">
                View Profile &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Followers</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.follower_count?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Likes</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.likes_count?.toLocaleString() || '0'}
          </div>
        </div>
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Video className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Videos</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.video_count?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'info@newtechadvertising.com';
  
  const [viewAsClientId, setViewAsClientId] = useState(user?.client_id || '');

  const { data: allClients } = useQuery({
    queryKey: ['all-clients-dropdown'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getClientCompanies', {});
      return res.data.companies;
    },
    enabled: !!isAdmin
  });

  const effectiveClientId = isAdmin ? viewAsClientId : user?.client_id;

  const { data: clientCompany } = useQuery({
    queryKey: ['client-company', effectiveClientId],
    queryFn: async () => {
      if (!effectiveClientId) return null;
      const res = await base44.functions.invoke('getClientCompanies', {});
      return res.data.companies?.find(c => c.id === effectiveClientId) || null;
    },
    enabled: !!effectiveClientId
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Client Portal</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || user?.email}</p>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 shadow-xl">
              <span className="text-sm text-slate-400 font-medium whitespace-nowrap pl-2">View as:</span>
              <Select value={viewAsClientId} onValueChange={setViewAsClientId}>
                <SelectTrigger className="w-[240px] bg-slate-800 border-slate-700 text-white rounded-lg">
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>-- None Selected --</SelectItem>
                  {allClients?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.business_name || 'Unnamed Client'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!effectiveClientId ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center shadow-xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Company Linked</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              {isAdmin 
                ? "Select a client from the dropdown above to preview their customized dashboard." 
                : "Your account has not been linked to a company profile yet. Please contact your account manager to complete setup."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Company Profile</h3>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Name</div>
                  <div className="text-base text-white">{clientCompany?.business_name || 'Loading...'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Website</div>
                  <div className="text-base text-blue-400">{clientCompany?.website || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Status</div>
                  <div className="inline-flex px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md font-medium text-sm">
                    {clientCompany?.status || 'Active'}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Active Projects</h3>
              </div>
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-slate-500 text-sm">No active campaigns to display right now.</p>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Billing & Invoices</h3>
              </div>
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-slate-500 text-sm">Account is up to date.</p>
              </div>
            </div>

            {/* Reports */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-500/10 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Performance Reports</h3>
              </div>
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                <BarChart3 className="w-8 h-8 text-slate-700 mb-3" />
                <p className="text-slate-500 font-medium">Analytics integration pending...</p>
              </div>
            </div>

            <TikTokStatsCard />
          </div>
        )}
      </div>
    </div>
  );
}