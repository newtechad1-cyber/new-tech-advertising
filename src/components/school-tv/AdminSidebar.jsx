import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      { label: 'Dashboard', icon: 'LayoutDashboard', routeKey: 'dashboard' },
      { label: 'Analytics', icon: 'BarChart3', routeKey: 'analytics' },
    ],
  },
  {
    section: 'Content Intake',
    items: [
      { label: 'Submissions', icon: 'Upload', routeKey: 'submissions' },
    ],
  },
  {
    section: 'Production',
    items: [
      { label: 'Projects', icon: 'Briefcase', routeKey: 'projects.list' },
      { label: 'Render Queue', icon: 'Zap', routeKey: 'renderQueue.list' },
      { label: 'Video Library', icon: 'Film', routeKey: 'libraries.video' },
      { label: 'Story Library', icon: 'BookOpen', routeKey: 'libraries.story.list' },
      { label: 'Yearbook', icon: 'Calendar', routeKey: 'yearbook.root' },
    ],
  },
  {
    section: 'Content Management',
    items: [
      { label: 'Events', icon: 'Clock', routeKey: 'events.list' },
      { label: 'Spotlights', icon: 'Star', routeKey: 'spotlights.list' },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { label: 'AI Lab', icon: 'Sparkles', routeKey: 'aiLab.root' },
      { label: 'Activity', icon: 'Activity', routeKey: 'aiLab.activity' },
    ],
  },
  {
    section: 'Administration',
    items: [
      { label: 'Users', icon: 'Users', routeKey: 'users' },
      { label: 'Branding', icon: 'Palette', routeKey: 'branding' },
      { label: 'Settings', icon: 'Settings', routeKey: 'settings' },
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
  const [expandedSections, setExpandedSections] = useState(
    new Set(['Overview', 'Production'])
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

  const getRoute = (routeKey) => {
    // Handle nested route keys like 'projects.list'
    const keys = routeKey.split('.');
    let route = {
      'dashboard': 'dashboard',
      'analytics': 'analytics',
      'submissions': 'submissions',
      'projects': 'projects',
      'renderQueue': 'render-queue',
      'libraries': 'libraries',
      'video': 'video-library',
      'story': 'story-library',
      'yearbook': 'yearbook',
      'events': 'events',
      'spotlights': 'spotlights',
      'aiLab': 'ai-lab',
      'activity': 'ai-lab/activity',
      'users': 'users',
      'roles': 'roles',
      'branding': 'branding',
      'settings': 'settings',
    };
    
    // For route keys with dots, use the first part (e.g., 'projects.list' -> 'projects')
    const baseKey = keys[0];
    const routePath = route[baseKey] || routeKey.replace(/\./g, '/');
    
    return `/admin/schools/${schoolSlug}/${routePath}`;
  };

  const isActive = (route) => {
    return currentPath === route || currentPath.startsWith(route + '/');
  };

  return (
    <nav className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white">School Admin</h1>
        <p className="text-sm text-slate-400 mt-1">{schoolSlug}</p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {SIDEBAR_STRUCTURE.map((section) => (
          <div key={section.section} className="border-b border-slate-800 last:border-b-0">
            {/* Section Header */}
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

            {/* Section Items */}
            {expandedSections.has(section.section) && (
              <div className="bg-slate-800/50">
                {section.items.map((item) => {
                  const route = getRoute(item.routeKey);
                  const Icon = ICON_MAP[item.icon];
                  const active = isActive(route);

                  return (
                    <Link
                      key={item.routeKey}
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
        <p className="mt-2">Bulldog Story Lab</p>
      </div>
    </nav>
  );
}