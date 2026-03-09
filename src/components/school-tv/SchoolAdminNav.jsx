import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Upload,
  Film,
  Zap,
  Video,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Sparkles,
  MessageSquare,
  Layout,
  Activity,
  Users,
  Shield,
  Palette,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { ADMIN_SIDEBAR_STRUCTURE, getAdminRoute } from './schoolRouteConfig';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  LayoutDashboard,
  BarChart3,
  Upload,
  Film,
  Zap,
  Video,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Sparkles,
  MessageSquare,
  Layout,
  Activity,
  Users,
  Shield,
  Palette,
  Settings,
};

export default function SchoolAdminNav({ schoolSlug, currentPath }) {
  const [expandedSections, setExpandedSections] = useState(new Set(['Overview', 'Production']));

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (route) => {
    return currentPath === route || currentPath.startsWith(route + '/');
  };

  return (
    <nav className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white">School Admin</h1>
        <p className="text-sm text-slate-400 mt-1">{schoolSlug}</p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {ADMIN_SIDEBAR_STRUCTURE.map((section) => (
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
                  const route = getAdminRoute(item.routeKey, schoolSlug);
                  const Icon = ICON_MAP[item.icon];
                  const active = isActive(route);

                  return (
                    <Link
                      key={item.routeKey}
                      to={route}
                      className={cn(
                        'px-6 py-3 flex items-center gap-3 transition-colors border-l-4 block',
                        active
                          ? 'bg-slate-700 border-blue-500 text-white'
                          : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span className="text-sm">{item.label}</span>
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
        <p className="mt-2">Multi-School Admin Portal</p>
      </div>
    </nav>
  );
}