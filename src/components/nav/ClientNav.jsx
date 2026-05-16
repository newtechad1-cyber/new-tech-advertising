import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, CheckSquare, Calendar, FileText, BarChart, Settings, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ClientNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const user = await base44.auth.me();
        if (!user?.company_id) return;
        
        // Fetch pending items across the 3 models
        const [assets, posts, videos] = await Promise.all([
          base44.entities.NTAContentAsset.filter({ client_id: user.company_id, approval_status: 'Pending' }),
          base44.entities.SocialPostQueue.filter({ client_id: user.company_id, publish_status: 'pending' }),
          base44.entities.VideoRequests.filter({ client_id: user.company_id, approval_status: 'Pending' })
        ]);
        
        setPendingCount(assets.length + posts.length + videos.length);
      } catch (e) {
        console.error('Failed to fetch pending approvals for nav badge', e);
      }
    };
    fetchPending();
  }, [currentPath]); // re-run when path changes to keep badge somewhat fresh

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, page: 'ClientDashboard' },
    { label: 'Approvals', icon: CheckSquare, page: 'ClientApprovals', badge: pendingCount },
    { label: 'Calendar', icon: Calendar, page: 'ClientCalendar' },
    { label: 'Content', icon: FileText, page: 'ClientContentProduction' },
    { label: 'Reports', icon: BarChart, page: 'ClientReports' },
    { label: 'Settings', icon: Settings, page: 'ClientSettings' },
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-slate-950 border-r border-slate-800 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-6 pb-8 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-tight">NTA Client Portal</span>
      </div>
      <div className="space-y-1 flex-1 px-4 py-6 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const url = createPageUrl(item.page);
          const isActive = currentPath === url;
          return (
            <Link
              key={item.page}
              to={url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white font-medium shadow-sm' : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-900 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
}