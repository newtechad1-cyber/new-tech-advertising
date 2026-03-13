import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw, Download } from 'lucide-react';

export default function AdminDataGovernance() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch latest governance snapshot
  const { data: snapshot, isLoading, refetch } = useQuery({
    queryKey: ['governance-snapshot'],
    queryFn: async () => {
      const snapshots = await base44.entities.DataGovernanceSnapshot.list('-snapshotDate', 1);
      return snapshots[0] || null;
    },
  });

  // Fetch entity counts
  const { data: entityCounts } = useQuery({
    queryKey: ['entity-counts'],
    queryFn: async () => {
      const counts = {};
      const entities = ['Organization', 'DataGovernanceUser', 'Subscription', 'Campaign', 'ContentAsset', 'DataGovernanceLead', 'ActivityEvent'];
      
      for (const entity of entities) {
        try {
          const records = await base44.entities[entity].list();
          counts[entity] = records?.length || 0;
        } catch (error) {
          counts[entity] = 0;
        }
      }
      return counts;
    },
  });

  // Fetch governance rules
  const { data: rules } = useQuery({
    queryKey: ['governance-rules'],
    queryFn: async () => {
      return await base44.entities.DataGovernanceRule.list();
    },
  });

  const handleRefreshSnapshot = async () => {
    setRefreshing(true);
    try {
      // Trigger governance analysis job
      await base44.functions.invoke('analyzeDataGovernance', {});
      await refetch();
    } catch (error) {
      console.error('Failed to refresh snapshot:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin">🔄</div>
        </div>
      </AdminLayout>
    );
  }

  const parseJsonField = (field) => {
    try {
      return typeof field === 'string' ? JSON.parse(field) : field;
    } catch {
      return field;
    }
  };

  const snapshotData = snapshot ? {
    ...snapshot,
    entityCounts: parseJsonField(snapshot.entityCounts) || {},
    statusDistribution: parseJsonField(snapshot.statusDistribution) || {},
    relationshipHealth: parseJsonField(snapshot.relationshipHealth) || {},
    issues: parseJsonField(snapshot.issues) || [],
  } : null;

  const healthScore = snapshotData?.healthScore || 0;
  const healthColor = healthScore >= 85 ? 'text-green-600' : healthScore >= 70 ? 'text-yellow-600' : 'text-red-600';
  const healthBg = healthScore >= 85 ? 'bg-green-50' : healthScore >= 70 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Data Governance Dashboard</h1>
          <Button
            onClick={handleRefreshSnapshot}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>

        {/* Health Score Card */}
        <div className={`rounded-lg p-6 mb-6 ${healthBg}`}>
          <div className="text-center">
            <div className={`text-5xl font-bold ${healthColor}`}>
              {healthScore}
            </div>
            <p className="text-gray-700 mt-2">Overall Data Health Score</p>
            {snapshotData?.snapshotDate && (
              <p className="text-sm text-gray-500">Last updated: {new Date(snapshotData.snapshotDate).toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orphan Records</p>
                <p className="text-2xl font-bold">{snapshotData?.orphanRecords || 0}</p>
              </div>
              <AlertTriangle className={snapshotData?.orphanRecords > 0 ? 'w-8 h-8 text-yellow-500' : 'w-8 h-8 text-gray-300'} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duplicates Found</p>
                <p className="text-2xl font-bold">{snapshotData?.duplicates || 0}</p>
              </div>
              <AlertTriangle className={snapshotData?.duplicates > 0 ? 'w-8 h-8 text-orange-500' : 'w-8 h-8 text-gray-300'} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Violations</p>
                <p className="text-2xl font-bold">{snapshotData?.violations || 0}</p>
              </div>
              <AlertCircle className={snapshotData?.violations > 0 ? 'w-8 h-8 text-red-500' : 'w-8 h-8 text-gray-300'} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rules Active</p>
                <p className="text-2xl font-bold">{rules?.filter(r => r.isActive)?.length || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Entity Counts */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Entity Counts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {entityCounts && Object.entries(entityCounts).map(([entity, count]) => (
              <div key={entity} className="border rounded p-3">
                <p className="text-sm text-gray-600">{entity}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Issues */}
        {snapshotData?.issues && snapshotData.issues.length > 0 && (
          <Card className="p-6 mb-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Detected Issues
            </h2>
            <div className="space-y-3">
              {snapshotData.issues.map((issue, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{issue.type}</p>
                      <p className="text-sm text-gray-600">{issue.message}</p>
                    </div>
                    <Badge variant={issue.severity === 'critical' ? 'destructive' : 'outline'}>
                      {issue.severity}
                    </Badge>
                  </div>
                  {issue.count && <p className="text-sm text-gray-500 mt-2">Affected records: {issue.count}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Relationship Health */}
        {snapshotData?.relationshipHealth && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Relationship Health</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(snapshotData.relationshipHealth).map(([relationship, health]) => (
                <div key={relationship} className="border rounded p-3">
                  <p className="text-sm text-gray-600 truncate">{relationship}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${health >= 95 ? 'bg-green-500' : health >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(health, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{Math.round(health)}% healthy</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Governance Rules */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Governance Rules</h2>
          <div className="space-y-3">
            {rules?.filter(r => r.isActive)?.map(rule => (
              <div key={rule.id} className="border rounded p-3 flex justify-between items-start">
                <div>
                  <p className="font-medium">{rule.ruleName}</p>
                  <p className="text-sm text-gray-600">{rule.entityType} • {rule.ruleType}</p>
                  {rule.violationCount > 0 && (
                    <p className="text-sm text-red-600 mt-1">{rule.violationCount} violations detected</p>
                  )}
                </div>
                <Badge variant={rule.severity === 'critical' ? 'destructive' : rule.severity === 'error' ? 'outline' : 'secondary'}>
                  {rule.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}