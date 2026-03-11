import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAccessAudit() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: audits = [] } = useQuery({
    queryKey: ['access-audits'],
    queryFn: () => base44.entities.AccessAuditLog?.list?.('-created_at', 200).catch(() => []),
  });

  const { data: impersonations = [] } = useQuery({
    queryKey: ['impersonations'],
    queryFn: () => base44.entities.ImpersonationSession?.list?.('-start_time', 50).catch(() => []),
  });

  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const matchesSearch = a.user_email.toLowerCase().includes(search.toLowerCase()) ||
        a.action_type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || (filterStatus === 'success' ? a.success : !a.success);
      return matchesSearch && matchesStatus;
    });
  }, [audits, search, filterStatus]);

  const actionTypeColors = {
    page_access: 'text-blue-300',
    entity_read: 'text-cyan-300',
    entity_create: 'text-emerald-300',
    entity_update: 'text-amber-300',
    entity_delete: 'text-red-300',
    agent_execute: 'text-purple-300',
    publish: 'text-indigo-300',
    approve: 'text-emerald-300',
    permission_change: 'text-red-400',
    role_change: 'text-red-400',
    impersonate: 'text-orange-300',
    login: 'text-slate-300',
    logout: 'text-slate-300',
  };

  const stats = useMemo(() => {
    const totalActions = audits.length;
    const successfulActions = audits.filter(a => a.success).length;
    const failedActions = audits.filter(a => !a.success).length;
    const sensitiveActions = audits.filter(a =>
      ['entity_delete', 'permission_change', 'role_change', 'impersonate', 'publish'].includes(a.action_type)
    ).length;

    return { totalActions, successfulActions, failedActions, sensitiveActions };
  }, [audits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminAccess')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Access Audit Center</h1>
            <p className="text-slate-400 text-sm">Complete audit trail of all access events</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Total Actions</p>
              <p className="text-2xl font-bold text-white">{stats.totalActions}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/30 border-emerald-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-400 mb-1">Successful</p>
              <p className="text-2xl font-bold text-emerald-300">{stats.successfulActions}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/30 border-red-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-red-400 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-300">{stats.failedActions}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-950/30 border-orange-700/50">
            <CardContent className="p-4">
              <p className="text-xs text-orange-400 mb-1">Sensitive</p>
              <p className="text-2xl font-bold text-orange-300">{stats.sensitiveActions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Input
            placeholder="Search by user or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300"
          >
            <option value="all">All Events</option>
            <option value="success">Successful Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="impersonations">Impersonations ({impersonations.length})</TabsTrigger>
            <TabsTrigger value="sensitive">Sensitive Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="audit">
            <div className="space-y-2">
              {filteredAudits.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No audit logs found
                  </CardContent>
                </Card>
              ) : (
                filteredAudits.slice(0, 50).map((audit, idx) => (
                  <Card key={idx} className={`bg-slate-800/30 border-slate-700 ${!audit.success ? 'border-l-2 border-l-red-500' : ''}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-300">{audit.user_email}</span>
                            <Badge variant="outline" className={`text-xs ${actionTypeColors[audit.action_type] || 'text-slate-300'}`}>
                              {audit.action_type}
                            </Badge>
                            {!audit.success && (
                              <Badge className="bg-red-950 text-red-300 text-xs">Failed</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {audit.target_type} {audit.target_id && `· ${audit.target_id}`}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Role: {audit.role_key} · Context: {audit.context_type}
                            {audit.ip_address && ` · IP: ${audit.ip_address}`}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          {new Date(audit.created_at).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="impersonations">
            <div className="space-y-3">
              {impersonations.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No impersonation sessions
                  </CardContent>
                </Card>
              ) : (
                impersonations.map((session, idx) => (
                  <Card key={idx} className="bg-orange-950/20 border-orange-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-orange-300">
                            {session.impersonator_user_email} → {session.target_user_email}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{session.reason}</p>
                        </div>
                        <Badge className={session.active ? 'bg-orange-950 text-orange-300' : 'bg-slate-700 text-slate-300'}>
                          {session.active ? 'Active' : 'Ended'}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Started: {new Date(session.start_time).toLocaleString()}</span>
                        {session.end_time && <span>Ended: {new Date(session.end_time).toLocaleString()}</span>}
                        <span>Scope: {session.tenant_scope}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="sensitive">
            <div className="space-y-2">
              {audits
                .filter(a => ['entity_delete', 'permission_change', 'role_change', 'impersonate', 'publish'].includes(a.action_type))
                .slice(0, 30)
                .map((audit, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-700/50">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="font-semibold text-red-300">{audit.user_email}</span>
                            <Badge className="bg-red-950 text-red-300 text-xs">{audit.action_type}</Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            {audit.target_type} {audit.target_id && `· ${audit.target_id}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {audit.success ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-xs text-slate-500">
                            {new Date(audit.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}