import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_BREADCRUMBS = {
  // Command Center
  AdminDashboard: [{ label: 'Admin', page: 'AdminDashboard' }, { label: 'Dashboard' }],
  AdminAIControlCenter: [{ label: 'Admin', page: 'AdminDashboard' }, { label: 'Command Center', page: 'AdminAIControlCenter' }, { label: 'AI Control Center' }],
  AdminAIVideoStudio: [{ label: 'Admin' }, { label: 'Command Center' }, { label: 'AI Video Studio' }],
  ScheduledQueue: [{ label: 'Admin' }, { label: 'Command Center' }, { label: 'Job Queue' }],

  // Content Engine
  ContentEngine: [{ label: 'Admin' }, { label: 'Content Engine' }, { label: 'Dashboard' }],
  AdminBlog: [{ label: 'Admin' }, { label: 'Content Engine' }, { label: 'Blog Articles' }],
  AuthorityMap: [{ label: 'Admin' }, { label: 'Content Engine' }, { label: 'Authority Planner' }],

  // Video Engine
  AdminVideoLibrary: [{ label: 'Admin' }, { label: 'Video Engine' }, { label: 'Video Library' }],
  AdminVideoEngineRequests: [{ label: 'Admin' }, { label: 'Video Engine' }, { label: 'Video Requests' }],
  AdminVideoEngineRenders: [{ label: 'Admin' }, { label: 'Video Engine' }, { label: 'Video Renders' }],

  // Schools
  AdminSchoolDashboard: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Dashboard' }],
  AdminSchoolSubmissions: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Submissions' }],
  AdminSchoolProjects: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Projects' }],
  AdminSchoolProjectDetail: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Projects' }, { label: 'Project Detail' }],
  AdminSchoolStoryLibrary: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Story Library' }],
  AdminSchoolVideoLibrary: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Video Library' }],
  AdminSchoolYearbook: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Yearbook' }],
  AdminSchoolEvents: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Events' }],
  AdminSchoolSpotlights: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Spotlights' }],
  AdminSchoolRenderQueue: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Render Queue' }],
  AdminSchoolAIDashboard: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'AI Dashboard' }],
  AdminSchoolSettings: [{ label: 'Admin' }, { label: 'Schools' }, { label: 'Settings' }],

  // Sales & Operations
  LeadsDashboard: [{ label: 'Admin' }, { label: 'Sales & Revenue' }, { label: 'Leads' }],
  SalesRoom: [{ label: 'Admin' }, { label: 'Sales & Revenue' }, { label: 'Sales Room' }],
  DealRoom: [{ label: 'Admin' }, { label: 'Sales & Revenue' }, { label: 'Deal Room' }],
  AdminClients: [{ label: 'Admin' }, { label: 'Sales & Revenue' }, { label: 'Clients' }],
  AdminFulfillment: [{ label: 'Admin' }, { label: 'Operations' }, { label: 'Fulfillment Monitor' }],

  // Analytics & System
  AdminExecutive: [{ label: 'Admin' }, { label: 'Analytics' }, { label: 'Executive Dashboard' }],
  AdminAnalytics: [{ label: 'Admin' }, { label: 'Analytics' }, { label: 'Reports' }],
  AdminQA: [{ label: 'Admin' }, { label: 'System' }, { label: 'QA Center' }],
  AdminSettings: [{ label: 'Admin' }, { label: 'System' }, { label: 'Settings' }],
};

export default function AdminBreadcrumbs({ currentPageName }) {
  const crumbs = PAGE_BREADCRUMBS[currentPageName] || [{ label: 'Admin' }, { label: 'Page' }];

  return (
    <nav className="flex items-center gap-2" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {crumb.page ? (
            <Link
              to={createPageUrl(crumb.page)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={cn(
              'text-sm',
              idx === crumbs.length - 1
                ? 'font-semibold text-gray-900'
                : 'text-gray-500'
            )}>
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}