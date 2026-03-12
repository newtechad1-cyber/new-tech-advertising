import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateNavRoutes, ROUTE_FAMILIES } from '@/components/config/routeMap';

const ADMIN_NAV_STRUCTURE = [
  {
    id: 'command-center',
    title: 'Command Center',
    icon: '⚡',
    items: [
      { label: 'Dashboard', page: 'AdminDashboard' },
      { label: 'Command Center', page: 'AdminCommandCenter' },
      { label: 'AI Control Center', page: 'AdminAIControlCenter' },
      { label: 'Job Queue', page: 'ScheduledQueue' },
      { label: 'Outputs Awaiting Review', page: 'AdminAILab' },
    ],
  },
  {
    id: 'content-engine',
    title: 'Content Engine',
    icon: '📝',
    items: [
      { label: 'Content Dashboard', page: 'ContentEngine' },
      { label: 'Blog Articles', page: 'AdminBlog' },
      { label: 'Authority Planner', page: 'AuthorityMap' },
      { label: 'Content Queue', page: 'ContentQueue' },
      { label: 'Social Content', page: 'SocialMediaManagement' },
    ],
  },
  {
    id: 'video-engine',
    title: 'Video Engine',
    icon: '🎬',
    items: [
      { label: 'AI Video Studio', page: 'AdminAIVideoStudio' },
      { label: 'Video Requests', page: 'AdminVideoEngineRequests' },
      { label: 'Video Renders', page: 'AdminVideoEngineRenders' },
      { label: 'Video Library', page: 'AdminVideoLibrary' },
    ],
  },
  {
    id: 'publishing',
    title: 'Publishing & Distribution',
    icon: '📡',
    items: [
      { label: 'Publishing Queue', page: 'AdminVideoPublishing' },
      { label: 'Channel Connections', page: 'AdminConnections' },
      { label: 'Meta Setup', page: 'AdminMetaSetup' },
      { label: 'YouTube Setup', page: 'AdminYouTubeSetup' },
    ],
  },
  {
    id: 'schools',
    title: 'Schools',
    icon: '🏫',
    // These are intentional cross-family links — school admin pages accessed from main admin nav
    items: [
      { label: 'School Dashboard', page: 'AdminSchoolDashboard', allowCrossFamily: true },
      { label: 'Submissions', page: 'AdminSchoolSubmissions', allowCrossFamily: true },
      { label: 'Projects', page: 'AdminSchoolProjects', allowCrossFamily: true },
      { label: 'Story Library', page: 'AdminSchoolStoryLibrary', allowCrossFamily: true },
      { label: 'Video Library', page: 'AdminSchoolVideoLibrary', allowCrossFamily: true },
      { label: 'Yearbook', page: 'AdminSchoolYearbook', allowCrossFamily: true },
      { label: 'Events', page: 'AdminSchoolEvents', allowCrossFamily: true },
      { label: 'Spotlights', page: 'AdminSchoolSpotlights', allowCrossFamily: true },
      { label: 'Render Queue', page: 'AdminSchoolRenderQueue', allowCrossFamily: true },
      { label: 'AI Dashboard', page: 'AdminSchoolAIDashboard', allowCrossFamily: true },
      { label: 'Settings', page: 'AdminSchoolSettings', allowCrossFamily: true },
    ],
  },
  {
    id: 'sales-revenue',
    title: 'Sales & Revenue',
    icon: '💰',
    items: [
      { label: 'Leads', page: 'LeadsDashboard' },
      { label: 'Sales Room', page: 'SalesRoom' },
      { label: 'Deal Room', page: 'DealRoom' },
      { label: 'Proposals', page: 'ProposalPipeline' },
      { label: 'Clients', page: 'AdminClients' },
      { label: 'Opportunities', page: 'AdminRevenueEngine' },
    ],
  },
  {
    id: 'operations',
    title: 'Client Operations',
    icon: '🔧',
    items: [
      { label: 'Fulfillment Monitor', page: 'AdminFulfillment' },
      { label: 'Client Accounts', page: 'AdminClients' },
      { label: 'Onboarding', page: 'AdminOnboarding' },
      { label: 'Requests', page: 'AdminAlerts' },
      { label: 'Reporting', page: 'AdminAnalytics' },
    ],
  },
  {
    id: 'automations',
    title: 'Automations',
    icon: '⚙️',
    items: [
      { label: 'Active Automations', page: 'ScheduledQueue' },
      { label: 'Triggers', page: 'AdminPlatform' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: '📊',
    items: [
      { label: 'Executive Dashboard', page: 'AdminExecutive' },
      { label: 'Performance Reports', page: 'AdminAnalytics' },
      { label: 'Client Performance', page: 'AdminAnalytics' },
    ],
  },
  {
    id: 'founder-planner',
    title: 'Founder Planner',
    icon: '🧭',
    items: [
      { label: 'Weekly Planner', page: 'AdminFounderPlanner' },
      { label: 'Founder Scorecard', page: 'FounderScorecard' },
      { label: 'Priority Intelligence', page: 'AdminFounderPriorities' },
      { label: 'Weekly Scorecard', page: 'AdminFounderScorecardWeekly' },
    ],
  },
  {
    id: 'vertical-intelligence',
    title: 'Vertical Intelligence',
    icon: '🎯',
    items: [
      { label: 'Industry Verticals', page: 'AdminVerticalIntelligence' },
      { label: 'Revenue Analytics', page: 'AdminVerticalRevenue' },
      { label: 'Campaign Intelligence', page: 'AdminVerticalCampaigns' },
      { label: 'Expansion Engine', page: 'AdminVerticalExpansion' },
      { label: 'Expansion Playbook', page: 'AdminExpansionPlaybook' },
      { label: 'Execution Tracker', page: 'AdminExpansionExecution' },
      { label: 'Territory Activation', page: 'AdminExpansionTerritories' },
      { label: 'Expansion Revenue', page: 'AdminExpansionRevenue' },
    ],
  },
  {
    id: 'system',
    title: 'System',
    icon: '⚙️',
    items: [
      { label: 'QA Center', page: 'AdminQA' },
      { label: 'Users & Permissions', page: 'AdminUsers' },
      { label: 'Settings', page: 'AdminSettings' },
      { label: 'System Health', page: 'AdminSystemHealth' },
    ],
  },
];

// ── Route validation — runs once at module load in dev ────────────────────────
validateNavRoutes(ADMIN_NAV_STRUCTURE, ROUTE_FAMILIES.MAIN_ADMIN, 'AdminLayout/AdminSidebar');

function SidebarSection({ section, isOpen, onToggle, isActive, currentPageName, isCollapsed }) {
  const isExpanded = isOpen && !isCollapsed;
  const sectionActive = isActive || section.items.some(item => item.page === currentPageName);

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
          sectionActive ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <span className="text-base">{section.icon}</span>
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left truncate">{section.title}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      {isExpanded && !isCollapsed && (
        <div className="ml-2 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
          {section.items.map(item => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={cn(
                'block px-3 py-2 text-xs rounded-md transition-colors',
                currentPageName === item.page
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  currentPageName,
}) {
  const [expandedSections, setExpandedSections] = useState(new Set(['command-center']));

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Auto-expand section containing current page
  useMemo(() => {
    ADMIN_NAV_STRUCTURE.forEach(section => {
      if (section.items.some(item => item.page === currentPageName)) {
        setExpandedSections(prev => new Set(prev).add(section.id));
      }
    });
  }, [currentPageName]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex flex-col bg-gray-900 text-white transition-all duration-300 border-r border-gray-800',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className={cn('px-4 py-6 border-b border-gray-800', isCollapsed && 'flex justify-center')}>
          {isCollapsed ? (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              NTA
            </div>
          ) : (
            <div>
              <div className="font-bold text-lg">NTA Admin</div>
              <div className="text-xs text-gray-400">Operating System</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {ADMIN_NAV_STRUCTURE.map(section => (
            <SidebarSection
              key={section.id}
              section={section}
              isOpen={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              isActive={false}
              currentPageName={currentPageName}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Footer */}
        <div className={cn('px-4 py-4 border-t border-gray-800', isCollapsed && 'flex justify-center')}>
          {!isCollapsed && (
            <div className="text-xs text-gray-400">
              <div className="font-semibold text-gray-300 mb-2">Quick Links</div>
              <div className="space-y-1">
                <a href="#" className="block text-gray-400 hover:text-gray-200">Docs</a>
                <a href="#" className="block text-gray-400 hover:text-gray-200">Help</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="flex flex-col w-64 h-full bg-gray-900 text-white">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <div className="font-bold text-lg">NTA Admin</div>
              <button onClick={onClose} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {ADMIN_NAV_STRUCTURE.map(section => (
                <SidebarSection
                  key={section.id}
                  section={section}
                  isOpen={expandedSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  isActive={false}
                  currentPageName={currentPageName}
                  isCollapsed={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}