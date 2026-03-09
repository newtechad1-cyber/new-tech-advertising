import React from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';

export default function AdminDashboard() {
  const { schoolSlug } = useParams();

  return (
    <AdminShell currentPath={`/admin/schools/${schoolSlug}/dashboard`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending Submissions', value: '12', color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Approved Stories', value: '34', color: 'bg-green-100 text-green-800' },
            { label: 'Renders in Queue', value: '5', color: 'bg-blue-100 text-blue-800' },
            { label: 'Published Items', value: '89', color: 'bg-purple-100 text-purple-800' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <p className={`text-4xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>No recent activity</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button className="block text-blue-600 hover:underline text-sm">Review Submissions</button>
              <button className="block text-blue-600 hover:underline text-sm">Check Render Queue</button>
              <button className="block text-blue-600 hover:underline text-sm">Configure Branding</button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}