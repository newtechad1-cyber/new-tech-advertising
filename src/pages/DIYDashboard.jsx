import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Video, Share2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import DIYHeaderStrip from '@/components/diy/DIYHeaderStrip';
import DIYTodaysPriorities from '@/components/diy/DIYTodaysPriorities';
import DIYCommandCenterPanel from '@/components/diy/DIYCommandCenterPanel';
import DIYToolsGrid from '@/components/diy/DIYToolsGrid';
import DIYUpgradePanel from '@/components/diy/DIYUpgradePanel';
import DIYCommandCenter from '@/components/diy/DIYCommandCenter';
import DIYWebsiteTools from '@/components/diy/DIYWebsiteTools';
import DIYVideoStudio from '@/components/diy/DIYVideoStudio';
import DIYSocialPlanner from '@/components/diy/DIYSocialPlanner';
import DIYLeadTracker from '@/components/diy/DIYLeadTracker';
import PricingLadderUpgradePanel from '@/components/pricing/PricingLadderUpgradePanel';
import DIYUpgradeBanners from '@/components/diy/DIYUpgradeBanners';
import { useBehaviorSignals } from '@/components/diy/useBehaviorSignals';

const MODULES = [
  { id: 'command', title: 'Marketing Command Center', icon: TrendingUp, component: DIYCommandCenter },
  { id: 'website', title: 'AI Website Tools', icon: Share2, component: DIYWebsiteTools },
  { id: 'video', title: 'AI Video Studio', icon: Video, component: DIYVideoStudio },
  { id: 'social', title: 'Social Media Planner', icon: MessageSquare, component: DIYSocialPlanner },
  { id: 'leads', title: 'Lead & ROI Tracker', icon: BarChart3, component: DIYLeadTracker },
];

export default function DIYDashboard() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [growthStage, setGrowthStage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const behaviorSignals = useBehaviorSignals(subscription);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate('/');
          return;
        }

        const subs = await base44.entities.DIYSubscription.filter(
          { user_email: user.email, status: 'active' },
          '-created_date',
          1
        );

        if (subs.length === 0) {
          navigate('/nta/diy-growth-system');
          return;
        }

        setSubscription(subs[0]);

        // Load growth stage
        const stages = await base44.entities.ClientGrowthStage.filter(
          { onboarding_id: subs[0].id },
          '-created_date',
          1
        );
        if (stages.length > 0) {
          setGrowthStage(stages[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeModuleObj = MODULES.find(m => m.id === activeModule);
  const ActiveComponent = activeModuleObj?.component;

  const handleTaskClick = (moduleId) => {
    setActiveModule(moduleId);
    // Scroll to module
    setTimeout(() => {
      document.querySelector(`[data-module="${moduleId}"]`)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUpgradeClick = () => {
    window.location.href = 'mailto:sales@newtechadvertising.com?subject=Upgrade to Guided Growth';
  };

  // Dashboard view or module view
  const isDashboardView = !activeModule;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Strip */}
      <DIYHeaderStrip subscription={subscription} onUpgradeClick={handleUpgradeClick} />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {isDashboardView ? (
            <>
              {/* Behavior Signals Banner */}
              {subscription && growthStage && (
                <DIYUpgradeBanners
                  subscription={subscription}
                  growthStage={growthStage}
                  onUpgradeClick={(plan) => {
                    window.location.href = `mailto:sales@newtechadvertising.com?subject=Upgrade to ${plan}`;
                  }}
                  onDismiss={(signal) => {
                    console.log('Dismissed signal:', signal);
                  }}
                />
              )}

              {/* Dashboard View */}
              <DIYTodaysPriorities onTaskClick={handleTaskClick} />
              <DIYCommandCenterPanel subscription={subscription} />
              <DIYToolsGrid onToolClick={handleTaskClick} />
              <div className="mt-8">
                <PricingLadderUpgradePanel
                  currentPlan="diy"
                  readinessScore={behaviorSignals.readinessScore}
                  priority={behaviorSignals.alertPriority}
                  nextPlan={behaviorSignals.recommendedPlan}
                  onUpgrade={() => window.location.href = 'mailto:sales@newtechadvertising.com?subject=Upgrade to Guided Growth'}
                  compact={false}
                />
              </div>
              <DIYUpgradePanel onUpgradeClick={handleUpgradeClick} subscription={subscription} />
            </>
          ) : (
            <>
              {/* Module View */}
              <div className="mb-6">
                <button
                  onClick={() => setActiveModule(null)}
                  className="text-slate-400 hover:text-white font-semibold flex items-center gap-2 mb-6"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <div data-module={activeModule}>
                {ActiveComponent && <ActiveComponent subscription={subscription} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}