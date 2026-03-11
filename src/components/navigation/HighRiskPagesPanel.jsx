import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Route } from 'lucide-react';

export default function HighRiskPagesPanel({ pages = [], routes = [], layouts = [] }) {
  const criticalPages = [
    'AdminDashboard',
    'AdminPublishing',
    'AdminVideos',
    'ClientDashboard',
    'ResellerDashboard',
  ];

  const riskAnalysis = useMemo(() => {
    return criticalPages
      .map(pageKey => {
        const page = pages.find(p => p.page_key === pageKey);
        if (!page) return null;

        const issues = [];
        let riskScore = 0;

        // Check 1: Route exists
        const route = routes.find(r => r.page_key === pageKey && r.active);
        if (!route) {
          issues.push({
            type: 'no_route',
            severity: 'critical',
            message: 'Not routable - page unreachable',
          });
          riskScore += 40;
        }

        // Check 2: Layout valid
        const layout = layouts.find(l => l.layout_key === page.layout_key);
        if (!layout) {
          issues.push({
            type: 'invalid_layout',
            severity: 'critical',
            message: 'Layout not found - rendering will fail',
          });
          riskScore += 35;
        } else {
          // Check 3: Layout family match
          const allowedFamilies = layout.allowed_route_families_json
            ? JSON.parse(layout.allowed_route_families_json)
            : [];
          if (allowedFamilies.length > 0 && !allowedFamilies.includes(page.route_family)) {
            issues.push({
              type: 'layout_mismatch',
              severity: 'critical',
              message: `Layout doesn't allow ${page.route_family}`,
            });
            riskScore += 30;
          }
        }

        // Check 4: Access rules
        if (!page.access_rules_json) {
          issues.push({
            type: 'no_access_rules',
            severity: 'high',
            message: 'No access control - security risk',
          });
          riskScore += 20;
        }

        // Check 5: Owner assigned
        if (!page.owner_team) {
          issues.push({
            type: 'no_owner',
            severity: 'high',
            message: 'No owner - unclear responsibility',
          });
          riskScore += 10;
        }

        // Check 6: Not deprecated
        if (page.deprecated) {
          issues.push({
            type: 'deprecated',
            severity: 'high',
            message: 'Page is deprecated - may break soon',
          });
          riskScore += 25;
        }

        return {
          pageKey,
          page,
          route,
          layout,
          issues,
          riskScore: Math.min(100, riskScore),
          riskLevel:
            riskScore >= 70 ? 'critical' :
            riskScore >= 40 ? 'high' :
            riskScore >= 20 ? 'medium' :
            'low',
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [pages, routes, layouts]);

  const riskLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-950/50 border-red-700/50';
      case 'high':
        return 'bg-orange-950/50 border-orange-700/50';
      case 'medium':
        return 'bg-amber-950/50 border-amber-700/50';
      default:
        return 'bg-emerald-950/50 border-emerald-700/50';
    }
  };

  const riskBadgeColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-950 text-red-300 border-red-700';
      case 'high':
        return 'bg-orange-950 text-orange-300 border-orange-700';
      case 'medium':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  const criticalCount = riskAnalysis.filter(p => p.riskLevel === 'critical').length;
  const highCount = riskAnalysis.filter(p => p.riskLevel === 'high').length;

  return (
    <Card className="bg-slate-950 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            Core Routes Risk Assessment
          </CardTitle>
          {(criticalCount > 0 || highCount > 0) && (
            <div className="flex gap-2">
              {criticalCount > 0 && (
                <Badge className="bg-red-950 text-red-300">
                  {criticalCount} Critical
                </Badge>
              )}
              {highCount > 0 && (
                <Badge className="bg-orange-950 text-orange-300">
                  {highCount} High
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {riskAnalysis.map((analysis) => (
            <div
              key={analysis.pageKey}
              className={`p-3 rounded border transition-all ${riskLevelColor(analysis.riskLevel)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 flex-shrink-0 opacity-60" />
                  <div>
                    <p className="font-semibold text-sm text-white">{analysis.page.page_name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {analysis.page.route_path}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ${riskBadgeColor(analysis.riskLevel)}`}>
                  {analysis.riskScore}% Risk
                </Badge>
              </div>

              {/* Route Status */}
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="p-1.5 rounded bg-slate-900/50">
                  <p className="text-slate-500 mb-0.5">Route</p>
                  {analysis.route ? (
                    <p className="text-emerald-300">✓ {analysis.route.route_path}</p>
                  ) : (
                    <p className="text-red-300">✗ No route registered</p>
                  )}
                </div>
                <div className="p-1.5 rounded bg-slate-900/50">
                  <p className="text-slate-500 mb-0.5">Layout</p>
                  {analysis.layout ? (
                    <p className="text-emerald-300">✓ {analysis.page.layout_key}</p>
                  ) : (
                    <p className="text-red-300">✗ Layout missing</p>
                  )}
                </div>
              </div>

              {/* Issues */}
              {analysis.issues.length > 0 && (
                <div className="space-y-1">
                  {analysis.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-70" />
                      <p className="opacity-90">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Safe Status */}
              {analysis.issues.length === 0 && (
                <p className="text-xs text-emerald-300">✓ All checks passed - route is safe</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}