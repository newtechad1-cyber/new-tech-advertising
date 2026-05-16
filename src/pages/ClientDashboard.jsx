import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingStatusHero from '@/components/client-dashboard/MarketingStatusHero.jsx';
import UpcomingContentTimeline from '@/components/client-dashboard/UpcomingContentTimeline.jsx';
import ChannelHealthSnapshot from '@/components/client-dashboard/ChannelHealthSnapshot.jsx';
import PerformanceSnapshot from '@/components/client-dashboard/PerformanceSnapshot.jsx';
import QuickActionsStrip from '@/components/client-dashboard/QuickActionsStrip.jsx';
import ClientGuard from '@/components/auth/ClientGuard';
import ClientNav from '@/components/nav/ClientNav';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);
        
        // Load client profile data
        if (authenticatedUser?.company_id) {
          const profiles = await base44.entities.ClientHealthProfile.filter({ client_id: authenticatedUser.company_id });
          if (profiles && profiles.length > 0) {
            setClientProfile(profiles[0]);
          }
        }
      } catch (error) {
        console.log('Error loading dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ClientGuard>
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </ClientGuard>
    );
  }

  if (!user?.company_id) {
    return (
      <ClientGuard>
        <div className="flex h-screen bg-slate-50">
          <ClientNav />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Account Not Linked</h2>
              <p className="text-slate-600">Your account isn't linked to a company yet. Contact NTA support.</p>
            </div>
          </div>
        </div>
      </ClientGuard>
    );
  }

  return (
    <ClientGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <ClientNav />
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Section 1: Marketing Status Hero */}
        <MarketingStatusHero clientProfile={clientProfile} user={user} />

        {/* Section 2: Upcoming Content Timeline */}
        <div className="mt-12">
          <UpcomingContentTimeline />
        </div>

        {/* Section 3: Channel Health Snapshot */}
        <div className="mt-12">
          <ChannelHealthSnapshot clientProfile={clientProfile} />
        </div>

        {/* Section 4: Performance Snapshot */}
        <div className="mt-12">
          <PerformanceSnapshot clientProfile={clientProfile} />
        </div>

        {/* Section 5: Quick Actions Strip */}
        <div className="mt-12">
          <QuickActionsStrip />
        </div>
      </div>
    </div>
  </div>
</ClientGuard>
  );
}