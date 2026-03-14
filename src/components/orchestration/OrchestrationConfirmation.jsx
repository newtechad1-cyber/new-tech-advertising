import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export default function OrchestrationConfirmation({ orchestrationData }) {
  if (!orchestrationData) return null;

  return (
    <div className="space-y-6">
      {/* Activation Confirmation */}
      <Card className="border-2 border-green-500 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <CardTitle className="text-green-900">Live Orchestration Activated</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-green-800">
          <p className="font-semibold mb-2">
            ✅ All campaigns are now ACTIVE and publishing
          </p>
          <p className="text-sm">
            Activated at: {new Date(orchestrationData.orchestration_details.activation_timestamp).toLocaleString('en-US', { timeZone: 'America/Chicago' })}
          </p>
        </CardContent>
      </Card>

      {/* Active Campaign List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Active Campaign Groups</h3>
        {orchestrationData.active_campaigns.map((campaign, idx) => (
          <Card key={idx} className="border-l-4 border-blue-500">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Campaign</p>
                  <p className="text-base font-bold text-slate-900">{campaign.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                  <Badge className="bg-green-600">ACTIVE - {campaign.content_queue_status}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Territories</p>
                  <p className="text-sm text-slate-700">
                    {(campaign.territories || campaign.regions || []).join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Posting Cadence</p>
                  <p className="font-semibold text-slate-900">
                    {campaign.posting_cadence === '2_posts_per_day' ? '2 posts/day' : '1-2 posts/day'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Distribution Channels</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.channels.map((ch, cidx) => (
                    <Badge key={cidx} variant="outline" className="text-xs">
                      {ch.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Production Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Content Production Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(orchestrationData.content_generation_status).map(([campaign, status], idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <p className="text-sm font-medium text-slate-700 capitalize">
                {campaign.replace(/_/g, ' ')}
              </p>
              <Badge className={status === 'generated' ? 'bg-green-600' : 'bg-yellow-600'}>
                {status === 'generated' ? 'Generated' : 'Pending'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Posting Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Posting Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(orchestrationData.posting_schedule).map(([campaign, schedule], idx) => (
            <div key={idx} className="border-l-4 border-blue-400 pl-4">
              <p className="text-sm font-semibold text-slate-900 capitalize mb-1">
                {campaign.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-slate-600">{schedule}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Channels Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Active Channels Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {orchestrationData.channels.map((channel, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-sm font-semibold text-slate-900 capitalize">
                  {channel.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-600 mt-1">Auto-posting enabled</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Timeline */}
      <Card className="border-blue-500 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Publishing Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-900 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">📅</span>
            <p><strong>Now:</strong> Content queues populated</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">⏰</span>
            <p><strong>Next Scheduling Window:</strong> Automated publishing begins (1-2 posts/day per campaign)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">📊</span>
            <p><strong>Continuous:</strong> Cross-channel distribution across all territories</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">3</p>
            <p className="text-xs text-slate-600 mt-2">Campaign Groups Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">4</p>
            <p className="text-xs text-slate-600 mt-2">Territories Covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">6+</p>
            <p className="text-xs text-slate-600 mt-2">Channels Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-600">25-30</p>
            <p className="text-xs text-slate-600 mt-2">Posts/Week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}