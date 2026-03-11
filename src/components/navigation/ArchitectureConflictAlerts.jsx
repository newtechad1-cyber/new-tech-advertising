import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, Link, Lock, Users } from 'lucide-react';

export default function ArchitectureConflictAlerts({ pages = [], routes = [], layouts = [], navItems = [] }) {
  const alerts = useMemo(() => {
    const allAlerts = [];

    // 1. Wrong-Family Links
    navItems.forEach(item => {
      const page = pages.find(p => p.page_key === item.page_key);
      if (page) {
        const route = routes.find(r => r.route_path === item.route_path && r.active);
        if (route && route.route_family !== page.route_family) {
          allAlerts.push({
            category: 'wrong_family_link',
            severity: 'high',
            icon: Link,
            title: 'Wrong-Family Navigation Link',
            description: `Nav item "${item.label}" links to ${page.page_name} but route family mismatch (${route.route_family} ≠ ${page.route_family})`,
            affected: item.label,
          });
        }
      }
    });

    // 2. Duplicate Page Ownership
    const ownerToPages = {};
    pages.forEach(page => {
      const key = `${page.owner_team || 'unassigned'}-${page.route_family}`;
      if (!ownerToPages[key]) ownerToPages[key] = [];
      ownerToPages[key].push(page);
    });

    Object.entries(ownerToPages).forEach(([key, pageList]) => {
      if (pageList.length > 2) {
        allAlerts.push({
          category: 'duplicate_ownership',
          severity: 'medium',
          icon: Users,
          title: 'Duplicate Page Ownership',
          description: `Team "${pageList[0].owner_team || 'unassigned'}" owns ${pageList.length} pages in ${pageList[0].route_family} family. May dilute accountability.`,
          affected: pageList.map(p => p.page_name).join(', '),
        });
      }
    });

    // 3. Layout-Family Conflicts
    layouts.forEach(layout => {
      const allowedFamilies = layout.allowed_route_families_json
        ? JSON.parse(layout.allowed_route_families_json)
        : [];
      
      if (allowedFamilies.length > 0) {
        pages.forEach(page => {
          if (page.layout_key === layout.layout_key && !allowedFamilies.includes(page.route_family)) {
            allAlerts.push({
              category: 'layout_family_conflict',
              severity: 'critical',
              icon: Zap,
              title: 'Layout-Family Conflict',
              description: `Page ${page.page_name} uses layout ${layout.layout_key} but ${page.route_family} is not allowed.`,
              affected: `${page.page_name} → ${layout.layout_key}`,
            });
          }
        });
      }
    });

    // 4. Pages Missing Access Rules
    pages.forEach(page => {
      if (!page.access_rules_json && page.route_family !== 'public' && page.active) {
        allAlerts.push({
          category: 'missing_access_rules',
          severity: 'high',
          icon: Lock,
          title: 'Missing Access Rules',
          description: `Page ${page.page_name} (${page.route_family}) has no access control defined.`,
          affected: page.page_name,
        });
      }
    });

    // 5. Deprecated Pages Still in Navigation
    navItems.forEach(item => {
      const page = pages.find(p => p.page_key === item.page_key);
      if (page?.deprecated && item.active) {
        allAlerts.push({
          category: 'deprecated_in_nav',
          severity: 'high',
          icon: AlertTriangle,
          title: 'Deprecated Page in Navigation',
          description: `Nav item "${item.label}" links to deprecated page ${page.page_name}.`,
          affected: `${item.label} → ${page.page_name}`,
        });
      }
    });

    return allAlerts;
  }, [pages, routes, layouts, navItems]);

  const alertsByCategory = {};
  alerts.forEach(alert => {
    if (!alertsByCategory[alert.category]) alertsByCategory[alert.category] = [];
    alertsByCategory[alert.category].push(alert);
  });

  const severityOrder = { critical: 0, high: 1, medium: 2 };
  const sortedCategories = Object.entries(alertsByCategory).sort((a, b) => {
    const aSeverity = Math.min(...a[1].map(al => severityOrder[al.severity] || 3));
    const bSeverity = Math.min(...b[1].map(al => severityOrder[al.severity] || 3));
    return aSeverity - bSeverity;
  });

  const severityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950/50 border-red-700/50';
      case 'high':
        return 'bg-orange-950/50 border-orange-700/50';
      case 'medium':
        return 'bg-amber-950/50 border-amber-700/50';
      default:
        return 'bg-slate-900/50 border-slate-700/50';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-slate-950 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-xs text-emerald-300 text-center">✓ No architecture conflicts detected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Architecture Conflicts
          </CardTitle>
          <Badge className="bg-red-950 text-red-300">
            {alerts.length} issues
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {sortedCategories.map(([category, categoryAlerts]) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {category.replace(/_/g, ' ')}
              </p>
              {categoryAlerts.map((alert, idx) => {
                const Icon = alert.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border flex gap-3 ${severityColor(alert.severity)}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 mt-1 opacity-70" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{alert.title}</p>
                        <Badge className={`text-xs ${
                          alert.severity === 'critical' ? 'bg-red-950 text-red-300' :
                          alert.severity === 'high' ? 'bg-orange-950 text-orange-300' :
                          'bg-amber-950 text-amber-300'
                        }`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="opacity-90 mb-1">{alert.description}</p>
                      <p className="text-slate-500 font-mono">
                        → {alert.affected}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}