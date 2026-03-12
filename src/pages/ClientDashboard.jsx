import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingStatusHero from '@/components/client-dashboard/MarketingStatusHero.jsx';
import UpcomingContentTimeline from '@/components/client-dashboard/UpcomingContentTimeline.jsx';
import ChannelHealthSnapshot from '@/components/client-dashboard/ChannelHealthSnapshot.jsx';
import PerformanceSnapshot from '@/components/client-dashboard/PerformanceSnapshot.jsx';
import QuickActionsStrip from '@/components/client-dashboard/QuickActionsStrip.jsx';

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
        const profiles = await base44.entities.ClientHealthProfile.filter({});
        if (profiles && profiles.length > 0) {
          setClientProfile(profiles[0]);
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
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
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
  );
}