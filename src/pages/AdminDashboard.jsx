import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { createPageUrl } from '../utils';
import SchedulingQueue from '../components/admin/SchedulingQueue';
import UpsellQueue from '../components/admin/UpsellQueue';
import ClientsList from '../components/admin/ClientsList';
import AdminGuard from '../components/auth/AdminGuard';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('hub');
  const [stats, setStats] = useState({
    pendingScheduling: 0,
    activeUpsells: 0,
    totalClients: 0,
    pendingLeads: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = createPageUrl('Dashboard');
        return;
      }
      setUser(userData);
      await loadStats();
    } catch (error) {
      console.error('Auth error:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [submissions, users] = await Promise.all([
        base44.entities.ContentSubmission.list(),
        base44.entities.User.list()
      ]);

      setStats({
        pendingScheduling: submissions.filter(s => s.status === 'pending').length,
        activeUpsells: submissions.filter(s => 
          s.upgrade_status === 'client_requested' || 
          s.upgrade_status === 'approved'
        ).length,
        totalClients: users.filter(u => u.role !== 'admin').length,
        pendingLeads: 0 // Can wire up to Lead entity if needed
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const quickActions = [
    {
      id: 'scheduling',
      title: 'Scheduling Queue',
      description: 'Content needing scheduling',
      icon: Calendar,
      count: stats.pendingScheduling,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      view: 'scheduling'
    },
    {
      id: 'upsells',
      title: 'Upsell Queue',
      description: 'Per-post upgrade requests',
      icon: DollarSign,
      count: stats.activeUpsells,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      view: 'upsells'
    },
    {
      id: 'clients',
      title: 'Client Management',
      description: 'View all clients',
      icon: Users,
      count: stats.totalClients,
      color: 'bg-green-50 text-green-600 border-green-200',
      view: 'clients'
    }
  ];

  const externalLinks = [
    {
      title: 'Leads Dashboard',
      description: 'Manage incoming leads',
      icon: TrendingUp,
      path: 'LeadsDashboard'
    },
    {
      title: 'Blog Management',
      description: 'Create & edit blog posts',
      icon: FileText,
      path: 'AdminBlog'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Hub</h1>
              <p className="text-sm text-slate-600 mt-1">
                {activeView === 'hub' ? 'Operations & Management Center' : 
                 activeView === 'scheduling' ? 'Scheduling Queue' :
                 activeView === 'upsells' ? 'Upsell Queue' :
                 'Client Management'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeView !== 'hub' && (
                <Button variant="outline" onClick={() => setActiveView('hub')}>
                  ← Back to Hub
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('Dashboard')}>
                Client View
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'hub' ? (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                    onClick={() => setActiveView(action.view)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 border-2`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-slate-900">{action.count}</span>
                            <span className="text-sm text-slate-500">pending</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* External Pages */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Management Pages</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {externalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Card 
                      key={link.path}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => window.location.href = createPageUrl(link.path)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{link.title}</h3>
                              <p className="text-xs text-slate-500">{link.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity (placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Activity feed coming soon...</p>
              </CardContent>
            </Card>
          </div>
        ) : activeView === 'scheduling' ? (
          <SchedulingQueue />
        ) : activeView === 'upsells' ? (
          <UpsellQueue />
        ) : (
          <ClientsList />
        )}
      </main>
    </div>
    </AdminGuard>
  );
}