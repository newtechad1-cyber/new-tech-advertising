import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, ChevronDown, ChevronRight } from 'lucide-react';

const PAGE_CATEGORIES_MAP = {
  'Executive Dashboards': {
    pages: ['AdminDashboard', 'ResellerDashboard', 'AdminOperations', 'AdminExecutive'],
    color: 'bg-purple-950/50 border-purple-700/50',
    badge: 'bg-purple-950 text-purple-300',
  },
  'Publishing': {
    pages: ['AdminPublishing', 'AdminVideos', 'AdminVideoDetail', 'AdminVideoLibrary', 'AdminVideoPublishing'],
    color: 'bg-indigo-950/50 border-indigo-700/50',
    badge: 'bg-indigo-950 text-indigo-300',
  },
  'Sales': {
    pages: ['AdminSales', 'AdminSalesDashboard', 'SalesRoom', 'AdminSalesAssets', 'AdminSalesFollowups'],
    color: 'bg-green-950/50 border-green-700/50',
    badge: 'bg-green-950 text-green-300',
  },
  'Client Experience': {
    pages: ['ClientDashboard', 'ClientApprovals', 'ClientCalendar', 'ClientReports', 'ClientFulfillment'],
    color: 'bg-cyan-950/50 border-cyan-700/50',
    badge: 'bg-cyan-950 text-cyan-300',
  },
  'Reseller': {
    pages: ['ResellerDashboard', 'ResellerClients', 'ResellerSettings', 'ResellerBranding', 'AdminResellers'],
    color: 'bg-pink-950/50 border-pink-700/50',
    badge: 'bg-pink-950 text-pink-300',
  },
  'Governance': {
    pages: ['AdminGovernance', 'AdminNavigation', 'AdminNavigationPages', 'AdminNavigationRoutes', 'AdminNavigationNav'],
    color: 'bg-orange-950/50 border-orange-700/50',
    badge: 'bg-orange-950 text-orange-300',
  },
  'AI Operations': {
    pages: ['AdminAgents', 'AdminAgentsWorkflows', 'AdminAgentsRecovery', 'AdminOrchestrator'],
    color: 'bg-blue-950/50 border-blue-700/50',
    badge: 'bg-blue-950 text-blue-300',
  },
  'School Media': {
    pages: ['AdminSchoolDashboard', 'AdminSchoolVideoLibrary', 'AdminSchoolSubmissions', 'AdminSchoolAnalytics'],
    color: 'bg-teal-950/50 border-teal-700/50',
    badge: 'bg-teal-950 text-teal-300',
  },
};

export default function PageCategoryBrowser({ pages = [] }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categorizedPages = useMemo(() => {
    const result = {};
    
    Object.entries(PAGE_CATEGORIES_MAP).forEach(([category, config]) => {
      const categoryPages = pages.filter(p => config.pages.includes(p.page_key));
      if (categoryPages.length > 0) {
        result[category] = {
          ...config,
          pages: categoryPages,
        };
      }
    });

    return result;
  }, [pages]);

  if (Object.keys(categorizedPages).length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-950 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Folder className="w-5 h-5 text-slate-400" />
          Page Categories
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {Object.entries(categorizedPages).map(([category, config]) => {
            const isExpanded = expandedCategory === category;

            return (
              <div key={category}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className={`w-full p-3 rounded border flex items-center justify-between transition-colors hover:border-opacity-100 ${config.color}`}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    )}
                    <span className="text-sm font-semibold">{category}</span>
                    <Badge className={`text-xs ${config.badge}`}>
                      {config.pages.length}
                    </Badge>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 ml-4 space-y-1 pl-3 border-l border-slate-700">
                    {config.pages.map((page, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900/30 text-xs">
                        <p className="text-white font-semibold">{page.page_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-500 font-mono text-xs">{page.page_key}</span>
                          <Badge className="bg-slate-900 text-slate-300 text-xs">
                            {page.route_family.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        {page.owner_team && (
                          <p className="text-slate-400 text-xs mt-1">👤 {page.owner_team}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}