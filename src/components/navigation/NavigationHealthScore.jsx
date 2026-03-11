import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function NavigationHealthScore({ pages = [], routes = [], navs = [], health = [] }) {
  const metrics = useMemo(() => {
    const registeredPages = pages.filter(p => p.active).length;
    const registeredRoutes = routes.filter(r => r.active).length;
    const orphanPages = pages.filter(p => p.active && !routes.some(r => r.page_key === p.page_key)).length;
    const layoutMismatches = health.filter(h => h.layout_match_status === 'mismatch').length;
    const navMismatches = health.filter(h => h.nav_match_status === 'mismatch').length;
    const duplicateRisks = health.filter(h => h.duplicate_risk_status !== 'none').length;
    const accessMissing = health.filter(h => h.access_rule_status === 'missing').length;

    const avgHealth = health.length > 0 ? Math.round(health.reduce((sum, h) => sum + (h.health_score || 0), 0) / health.length) : 100;

    return {
      registeredPages,
      registeredRoutes,
      orphanPages,
      layoutMismatches,
      navMismatches,
      duplicateRisks,
      accessMissing,
      avgHealth,
    };
  }, [pages, routes, health]);

  const data = [
    { name: 'Pages', value: metrics.registeredPages, fill: '#3b82f6' },
    { name: 'Routes', value: metrics.registeredRoutes, fill: '#06b6d4' },
    { name: 'Navs', value: navs.filter(n => n.active).length, fill: '#8b5cf6' },
  ];

  const issueCount = metrics.layoutMismatches + metrics.navMismatches + metrics.duplicateRisks + metrics.accessMissing;

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-2">Navigation Health Score</p>
              <p className="text-5xl font-bold text-white">{metrics.avgHealth}%</p>
              <p className="text-xs text-slate-500 mt-2">Based on {health.length} route assessments</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl mb-2 ${metrics.avgHealth >= 80 ? '✅' : metrics.avgHealth >= 60 ? '⚠️' : '❌'}`} />
              <p className="text-xs text-slate-400">
                {metrics.avgHealth >= 80 ? 'Excellent' : metrics.avgHealth >= 60 ? 'Fair' : 'At Risk'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registry Count */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Registry Count</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Issues Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className={`border-slate-700 ${issueCount > 0 ? 'bg-red-950/20' : 'bg-slate-950'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {issueCount > 0 ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <p className="text-xs text-slate-400">Issues Detected</p>
                <p className="text-2xl font-bold text-white">{issueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-slate-700 ${metrics.orphanPages > 0 ? 'bg-orange-950/20' : 'bg-slate-950'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${metrics.orphanPages > 0 ? 'text-orange-400' : 'text-slate-400'}`} />
              <div>
                <p className="text-xs text-slate-400">Orphan Pages</p>
                <p className="text-2xl font-bold text-white">{metrics.orphanPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Issues */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Issue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'Layout Mismatches', value: metrics.layoutMismatches, color: 'bg-red-950/40 text-red-300' },
            { label: 'Nav Family Mismatches', value: metrics.navMismatches, color: 'bg-orange-950/40 text-orange-300' },
            { label: 'Duplicate Route Risks', value: metrics.duplicateRisks, color: 'bg-amber-950/40 text-amber-300' },
            { label: 'Missing Access Rules', value: metrics.accessMissing, color: 'bg-yellow-950/40 text-yellow-300' },
          ].map((issue, idx) => (
            <div key={idx} className={`rounded-lg p-2 ${issue.color} text-xs font-semibold flex justify-between`}>
              <span>{issue.label}</span>
              <span>{issue.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}