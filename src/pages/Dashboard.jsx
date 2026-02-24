import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LayoutDashboard, PieChart, CreditCard, BookOpen, LogOut, Menu, X, FolderKanban, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatbot from '../components/Chatbot';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import SubscriptionView from '../components/dashboard/SubscriptionView';
import ResourcesView from '../components/dashboard/ResourcesView';
import OnboardingFlow from '../components/dashboard/OnboardingFlow';
import ProjectsView from '../components/dashboard/ProjectsView';
import ContentSubmissionsView from '../components/dashboard/ContentSubmissionsView';
import ProposalsView from '../components/dashboard/ProposalsView';
import { createPageUrl } from '../utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      let userData;
      try {
        userData = await base44.auth.me();
      } catch (e) {
        console.log('[Dashboard] Not authenticated, redirecting to login');
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      
      if (userData) {
         setUser(userData);
         console.log('[Dashboard] User authenticated:', {
           email: userData?.email,
           role: userData?.role
         });

         // Redirect admin users to the admin dashboard
         if (userData?.role === 'admin') {
           window.location.href = createPageUrl('AdminDashboard');
           return;
         }
         
         // Check for client profile to determine onboarding state - run in parallel with user already loaded
         const profiles = await base44.entities.ClientProfile.filter({ created_by: userData.email });
         console.log('[Dashboard] Profile query returned:', profiles?.length || 0, 'profiles');
         
         if (profiles && profiles.length > 0) {
           setClientProfile(profiles[0]);
           const isComplete = profiles[0].onboarding_completed || false;
           console.log('[Dashboard] Profile loaded:', {
             profileId: profiles[0].id,
             businessName: profiles[0].business_name,
             onboardingComplete: isComplete
           });
           
           if (!isComplete) {
             console.log('[Dashboard] Onboarding incomplete, showing onboarding flow');
             setShowOnboarding(true);
           }
         } else {
           console.log('[Dashboard] No profile found - user needs onboarding');
           setShowOnboarding(true);
         }
      }
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
      case 'proposals':
        return <ProposalsView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'resources':
        return <ResourcesView />;
      default:
        return <AnalyticsView />;
      }
      };

      const navItems = [
      { id: 'analytics', label: 'Overview & Analytics', icon: PieChart },
      { id: 'submissions', label: 'My Content', icon: FolderKanban },
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
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/bd570a4a6_NTAlogo2.png" 
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/bd570a4a6_NTAlogo2.png" 
            alt="New Tech Advertising" 
            className="h-8 w-auto"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/bd570a4a6_NTAlogo2.png" 
              alt="New Tech Advertising" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-slate-900 text-lg">Client Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>

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

          {renderContent()}
        </div>
      </main>

      <Chatbot />
    </div>
  );
}