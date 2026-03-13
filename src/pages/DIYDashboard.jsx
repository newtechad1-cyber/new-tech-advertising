import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Video, Share2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import DIYCommandCenter from '@/components/diy/DIYCommandCenter';
import DIYWebsiteTools from '@/components/diy/DIYWebsiteTools';
import DIYVideoStudio from '@/components/diy/DIYVideoStudio';
import DIYSocialPlanner from '@/components/diy/DIYSocialPlanner';
import DIYLeadTracker from '@/components/diy/DIYLeadTracker';

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('command');

  useEffect(() => {
    const loadSubscription = async () => {
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
      } catch (error) {
        console.error('Error loading subscription:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-6 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            {subscription?.business_name || 'DIY Dashboard'}
          </h1>
          <p className="text-slate-400">
            Your AI Marketing Command Center
          </p>
        </div>
      </header>

      {/* Sidebar Navigation + Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 min-h-screen">
          <div className="space-y-2">
            {MODULES.map(module => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-medium ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {module.title}
                </button>
              );
            })}
          </div>

          {/* Subscription Info */}
          <div className="mt-12 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-3">Subscription</p>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-white font-semibold">DIY Growth System</p>
              <p className="text-sm text-violet-400">$99/month</p>
              <p className="text-xs text-slate-400 mt-2">
                Status: <span className="text-green-400 font-semibold">{subscription?.status || 'active'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl">
            {ActiveComponent && <ActiveComponent subscription={subscription} />}
          </div>
        </div>
      </div>
    </div>
  );
}