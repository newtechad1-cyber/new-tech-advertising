import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import RouteFamilyBadge from '@/components/admin/RouteFamilyBadge';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

import CalendarHeader from '@/components/client-calendar/CalendarHeader';
import CalendarSummary from '@/components/client-calendar/CalendarSummary';
import CalendarViewToggle from '@/components/client-calendar/CalendarViewToggle';
import CalendarFilters from '@/components/client-calendar/CalendarFilters';
import MonthView from '@/components/client-calendar/MonthView';
import WeekView from '@/components/client-calendar/WeekView';
import AgendaView from '@/components/client-calendar/AgendaView';
import UpcomingThisWeek from '@/components/client-calendar/UpcomingThisWeek';
import RecentlyPublished from '@/components/client-calendar/RecentlyPublished';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png';

export default function ClientCalendar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (!u) { base44.auth.redirectToLogin(); return; }
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

  // Load trial account
  const { data: trialAccounts = [] } = useQuery({
    queryKey: ['client-trial', user?.email],
    queryFn: () => base44.entities.TrialAccount.filter({ email: user.email }),
    enabled: !!user?.email
  });
  const trial = trialAccounts[0];

  // Load video requests for approvals and scheduled content
  const { data: videoRequests = [] } = useQuery({
    queryKey: ['client-videos', user?.email],
    queryFn: () => base44.entities.VideoRequests.list('-created_date', 100),
    enabled: !!user
  });

  // Load scheduled posts
  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ['client-posts', user?.email],
    queryFn: () => base44.entities.ScheduledPost.list('-scheduled_for', 100),
    enabled: !!user
  });

  // Transform data to calendar events
  const calendarEvents = [
    ...videoRequests
      .filter(v => v.status !== 'archived')
      .map(v => ({
        id: v.id,
        title: v.title,
        description: v.goal,
        date: v.scheduled_publish_at || v.created_date,
        thumbnail: v.thumbnail_url,
        status: v.approval_status === 'Approved' ? 'published' :
                v.approval_status === 'Pending' ? 'approval' :
                'draft',
        platforms: [v.platform_destination || 'website'].filter(Boolean),
        caption: v.website_title,
        cta: v.cta_text,
        liveUrl: v.render_output_url,
        time: v.scheduled_publish_at ? new Date(v.scheduled_publish_at).toLocaleTimeString() : null,
      })),
    ...scheduledPosts
      .map(p => ({
        id: p.id,
        title: p.caption?.slice(0, 50) || 'Social Post',
        description: p.caption,
        date: p.scheduled_for,
        thumbnail: null,
        status: p.status === 'published' ? 'published' :
                p.status === 'scheduled' ? 'scheduled' :
                'draft',
        platforms: [p.platform],
        caption: p.caption,
        cta: null,
        liveUrl: null,
        time: p.scheduled_for ? new Date(p.scheduled_for).toLocaleTimeString() : null,
      }))
  ];

  // Apply filters
  const filteredEvents = calendarEvents.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (channelFilter !== 'all' && !e.platforms.includes(channelFilter)) return false;
    return true;
  });

  // Calculate metrics
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const needsApproval = calendarEvents.filter(e => e.status === 'approval').length;
  const scheduledThisWeek = calendarEvents.filter(e => {
    const eDate = new Date(e.date);
    return eDate >= now && eDate <= weekEnd && e.status === 'scheduled';
  }).length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const publishedThisMonth = calendarEvents.filter(e => {
    const eDate = new Date(e.date);
    return eDate.getMonth() === thisMonth && eDate.getFullYear() === thisYear && e.status === 'published';
  }).length;

  const companyName = trial?.name || user?.full_name || 'Your Company';

  const handleLogout = () => base44.auth.logout();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <ClientGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Top Nav */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <img src={LOGO} alt="NTA" className="h-8 w-auto" />
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
              <a href={createPageUrl('ClientDashboard')} className="hover:text-slate-800">Dashboard</a>
              <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Calendar</span>
              <a href={createPageUrl('ClientFulfillment')} className="hover:text-slate-800">Services</a>
              <a href={createPageUrl('ClientSettings')} className="hover:text-slate-800">Settings</a>
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <CalendarHeader companyName={companyName} primaryColor="#3B82F6" />

          {/* Summary Cards */}
          <CalendarSummary
            needsApproval={needsApproval}
            scheduledThisWeek={scheduledThisWeek}
            publishedThisMonth={publishedThisMonth}
            campaignsRunning={0}
          />

          {/* Controls */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CalendarViewToggle currentView={view} onViewChange={setView} />
            <CalendarFilters 
              statusFilter={statusFilter}
              channelFilter={channelFilter}
              onStatusChange={setStatusFilter}
              onChannelChange={setChannelFilter}
              onReset={() => {
                setStatusFilter('all');
                setChannelFilter('all');
              }}
            />
          </div>

          {/* Calendar View */}
          <div>
            {view === 'month' && <MonthView events={filteredEvents} />}
            {view === 'week' && <WeekView events={filteredEvents} />}
            {view === 'agenda' && <AgendaView events={filteredEvents} />}
          </div>

          {/* Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UpcomingThisWeek events={filteredEvents} />
            </div>
            <div>
              <RecentlyPublished events={filteredEvents} />
            </div>
          </div>
        </main>
      </div>
      <RouteFamilyBadge family="client_portal" />
    </ClientGuard>
  );
}