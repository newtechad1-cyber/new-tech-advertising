import React from 'react';
import { Video, Clock, TrendingUp, Globe, Zap } from 'lucide-react';

function MetricCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">↑ {trend}</span>}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}

export default function VisibilityMetrics({ 
  contentPublished = 0, 
  upcomingScheduled = 0, 
  videoViews = 0, 
  websiteActivity = 0,
  campaignsRunning = 0 
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Marketing Momentum</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          icon={Video} 
          label="Content Published This Month" 
          value={contentPublished} 
          color="bg-blue-500"
          trend={contentPublished > 0 ? 'Active' : null}
        />
        <MetricCard 
          icon={Clock} 
          label="Upcoming Scheduled Posts" 
          value={upcomingScheduled} 
          color="bg-violet-500"
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Video Views Trend" 
          value={videoViews > 0 ? `${videoViews}+` : 'Building'} 
          color="bg-emerald-500"
          trend={videoViews > 0 ? 'Gaining' : null}
        />
        <MetricCard 
          icon={Globe} 
          label="Website Visibility Activity" 
          value={websiteActivity > 0 ? 'Active' : 'Ready'} 
          color="bg-orange-500"
        />
        <MetricCard 
          icon={Zap} 
          label="Campaigns Running" 
          value={campaignsRunning} 
          color="bg-pink-500"
        />
      </div>
    </div>
  );
}