import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { HelpCircle, Play, Home, Mail } from 'lucide-react';

export default function DashboardHelp({ readinessState }) {
  const options = [
    { icon: Play, label: 'Watch Demo', description: 'See how the platform works', link: 'Demo' },
    { icon: Home, label: 'Go to Homepage', description: 'Learn more about NTA', link: 'Home' },
    { icon: Mail, label: 'Contact Support', description: 'Call 641-420-8816', link: null, external: 'tel:6414208816' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-blue-400" />
        Need Help Getting Started?
      </h3>

      <div className="grid sm:grid-cols-3 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const content = (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{option.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{option.description}</p>
              </div>
            </div>
          );

          if (option.external) {
            return (
              <a
                key={option.label}
                href={option.external}
                className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-lg p-4 transition-all"
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={option.label}
              to={createPageUrl(option.link)}
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-lg p-4 transition-all"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}