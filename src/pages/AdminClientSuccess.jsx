import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientHealthOverviewCards from '@/components/admin/ClientHealthOverviewCards';
import AtRiskClientsPanel from '@/components/admin/AtRiskClientsPanel';
import UpgradeReadyClientsPanel from '@/components/admin/UpgradeReadyClientsPanel';
import HighMomentumClientsPanel from '@/components/admin/HighMomentumClientsPanel';
import ClientActivityFeed from '@/components/admin/ClientActivityFeed';
import ClientDetailModal from '@/components/admin/ClientDetailModal';
import {
  calculateClientHealthScore,
  segmentClients,
  getClientActivityEvents,
} from '@/components/admin/clientHealthLogic';

export default function AdminClientSuccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [retentionMap, setRetentionMap] = useState({});
  const [growthStageMap, setGrowthStageMap] = useState({});
  const [segments, setSegments] = useState(null);
  const [activityEvents, setActivityEvents] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authUser = await base44.auth.me();
        if (!authUser || authUser.role !== 'admin') {
          navigate('/');
          return;
        }
        setUser(authUser);

        // Load all active subscriptions
        const subs = await base44.entities.DIYSubscription.filter(
          { status: 'active' },
          '-created_date',
          1000
        );

        setSubscriptions(subs);

        // Load retention metrics and growth stages
        const retMap = {};
        const growthMap = {};
        const allEvents = [];

        for (const sub of subs) {
          // Load retention
          const retentions = await base44.entities.ClientRetentionMetrics.filter(
            { subscription_id: sub.id },
            '-created_date',
            1
          );
          if (retentions.length > 0) {
            retMap[sub.id] = retentions[0];
          }

          // Load growth stage
          const stages = await base44.entities.ClientGrowthStage.filter(
            { onboarding_id: sub.id },
            '-created_date',
            1
          );
          if (stages.length > 0) {
            growthMap[sub.id] = stages[0];
          }

          // Get activity events
          const events = await getClientActivityEvents(base44, sub);
          allEvents.push(...events);
        }

        setRetentionMap(retMap);
        setGrowthStageMap(growthMap);
        setActivityEvents(allEvents.sort((a, b) => new Date(b.date) - new Date(a.date)));

        // Segment clients
        const segmented = segmentClients(subs, retMap, growthMap);
        setSegments(segmented);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleClientClick = (client) => {
    setSelectedClient({
      ...client,
      retention: retentionMap[client.id],
      growthStage: growthStageMap[client.id],
      health: calculateClientHealthScore(
        client,
        retentionMap[client.id],
        growthStageMap[client.id]
      ),
    });
  };

  const handleSendMessage = (client) => {
    window.location.href = `mailto:${client.user_email}?subject=NTA Growth Update`;
  };

  const handleSaveNotes = async (clientId, notes) => {
    try {
      await base44.entities.DIYSubscription.update(clientId, { notes });
      const updated = subscriptions.map((s) =>
        s.id === clientId ? { ...s, notes } : s
      );
      setSubscriptions(updated);
      setSelectedClient({ ...selectedClient, notes });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!segments) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-slate-400">No data available</p>
        </div>
      </AdminLayout>
    );
  }

  // Calculate plan distribution
  const planCounts = {
    diy: subscriptions.filter((s) => s.current_plan === 'diy').length,
    guided_growth: subscriptions.filter((s) => s.current_plan === 'guided_growth')
      .length,
    done_for_you: subscriptions.filter((s) => s.current_plan === 'done_for_you')
      .length,
    premium: subscriptions.filter((s) => s.current_plan === 'premium').length,
  };

  const planDistribution = [
    {
      name: 'DIY',
      count: planCounts.diy,
      percent: Math.round((planCounts.diy / subscriptions.length) * 100),
    },
    {
      name: 'Guided',
      count: planCounts.guided_growth,
      percent: Math.round((planCounts.guided_growth / subscriptions.length) * 100),
    },
    {
      name: 'Done-For-You',
      count: planCounts.done_for_you,
      percent: Math.round((planCounts.done_for_you / subscriptions.length) * 100),
    },
    {
      name: 'Premium',
      count: planCounts.premium,
      percent: Math.round((planCounts.premium / subscriptions.length) * 100),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Client Success Command Center</h1>
          <p className="text-slate-400">Monitor health, engagement, and growth across all clients</p>
        </div>

        {/* Overview Cards */}
        <ClientHealthOverviewCards
          totalActive={subscriptions.length}
          planDistribution={planDistribution}
          atRiskCount={segments.atRisk.length}
          upgradeReadyCount={segments.upgradeReady.length}
          highMomentumCount={segments.highMomentum.length}
        />

        {/* Main Panels */}
        <div className="space-y-8">
          {/* At-Risk Clients */}
          <AtRiskClientsPanel
            clients={segments.atRisk}
            onClientClick={handleClientClick}
            onSendMessage={handleSendMessage}
            onScheduleCall={(client) => {
              window.location.href = `mailto:sales@newtechadvertising.com?subject=Schedule Call - ${client.business_name}`;
            }}
            onUpgradeClick={(client) => {
              window.location.href = `mailto:${client.user_email}?subject=Upgrade Recommendation`;
            }}
          />

          {/* Upgrade-Ready Clients */}
          <UpgradeReadyClientsPanel
            clients={segments.upgradeReady}
            onClientClick={handleClientClick}
            onSendOffer={(client) => {
              window.location.href = `mailto:${client.user_email}?subject=Special Upgrade Offer`;
            }}
            onScheduleCall={(client) => {
              window.location.href = `mailto:sales@newtechadvertising.com?subject=Schedule Call - ${client.business_name}`;
            }}
            onTriggerOutreach={(client) => {
              handleSendMessage(client);
            }}
          />

          {/* High-Momentum Clients */}
          <HighMomentumClientsPanel
            clients={segments.highMomentum}
            onClientClick={handleClientClick}
            onRequestTestimonial={(client) => {
              window.location.href = `mailto:${client.user_email}?subject=Share Your Success Story`;
            }}
            onProposePremium={(client) => {
              window.location.href = `mailto:${client.user_email}?subject=Premium Plan - Accelerate Your Growth`;
            }}
            onFeatureStory={(client) => {
              alert(`Feature ${client.business_name} as success story?`);
            }}
          />

          {/* Activity Feed */}
          <ClientActivityFeed events={activityEvents} />
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          events={activityEvents}
          onClose={() => setSelectedClient(null)}
          onSendMessage={handleSendMessage}
          onAssignCoach={(client) => {
            alert(`Assign coach to ${client.business_name}`);
          }}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </AdminLayout>
  );
}