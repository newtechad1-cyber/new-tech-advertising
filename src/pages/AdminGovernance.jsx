import React, { useMemo } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Database, AlertTriangle, TrendingUp, Lock, GitBranch, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import GovernanceHealthPanel from '@/components/governance/GovernanceHealthPanel';
import EntityRegistryOverview from '@/components/governance/EntityRegistryOverview';
import SchemaHealthAlerts from '@/components/governance/SchemaHealthAlerts';
import RecentGovernanceChanges from '@/components/governance/RecentGovernanceChanges';
import GovernanceHealthScore from '@/components/governance/GovernanceHealthScore';
import NextBestGovernanceAction from '@/components/governance/NextBestGovernanceAction';
import ConflictDetectionPanel from '@/components/governance/ConflictDetectionPanel';
import HighRiskEntitiesPanel from '@/components/governance/HighRiskEntitiesPanel';
import CategorizedEntityBrowser from '@/components/governance/CategorizedEntityBrowser';
import ArchitecturePreviewMode from '@/components/governance/ArchitecturePreviewMode';

export default function AdminGovernance() {
  const { data: entities = [] } = useQuery({
    queryKey: ['master-entities'],
    queryFn: () => base44.entities.MasterEntityDefinition?.list?.().catch(() => []),
  });

  const { data: fields = [] } = useQuery({
    queryKey: ['master-fields'],
    queryFn: () => base44.entities.MasterFieldDefinition?.list?.().catch(() => []),
  });

  const { data: relationships = [] } = useQuery({
    queryKey: ['entity-relationships'],
    queryFn: () => base44.entities.EntityRelationshipDefinition?.list?.().catch(() => []),
  });

  const { data: lifecycles = [] } = useQuery({
    queryKey: ['entity-lifecycles'],
    queryFn: () => base44.entities.EntityLifecycleDefinition?.list?.().catch(() => []),
  });

  const { data: audits = [] } = useQuery({
    queryKey: ['governance-audits'],
    queryFn: () => base44.entities.EntityGovernanceAuditLog?.list?.('-created_at', 50).catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['schema-health'],
    queryFn: () => base44.entities.SchemaHealthSnapshot?.list?.('-snapshot_time', 1).catch(() => []),
  });

  // KPI Calculations
  const activeEntities = entities.filter(e => e.active).length;
  const governedFields = fields.length;
  const deprecatedFields = fields.filter(f => f.deprecated).length;
  const avgHealth = health.length > 0 ? Math.round(health[0].governance_health_score || 0) : 0;
  const lifecycleConflicts = health.length > 0 ? JSON.parse(health[0].issues_json || '[]').filter(i => i.type === 'lifecycle').length : 0;
  const relationshipRisks = relationships.filter(r => !r.active || !r.required).length;

  const kpis = [
    { label: 'Governed Entities', value: activeEntities, icon: Database, color: 'blue' },
    { label: 'Governed Fields', value: governedFields, icon: Shield, color: 'emerald' },
    { label: 'Health Score', value: `${avgHealth}%`, icon: TrendingUp, color: avgHealth >= 80 ? 'emerald' : avgHealth >= 60 ? 'amber' : 'red' },
    { label: 'Deprecated Fields', value: deprecatedFields, icon: AlertTriangle, color: deprecatedFields > 0 ? 'orange' : 'slate' },
    { label: 'Lifecycle Conflicts', value: lifecycleConflicts, icon: Clock, color: lifecycleConflicts > 0 ? 'red' : 'slate' },
    { label: 'Relationship Risks', value: relationshipRisks, icon: GitBranch, color: relationshipRisks > 0 ? 'orange' : 'slate' },
  ];

  return (
    <AdminNav currentPage="AdminGovernance">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Master Data Governance</h1>
            <p className="text-slate-400 mt-1">Schema definitions, health monitoring, and entity lifecycle control</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const colors = {
              blue: 'bg-blue-900/20 border-blue-700 text-blue-400',
              emerald: 'bg-emerald-900/20 border-emerald-700 text-emerald-400',
              amber: 'bg-amber-900/20 border-amber-700 text-amber-400',
              red: 'bg-red-900/20 border-red-700 text-red-400',
              orange: 'bg-orange-900/20 border-orange-700 text-orange-400',
              slate: 'bg-slate-900/20 border-slate-700 text-slate-400',
            };

            return (
              <div key={idx} className={`border rounded-lg p-3 ${colors[kpi.color]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
                    <p className="text-xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <Icon className="w-4 h-4 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="lifecycles">Lifecycles</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <GovernanceHealthPanel health={health[0]} entities={entities} fields={fields} />
            <SchemaHealthAlerts health={health[0]} />
            <RecentGovernanceChanges audits={audits} />
          </TabsContent>

          <TabsContent value="entities">
            <EntityRegistryOverview entities={entities} health={health[0]} />
          </TabsContent>

          <TabsContent value="fields">
            <div className="text-slate-400 p-6">
              <p>Field Governance Explorer: View detailed field definitions, deprecated fields, and validation rules.</p>
              <Link to={createPageUrl('AdminGovernanceFields')} className="text-blue-400 hover:underline mt-4 inline-block">
                Go to Field Explorer →
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="relationships">
            <div className="text-slate-400 p-6">
              <p>Relationship Explorer: View parent-child relationships, cardinality, and cascade rules.</p>
              <Link to={createPageUrl('AdminGovernanceRelationships')} className="text-blue-400 hover:underline mt-4 inline-block">
                Go to Relationship Explorer →
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="lifecycles">
            <div className="text-slate-400 p-6">
              <p>Lifecycle Governance: View allowed statuses, transitions, and detect conflicts.</p>
              <Link to={createPageUrl('AdminGovernanceLifecycles')} className="text-blue-400 hover:underline mt-4 inline-block">
                Go to Lifecycle View →
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="dependencies">
            <div className="text-slate-400 p-6">
              <p>Dependency Map: See how entities connect to pages, agents, workflows, and integrations.</p>
              <Link to={createPageUrl('AdminGovernanceDependencies')} className="text-blue-400 hover:underline mt-4 inline-block">
                Go to Dependency Map →
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="text-slate-400 p-6">
              <p>Governance Audit Trail: Track all schema changes, field deprecations, and relationship modifications.</p>
              <Link to={createPageUrl('AdminGovernanceAudit')} className="text-blue-400 hover:underline mt-4 inline-block">
                Go to Audit Log →
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminNav>
  );
}