import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    quotedLeads: 0,
    totalValue: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const leads = await base44.entities.AdaLead.list('-created_date', 100);
      const activities = await base44.entities.LeadActivity.list('-created_date', 10);

      const newLeads = leads.filter(l => l.status === 'new').length;
      const quotedLeads = leads.filter(l => l.status === 'quoted').length;
      const totalValue = leads.reduce((sum, l) => sum + (l.setup_price || 0), 0);

      setStats({
        totalLeads: leads.length,
        newLeads,
        quotedLeads,
        totalValue,
        recentActivity: activities
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your business overview.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
                  <Users className="w-4 h-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stats.totalLeads}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">New Leads</CardTitle>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.newLeads}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Quoted</CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.quotedLeads}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Pipeline Value</CardTitle>
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">${stats.totalValue.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={createPageUrl('LeadsDashboard')}>
                    <Button variant="outline" className="w-full justify-between">
                      View All Leads
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl('AdaSalesAssistant')}>
                    <Button variant="outline" className="w-full justify-between">
                      AI Sales Assistant
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl('AdminBlog')}>
                    <Button variant="outline" className="w-full justify-between">
                      Manage Blog Posts
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                          <div className="flex-1">
                            <p className="text-slate-900 font-medium capitalize">
                              {activity.activity_type.replace('_', ' ')}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {new Date(activity.created_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}