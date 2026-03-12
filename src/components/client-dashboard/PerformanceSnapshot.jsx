import React from 'react';
import { TrendingUp, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PerformanceSnapshot({ clientProfile }) {
  const navigate = useNavigate();

  const metrics = [
    {
      label: 'Reach Trend',
      value: '+2,450',
      change: '+18%',
      icon: <Users className="w-5 h-5" />,
      color: 'blue',
    },
    {
      label: 'Engagement',
      value: '+340',
      change: '+24%',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'purple',
    },
    {
      label: 'Leads',
      value: '12',
      change: '+8%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">This Month's Performance</h2>
        <button
          onClick={() => navigate('/client/roi-reports')}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-2"
        >
          View Results
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg ${colorMap[metric.color]}`}>
                {metric.icon}
              </div>
              <span className="text-green-600 text-sm font-semibold">{metric.change}</span>
            </div>
            <p className="text-slate-600 text-sm mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}