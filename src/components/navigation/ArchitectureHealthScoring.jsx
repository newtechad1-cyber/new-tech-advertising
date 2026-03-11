import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function ArchitectureHealthScoring({ pages = [], routes = [], layouts = [] }) {
  const pageHealthScores = useMemo(() => {
    return pages.map(page => {
      let score = 100;
      const issues = [];

      // Route exists check
      const hasRoute = routes.some(r => r.page_key === page.page_key && r.active);
      if (!hasRoute) {
        score -= 20;
        issues.push({ type: 'orphan', severity: 'critical', msg: 'No active route' });
      }

      // Layout match check
      const layout = layouts.find(l => l.layout_key === page.layout_key);
      if (!layout) {
        score -= 15;
        issues.push({ type: 'missing_layout', severity: 'critical', msg: 'Layout not found' });
      } else {
        const allowedFamilies = layout.allowed_route_families_json
          ? JSON.parse(layout.allowed_route_families_json)
          : [];
        if (allowedFamilies.length > 0 && !allowedFamilies.includes(page.route_family)) {
          score -= 20;
          issues.push({ type: 'family_mismatch', severity: 'critical', msg: 'Layout family mismatch' });
        }
      }

      // Access rules check
      if (!page.access_rules_json) {
        score -= 10;
        issues.push({ type: 'missing_access', severity: 'high', msg: 'No access rules defined' });
      }

      // Deprecated flag
      if (page.deprecated) {
        score -= 15;
        issues.push({ type: 'deprecated', severity: 'high', msg: 'Page is deprecated' });
      }

      // Owner assignment
      if (!page.owner_team) {
        score -= 5;
        issues.push({ type: 'missing_owner', severity: 'medium', msg: 'No owner assigned' });
      }

      return {
        ...page,
        health_score: Math.max(0, score),
        issues,
        risk_level: score >= 90 ? 'low' : score >= 70 ? 'medium' : score >= 50 ? 'high' : 'critical',
      };
    });
  }, [pages, routes, layouts]);

  const routeFamilyScores = useMemo(() => {
    const families = ['public', 'main_admin', 'school_admin', 'client_portal', 'reseller', 'governance', 'agent_ops'];
    
    return families.map(family => {
      const familyPages = pageHealthScores.filter(p => p.route_family === family);
      const familyRoutes = routes.filter(r => r.route_family === family && r.active);

      if (familyPages.length === 0) {
        return { family, score: 0, pages: 0, routes: 0, healthyPages: 0 };
      }

      const avgScore = Math.round(familyPages.reduce((sum, p) => sum + p.health_score, 0) / familyPages.length);
      const healthyPages = familyPages.filter(p => p.health_score >= 80).length;

      return {
        family,
        score: avgScore,
        pages: familyPages.length,
        routes: familyRoutes.length,
        healthyPages,
        risk_level: avgScore >= 85 ? 'low' : avgScore >= 70 ? 'medium' : 'high',
      };
    }).filter(f => f.pages > 0 || f.routes > 0);
  }, [pageHealthScores, routes]);

  const scoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-amber-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const scoreBgColor = (score) => {
    if (score >= 90) return 'bg-emerald-950/40 border-emerald-700/50';
    if (score >= 75) return 'bg-amber-950/40 border-amber-700/50';
    if (score >= 50) return 'bg-orange-950/40 border-orange-700/50';
    return 'bg-red-950/40 border-red-700/50';
  };

  return (
    <div className="space-y-4">
      {/* Overall Health */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-blue-400" />
            Architecture Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded bg-slate-900/50">
              <p className="text-xs text-slate-400 mb-1">Overall Score</p>
              <p className={`text-2xl font-bold ${scoreColor(Math.round(pageHealthScores.reduce((sum, p) => sum + p.health_score, 0) / Math.max(1, pageHealthScores.length)))}`}>
                {Math.round(pageHealthScores.reduce((sum, p) => sum + p.health_score, 0) / Math.max(1, pageHealthScores.length))}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-900/50">
              <p className="text-xs text-slate-400 mb-1">Healthy Pages</p>
              <p className="text-2xl font-bold text-emerald-400">
                {pageHealthScores.filter(p => p.health_score >= 80).length}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-900/50">
              <p className="text-xs text-slate-400 mb-1">At Risk</p>
              <p className="text-2xl font-bold text-orange-400">
                {pageHealthScores.filter(p => p.health_score < 80 && p.health_score >= 50).length}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-900/50">
              <p className="text-xs text-slate-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-400">
                {pageHealthScores.filter(p => p.health_score < 50).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Family Scores */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Health by Route Family</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {routeFamilyScores.map(family => (
              <div
                key={family.family}
                className={`p-3 rounded border ${scoreBgColor(family.score)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-white capitalize">
                    {family.family.replace(/_/g, ' ')}
                  </p>
                  {family.score >= 85 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {family.score < 85 && family.score >= 60 && <AlertCircle className="w-3 h-3 text-amber-400" />}
                  {family.score < 60 && <AlertCircle className="w-3 h-3 text-red-400" />}
                </div>
                <p className={`text-xl font-bold mb-1 ${scoreColor(family.score)}`}>
                  {family.score}
                </p>
                <p className="text-xs text-slate-400">
                  {family.healthyPages}/{family.pages} healthy
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Issues */}
      {pageHealthScores.some(p => p.issues.length > 0) && (
        <Card className="bg-slate-950 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Top Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pageHealthScores
                .filter(p => p.issues.length > 0)
                .sort((a, b) => a.health_score - b.health_score)
                .slice(0, 6)
                .map((page, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/50 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-white font-semibold">{page.page_name}</p>
                      <p className="text-slate-400">
                        {page.issues.map(i => i.msg).join(', ')}
                      </p>
                    </div>
                    <Badge className={`${
                      page.health_score >= 80 ? 'bg-emerald-950' :
                      page.health_score >= 50 ? 'bg-amber-950' :
                      'bg-red-950'
                    }`}>
                      {page.health_score}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}