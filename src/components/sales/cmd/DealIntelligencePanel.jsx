import React, { useState } from 'react';
import { Eye, TrendingUp, FileText, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DealIntelligencePanel() {
  const [activeTab, setActiveTab] = useState('views');

  const intelligence = {
    views: [
      { company: 'ABC HVAC', section: 'Growth Plan Pricing', views: 2, timestamp: '2 hours ago' },
      { company: 'Summit Plumbing', section: 'Implementation Timeline', views: 1, timestamp: '4 hours ago' },
      { company: 'Elite Roofing', section: 'Pricing Options', views: 3, timestamp: 'Yesterday' }
    ],
    signals: [
      { company: 'ABC HVAC', signal: 'Viewed Growth Authority Plan twice', type: 'tier_interest' },
      { company: 'Metro Electric', signal: 'Spent 8 min on Decision Panel', type: 'high_intent' },
      { company: 'Quality Painting', signal: 'No activity in 3 days', type: 'stalled' }
    ],
    proposals: [
      { company: 'Summit Plumbing', date: 'Requested today', status: 'pending' },
      { company: 'Elite Roofing', date: 'Requested 2 days ago', status: 'viewed' }
    ],
    objections: [
      { company: 'Green Landscaping', objection: 'Price too high for startup', action: 'Call scheduled' },
      { company: 'Fitness Plus', objection: 'Wants to see more video examples', action: 'Demo scheduled' }
    ]
  };

  const tabs = [
    { id: 'views', label: 'Recently Viewed', icon: Eye, count: intelligence.views.length },
    { id: 'signals', label: 'Interest Signals', icon: TrendingUp, count: intelligence.signals.length },
    { id: 'proposals', label: 'Proposals', icon: FileText, count: intelligence.proposals.length },
    { id: 'objections', label: 'Objections', icon: AlertTriangle, count: intelligence.objections.length }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
              <span className={`ml-1 px-2 py-1 rounded text-xs font-bold ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'views' && (
          <div className="space-y-4">
            {intelligence.views.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">{item.company}</p>
                  <p className="text-sm text-slate-600">{item.section}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{item.views}</p>
                  <p className="text-xs text-slate-600">views</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-4">
            {intelligence.signals.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">{item.company}</p>
                  <p className="text-sm text-slate-600">{item.signal}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 whitespace-nowrap">
                  View Deal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {intelligence.proposals.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">{item.company}</p>
                  <p className="text-sm text-slate-600">{item.date}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded ${
                  item.status === 'viewed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'objections' && (
          <div className="space-y-4">
            {intelligence.objections.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-semibold text-slate-900">{item.company}</p>
                  <p className="text-sm text-slate-600">{item.objection}</p>
                  <p className="text-xs text-red-600 font-semibold mt-2">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}