import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard,
  Upload,
  Briefcase,
  Zap,
  Film,
  BookOpen,
  Calendar,
  Star,
  Sparkles,
  BarChart3,
  Users,
  Palette,
  Settings,
  ChevronDown,
  Clock,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_STRUCTURE = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'LayoutDashboard', page: 'AdminSchoolDashboard' },
      { label: 'Analytics', icon: 'BarChart3', page: 'AdminSchoolAnalytics' },
    ],
  },
  {
    section: 'Content Intake',
    items: [
      { label: 'Submissions', icon: 'Upload', page: 'AdminSchoolSubmissions' },
    ],
  },
  {
    section: 'Production',
    items: [
      { label: 'Projects', icon: 'Briefcase', page: 'AdminSchoolProjects' },
      { label: 'Render Queue', icon: 'Zap', page: 'AdminSchoolRenderQueue' },
      { label: 'Video Library', icon: 'Film', page: 'AdminSchoolVideoLibrary' },
      { label: 'Story Library', icon: 'BookOpen', page: 'AdminSchoolStoryLibrary' },
      { label: 'Yearbook', icon: 'Calendar', page: 'AdminSchoolYearbook' },
    ],
  },
  {
    section: 'Content Management',
    items: [
      { label: 'Events', icon: 'Clock', page: 'AdminSchoolEvents' },
      { label: 'Spotlights', icon: 'Star', page: 'AdminSchoolSpotlights' },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { label: 'AI Lab', icon: 'Sparkles', page: 'AdminSchoolAIDashboard' },
      { label: 'Activity', icon: 'Activity', page: 'AdminSchoolAILab' },
    ],
  },
  {
    section: 'Administration',
    items: [
      { label: 'Users', icon: 'Users', page: 'AdminSchoolUsers' },
      { label: 'Branding', icon: 'Palette', page: 'AdminSchoolBranding' },
      { label: 'Settings', icon: 'Settings', page: 'AdminSchoolSettings' },
    ],
  },
];

const ICON_MAP = {
  LayoutDashboard,
  BarChart3,
  Upload,
  Briefcase,
  Zap,
  Film,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Sparkles,
  Activity,
  Users,
  Palette,
  Settings,
};

export default function AdminSidebar({ schoolSlug, currentPath }) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(
    new Set(['Overview', 'Production', 'Content Intake'])
  );

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRoute = (page) => {
    return `${createPageUrl(page)}?schoolSlug=${schoolSlug || 'hampton-dumont'}`;
  };

  const isActive = (page) => {
    const currentPage = location.pathname.replace('/', '');
    return currentPage === page;
  };

  return (
    <nav className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white">School Admin</h1>
        <p className="text-sm text-slate-400 mt-1">{schoolSlug || 'hampton-dumont'}</p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {SIDEBAR_STRUCTURE.map((section) => (
          <div key={section.section} className="border-b border-slate-800 last:border-b-0">
            <button
              onClick={() => toggleSection(section.section)}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                {section.section}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedSections.has(section.section) ? 'rotate-180' : ''
                )}
              />
            </button>

            {expandedSections.has(section.section) && (
              <div className="bg-slate-800/50">
                {section.items.map((item) => {
                  const route = getRoute(item.page);
                  const Icon = ICON_MAP[item.icon];
                  const active = isActive(item.page);

                  return (
                    <Link
                      key={item.page}
                      to={route}
                      className={cn(
                        'px-6 py-3 flex items-center gap-3 transition-colors border-l-4 block text-sm',
                        active
                          ? 'bg-slate-700 border-blue-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        <p>School Story Lab</p>
        <p className="mt-1">Bulldog Story Lab</p>
      </div>
    </nav>
  );
}