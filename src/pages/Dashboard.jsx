import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LayoutDashboard, PieChart, CreditCard, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chatbot from '../components/Chatbot';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import SubscriptionView from '../components/dashboard/SubscriptionView';
import ResourcesView from '../components/dashboard/ResourcesView';
import { createPageUrl } from '../utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await base44.auth.isAuthenticated();
        if (!isAuthenticated) {
           // In a real app we would redirect, but for preview we'll show a demo state
           // base44.auth.redirectToLogin(createPageUrl('Dashboard'));
           // For demo purposes, simulate a user
           setUser({ full_name: "Demo User", email: "demo@example.com" });
        } else {
           const userData = await base44.auth.me();
           setUser(userData);
        }
      } catch (e) {
        console.error("Auth check failed", e);
        // Fallback for demo
        setUser({ full_name: "Demo User", email: "demo@example.com" });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsView />;
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
    { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'resources', label: 'Training & Resources', icon: BookOpen },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

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