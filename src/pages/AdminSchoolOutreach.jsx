import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';

export default function AdminSchoolOutreach() {
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['school_campaigns'],
    queryFn: () => base44.entities.SchoolOutreachCampaigns.list(),
    initialData: [],
  });

  const { data: activities } = useQuery({
    queryKey: ['outreach_activities'],
    queryFn: () => base44.entities.SchoolOutreachActivity.list(),
    initialData: [],
  });

  const { data: leads } = useQuery({
    queryKey: ['school_leads_stats'],
    queryFn: () => base44.entities.SchoolLeads.list(),
    initialData: [],
  });

  const recentActivities = activities.slice(0, 10);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Outreach Campaigns</h1>
          <p className="text-slate-600 mt-2">Manage email campaigns and outreach sequences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-slate-900">{campaigns.length}</div>
            <div className="text-sm text-slate-600">Active Campaigns</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{leads.filter(l => l.outreach_status === 'contacted').length}</div>
            <div className="text-sm text-slate-600">Contacted</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-cyan-600">{leads.filter(l => l.outreach_status === 'replied').length}</div>
            <div className="text-sm text-slate-600">Replied</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-600">{leads.filter(l => l.demo_booked).length}</div>
            <div className="text-sm text-slate-600">Demos Booked</div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="bg-white rounded-lg border border-slate-200 mb-6">
          {campaignsLoading ? (
            <div className="p-8 text-center text-slate-600">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No campaigns created yet</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{campaign.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Region: {campaign.target_region} • Type: {campaign.campaign_type?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <Badge className={campaign.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                      {campaign.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <button
                    onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
                  >
                    {expandedCampaign === campaign.id ? 'Hide Templates' : 'View Email Templates'}
                  </button>

                  {expandedCampaign === campaign.id && (
                    <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
                      {campaign.message_1 && (
                        <div className="bg-slate-50 rounded p-4">
                          <div className="font-semibold text-sm text-slate-900 mb-2">📧 Email 1: Intro</div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{campaign.message_1}</p>
                        </div>
                      )}
                      {campaign.message_2 && (
                        <div className="bg-slate-50 rounded p-4">
                          <div className="font-semibold text-sm text-slate-900 mb-2">📧 Email 2: Follow-up</div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{campaign.message_2}</p>
                        </div>
                      )}
                      {campaign.message_3 && (
                        <div className="bg-slate-50 rounded p-4">
                          <div className="font-semibold text-sm text-slate-900 mb-2">📧 Email 3: Final Check-in</div>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{campaign.message_3}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-bold text-slate-900">Recent Outreach Activity</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-center text-slate-600">No activity yet</div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="font-semibold text-slate-900">{activity.activity_type?.replace(/_/g, ' ')}</span>
                      <Badge className="text-xs">
                        {activity.response_status}
                      </Badge>
                    </div>
                    {activity.subject && <p className="text-sm text-slate-700">{activity.subject}</p>}
                    {activity.message && <p className="text-sm text-slate-600 mt-1">{activity.message.substring(0, 100)}...</p>}
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 flex gap-3">
          <Link to={createPageUrl('AdminSchoolLeads')}>
            <Button variant="outline">Back to Leads</Button>
          </Link>
          <Link to={createPageUrl('AdminSchoolPipeline')}>
            <Button variant="outline">View Pipeline</Button>
          </Link>
          <a href="https://www.schooltv.com/schooltv-deal-room" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">View Deal Room</Button>
          </a>
        </div>
      </div>
    </div>
  );
}