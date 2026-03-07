import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BrainCircuit, Video, Tv, Calendar, FileText } from 'lucide-react';

const TOOLS = [
  { icon: Calendar, label: 'Weekly Plans', description: 'Get direction for this week', link: 'GrowthSystem' },
  { icon: BrainCircuit, label: 'Content Engine', description: 'Generate blog & social posts', link: 'AiSocialMedia' },
  { icon: Video, label: 'Video Studio', description: 'Create marketing videos', link: 'AiVideos' },
  { icon: Tv, label: 'TV Commercials', description: 'Streaming TV ad scripts', link: 'TvCommercialScriptGenerator' },
  { icon: FileText, label: 'Blog Posts', description: 'SEO-ready articles', link: 'AiSocialMedia' },
];

export default function DashboardQuickTools() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Quick Access</h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.label}
              to={createPageUrl(tool.link)}
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-lg p-4 transition-all group"
            >
              <div className="w-8 h-8 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-violet-600/30 transition-colors">
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{tool.label}</p>
              <p className="text-slate-500 text-xs">{tool.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}