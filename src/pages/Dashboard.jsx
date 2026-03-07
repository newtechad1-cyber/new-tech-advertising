import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { PieChart, CreditCard, BookOpen, LogOut, FolderKanban, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatbot from '../components/Chatbot';
import AppNav from '../components/nav/AppNav';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import SubscriptionView from '../components/dashboard/SubscriptionView';
import ResourcesView from '../components/dashboard/ResourcesView';
import OnboardingFlow from '../components/dashboard/OnboardingFlow';
import ProjectsView from '../components/dashboard/ProjectsView';
import ContentSubmissionsView from '../components/dashboard/ContentSubmissionsView';
import ProposalsView from '../components/dashboard/ProposalsView';
import SocialAccounts from '../pages/SocialAccounts';
import { createPageUrl } from '../utils';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

// Tab mapping: URL ?tab= param → internal tab ids
// /dashboard           → analytics (default)
// /dashboard/content   → link with ?tab=content (ContentStudio redirect)
// /dashboard/calendar  → link with ?tab=calendar (ScheduledQueue redirect)
const TAB_MAP = {
  content: 'submissions',
  calendar: 'calendar',
  analytics: 'analytics',
  social: 'social',
  proposals: 'proposals',
  billing: 'subscription',
  resources: 'resources',
};

export default function Dashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  const [activeTab, setActiveTab] = useState(TAB_MAP[tabParam] || 'analytics');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProfile, setOnboardingProfile] = useState(null);

  useEffect(() => {
    checkAuth();
    
    // Show completion message if coming from onboarding
    const showComplete = sessionStorage.getItem('show_onboarding_complete');
    if (showComplete) {
      sessionStorage.removeItem('show_onboarding_complete');
    }
  }, []);

  const checkAuth = async () => {
    try {
      console.log('[Dashboard] Checking authentication...');
      const userData = await base44.auth.me();

      if (!userData) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }

      setUser(userData);
      console.log('[Dashboard] User authenticated:', { email: userData?.email, role: userData?.role });

      if (userData?.role === 'admin') {
        window.location.href = createPageUrl('AdminDashboard');
        return;
      }

      const profiles = await base44.entities.ClientProfile.filter({ created_by: userData.email });
      console.log('[Dashboard] Profile query returned:', profiles?.length || 0, 'profiles');

      if (profiles && profiles.length > 0) {
        setClientProfile(profiles[0]);
        if (!profiles[0].onboarding_completed) {
          setShowOnboarding(true);
        }
      } else {
        setShowOnboarding(true);
      }

      // Load new onboarding profile for banner
      try {
        let accountRows = await base44.entities.TrialAccount.filter({ email: userData.email });
        if (accountRows?.[0]) {
          const ob = await base44.entities.OnboardingProfile.filter({ account_id: accountRows[0].id });
          setOnboardingProfile(ob?.[0] || null);
        }
      } catch (_) { /* non-critical */ }
    } catch (e) {
      console.error("[Dashboard] Auth check failed:", e);
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (profileData) => {
    setClientProfile(profileData);
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    try {
      console.log('[Dashboard] Logging out...');
      await base44.auth.logout();
    } catch (e) {
      console.error("[Dashboard] Logout failed:", e);
      window.location.href = '/';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsView />;
      case 'submissions':
        return <ContentSubmissionsView />;
      case 'social':
        return <SocialAccounts />;
      case 'proposals':
        return <ProposalsView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'calendar':
        return <ContentCalendarEmbed />;
      case 'resources':
        return <ResourcesView />;
      default:
        return <AnalyticsView />;
      }
      };

      const navItems = [
      { id: 'analytics', label: 'Overview & Analytics', icon: PieChart },
      { id: 'submissions', label: 'My Content', icon: FolderKanban },
      { id: 'calendar', label: 'Content Calendar', icon: Share2 },
      { id: 'social', label: 'Social Accounts', icon: Share2 },
      { id: 'proposals', label: 'Proposals', icon: FileText },
      { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
      { id: 'resources', label: 'Training & Resources', icon: BookOpen },
      ];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png" 
              alt="New Tech Advertising" 
              className="h-8 w-auto"
            />
          </div>
        </header>
        <OnboardingFlow 
          onComplete={handleOnboardingComplete} 
          initialProfile={clientProfile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNav activeTab={activeTab} onTabChange={setActiveTab} user={user} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your business growth and account settings.
            </p>
          </header>

          {/* Onboarding Banner */}
          {onboardingProfile?.status !== 'complete' && (
            <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">Finish onboarding to generate your first month of content.</p>
                  <p className="text-sm text-amber-600 mt-0.5">Takes about 2 minutes — unlock AI-powered posting.</p>
                </div>
              </div>
              <a href={createPageUrl('ClientOnboarding')}>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white whitespace-nowrap shrink-0">
                  Continue Setup <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </a>
            </div>
          )}

          {onboardingProfile?.status === 'complete' && (
            <div className="mb-6 rounded-xl border-2 border-green-200 bg-green-50 px-5 py-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <p className="font-semibold text-green-800">Your first content pack is being generated. Check "My Content" soon!</p>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      <Chatbot />
    </div>
  );
}