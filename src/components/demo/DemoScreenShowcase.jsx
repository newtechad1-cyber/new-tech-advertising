import React from 'react';
import { BarChart3, Calendar, Activity, TrendingUp } from 'lucide-react';

const screens = {
  1: {
    title: 'Client Dashboard',
    subtitle: 'Marketing running at a glance',
    icon: Activity,
    description: 'See your entire marketing system status in one place. Content scheduled, visibility trending, engagement happening — all transparent.',
    mockElements: ['Status Overview', 'Content Timeline', 'Channel Health', 'Performance Metrics']
  },
  2: {
    title: 'Content Pipeline',
    subtitle: 'Production visibility and control',
    icon: Calendar,
    description: 'Track every piece of content from creation through publishing. Know what\'s coming, what\'s approved, what\'s scheduled.',
    mockElements: ['In Production', 'Needs Approval', 'Scheduled', 'Published']
  },
  3: {
    title: 'Channel Connection',
    subtitle: 'Operational control',
    icon: BarChart3,
    description: 'Connect and manage all your social channels, websites, and publishing platforms in one place. Real-time sync, no manual re-posting.',
    mockElements: ['Facebook', 'Instagram', 'Google Business', 'Website']
  },
  4: {
    title: 'Publishing Calendar',
    subtitle: 'System consistency made visible',
    icon: Calendar,
    description: 'See your entire content strategy laid out week by week. Consistency that builds visibility. No surprises, no gaps.',
    mockElements: ['Weekly View', 'Channel Distribution', 'Timing Optimization', 'Engagement Projections']
  },
  5: {
    title: 'ROI Results',
    subtitle: 'Proof that marketing is working',
    icon: TrendingUp,
    description: 'Not vanity metrics—real business results. Visibility growth, engagement momentum, and customer actions that matter.',
    mockElements: ['Visibility Trends', 'Engagement Metrics', 'Customer Actions', 'Month-over-Month Growth']
  }
};

export default function DemoScreenShowcase({ screenIndex }) {
  const screen = screens[screenIndex];
  if (!screen) return null;

  const Icon = screen.icon;

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8">
      <div className="flex items-start gap-4 mb-6">
        <Icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{screen.title}</h3>
          <p className="text-blue-400">{screen.subtitle}</p>
        </div>
      </div>

      <p className="text-slate-200 mb-8 leading-relaxed">
        {screen.description}
      </p>

      {/* Mock Screen Representation */}
      <div className="bg-slate-800 rounded-lg p-8 mb-8 min-h-64 flex flex-col items-center justify-center">
        <Icon className="w-16 h-16 text-slate-600 mb-4" />
        <p className="text-slate-500 text-center">
          Live walkthrough of {screen.title.toLowerCase()}
        </p>
      </div>

      {/* Key Elements */}
      <div className="grid grid-cols-2 gap-4">
        {screen.mockElements.map((element, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-lg text-center">
            <p className="text-slate-300 font-medium">{element}</p>
          </div>
        ))}
      </div>
    </div>
  );
}