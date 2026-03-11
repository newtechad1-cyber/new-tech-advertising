import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, X, Clock, ExternalLink, Plus } from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ROUTE_INVENTORY,
  groupRoutesByFamily,
  calculateQAMetrics,
} from '@/lib/routeQADetection';

export default function AdminNavigationQA() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Load all QA checks
  const { data: qaChecks = [] } = useQuery({
    queryKey: ['navigationQAChecks'],
    queryFn: () => base44.entities.NavigationQACheck.list(),
  });

  // Create/update QA check
  const createCheckMutation = useMutation({
    mutationFn: (checkData) =>
      base44.entities.NavigationQACheck.create(checkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationQAChecks'] });
    },
  });

  const updateCheckMutation = useMutation({
    mutationFn: ({ id, data }) =>
      base44.entities.NavigationQACheck.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationQAChecks'] });
    },
  });

  const handleQuickAction = (route, action) => {
    const existingCheck = qaChecks.find(c => c.route === route);
    const now = new Date().toISOString();

    if (action === 'mark_pass') {
      if (existingCheck) {
        updateCheckMutation.mutate({
          id: existingCheck.id,
          data: { status: 'pass', tested: true, tested_at: now },
        });
      } else {
        createCheckMutation.mutate({
          route,
          page_key: ROUTE_INVENTORY.find(r => r.route === route)?.page_key,
          page_family: ROUTE_INVENTORY.find(r => r.route === route)?.page_family,
          status: 'pass',
          tested: true,
          tested_at: now,
        });
      }
    } else if (action === 'mark_broken') {
      if (existingCheck) {
        updateCheckMutation.mutate({
          id: existingCheck.id,
          data: { status: 'broken', tested: true, tested_at: now },
        });
      } else {
        createCheckMutation.mutate({
          route,
          page_key: ROUTE_INVENTORY.find(r => r.route === route)?.page_key,
          page_family: ROUTE_INVENTORY.find(r => r.route === route)?.page_family,
          status: 'broken',
          tested: true,
          tested_at: now,
        });
      }
    }
  };

  const groupedRoutes = groupRoutesByFamily();
  const metrics = calculateQAMetrics(qaChecks);

  // Helper: Get QA status for route
  const getCheckForRoute = (route) => qaChecks.find(c => c.route === route);

  // Helper: Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      pass: 'bg-green-100 text-green-800',
      broken: 'bg-red-100 text-red-800',
      redirect_issue: 'bg-yellow-100 text-yellow-800',
      wrong_layout: 'bg-orange-100 text-orange-800',
      untested: 'bg-slate-100 text-slate-800',
      timeout: 'bg-purple-100 text-purple-800',
    };
    return styles[status] || styles.untested;
  };

  // Filter routes by search and status
  const filterRoutes = (routes) => {
    return routes.filter(route => {
      if (searchTerm && !route.route.includes(searchTerm)) return false;
      if (statusFilter === 'all') return true;
      const check = getCheckForRoute(route.route);
      const routeStatus = check?.status || 'untested';
      return routeStatus === statusFilter;
    });
  };

  return (
    <AdminGuard>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Navigation QA Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Audit and validate routing across all platform families</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-slate-900">{metrics.total}</div>
              <p className="text-xs text-slate-500 mt-1">Total Routes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{metrics.tested}</div>
              <p className="text-xs text-slate-500 mt-1">Routes Tested ({metrics.coverage}%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{metrics.passed}</div>
              <p className="text-xs text-slate-500 mt-1">Passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{metrics.broken}</div>
              <p className="text-xs text-slate-500 mt-1">Issues Found</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pass">Passed</option>
            <option value="broken">Broken</option>
            <option value="untested">Untested</option>
            <option value="wrong_layout">Wrong Layout</option>
          </select>
        </div>

        {/* Route Tabs by Family */}
        <Tabs defaultValue="main_admin" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="main_admin">Main Admin</TabsTrigger>
            <TabsTrigger value="school_admin">School Admin</TabsTrigger>
            <TabsTrigger value="client_portal">Client Portal</TabsTrigger>
          </TabsList>

          {['public', 'main_admin', 'school_admin', 'client_portal'].map(family => (
            <TabsContent key={family} value={family} className="space-y-3">
              {filterRoutes(groupedRoutes[family]).map(route => {
                const check = getCheckForRoute(route.route);
                const status = check?.status || 'untested';

                return (
                  <Card key={route.route} className="hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                              {route.route}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {route.page_key}
                            </Badge>
                            <Badge className={`text-xs ${getStatusBadge(status)}`}>
                              {status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            Layout: <span className="font-mono">{route.layout_expected}</span> •
                            Nav: <span className="font-mono">{route.nav_menu_source}</span>
                          </p>
                          {check?.notes && (
                            <p className="text-xs text-slate-600 italic">Note: {check.notes}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(route.route, '_blank')}
                            className="gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </Button>
                          <Button
                            variant={status === 'pass' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleQuickAction(route.route, 'mark_pass')}
                            className="gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Pass
                          </Button>
                          <Button
                            variant={status === 'broken' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleQuickAction(route.route, 'mark_broken')}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" />
                            Broken
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminGuard>
  );
}