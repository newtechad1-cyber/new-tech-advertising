import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Settings, HelpCircle } from 'lucide-react';

export default function SimplifiedDashboardEntry() {
  return (
    <div className="space-y-6">
      {/* Setup Complete Banner */}
      <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 rounded-2xl p-6 flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-white font-bold text-lg">Setup Complete! ✓</h2>
          <p className="text-slate-400 text-sm mt-1">Your marketing system is now active and running.</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all" />
      </div>

      {/* 4 Simple Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Content in Progress */}
        <Link to="#" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">📝 Content in Progress</h3>
                <p className="text-slate-400 text-sm mt-1">What's being created for you</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>3 posts scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>1 email draft</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>2 videos rendering</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Next Posts */}
        <Link to="#" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">🎬 Next Posts</h3>
                <p className="text-slate-400 text-sm mt-1">What's coming this week</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex items-center justify-between">
                <span>Tomorrow 10am</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Facebook</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Friday 2pm</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Instagram</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monday 9am</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">Email</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Channel Health */}
        <Link to="#" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">🌐 Channel Health</h3>
                <p className="text-slate-400 text-sm mt-1">Connection status</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex items-center justify-between">
                <span>Google</span>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Connected ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Facebook</span>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Connected ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Instagram</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">1 pending</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Performance Snapshot */}
        <Link to="#" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">📈 This Week's Performance</h3>
                <p className="text-slate-400 text-sm mt-1">Quick wins</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex items-center justify-between">
                <span>Visibility</span>
                <span className="text-green-400 font-semibold">+28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Engagement</span>
                <span className="text-white font-semibold">142 actions</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Qualified Leads</span>
                <span className="text-white font-semibold">4 this week</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-3">
        <Link to="#" className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
          <Settings className="w-4 h-4" /> Account Settings
        </Link>
        <div className="w-px bg-slate-700" />
        <Link to="#" className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
          <HelpCircle className="w-4 h-4" /> Help & Support
        </Link>
      </div>
    </div>
  );
}