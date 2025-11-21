import React from 'react';
import { BarChart3, Globe, Video, FileText, Users, TrendingUp } from 'lucide-react';
import Chatbot from '../components/Chatbot';

export default function Dashboard() {
  const stats = [
    { label: 'Website Visitors', value: '2,847', change: '+12%', icon: Users, color: 'blue' },
    { label: 'New Leads', value: '143', change: '+23%', icon: TrendingUp, color: 'green' },
    { label: 'Content Posted', value: '28', change: '+8%', icon: FileText, color: 'purple' },
    { label: 'Videos Created', value: '5', change: '+2', icon: Video, color: 'orange' }
  ];

  const recentActivity = [
    { type: 'Website', activity: 'Homepage updated with new content', time: '2 hours ago' },
    { type: 'SEO', activity: 'Local ranking improved to #3', time: '5 hours ago' },
    { type: 'Content', activity: 'New blog post published', time: '1 day ago' },
    { type: 'Video', activity: 'Product showcase video created', time: '2 days ago' },
    { type: 'Social', activity: 'Posted to Facebook and Instagram', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">New Tech Advertising</h1>
                <p className="text-sm text-slate-600">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Your Business</p>
                <p className="text-xs text-slate-600">Active Subscription</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h2>
          <p className="text-slate-600">Here's how your AI-powered marketing is performing.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            };
            
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase">{item.type}</span>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-700">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                <p className="font-semibold text-slate-900 mb-1">View Website</p>
                <p className="text-sm text-slate-600">Check your live site</p>
              </button>
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <p className="font-semibold text-slate-900 mb-1">Monthly Report</p>
                <p className="text-sm text-slate-600">See detailed analytics</p>
              </button>
              <button className="w-full text-left p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <p className="font-semibold text-slate-900 mb-1">Contact Support</p>
                <p className="text-sm text-slate-600">Get help from our team</p>
              </button>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-900 mb-1">Next Strategy Call</p>
              <p className="text-sm text-green-700">Friday, Jan 24 at 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="mb-4 opacity-90">
            Have questions or need assistance? Our AI chatbot is available 24/7 for instant support. Just click the chat icon!
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="tel:641-420-8816" className="font-semibold hover:underline">📞 641-420-8816</a>
            <a href="mailto:rick@newtechadvertising.com" className="font-semibold hover:underline">📧 rick@newtechadvertising.com</a>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}