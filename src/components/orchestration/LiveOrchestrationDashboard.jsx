import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Zap, Play, Pause, Activity, TrendingUp } from 'lucide-react';

export default function LiveOrchestrationDashboard() {
  const [orchestrationStatus, setOrchestrationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  const activateOrchestration = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('activateLiveOrchestration', {});
      setOrchestrationStatus(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrchestration = () => {
    setIsPaused(!isPaused);
  };

  if (!orchestrationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Live Agent Orchestration Control
            </h1>
            <p className="text-xl text-blue-200">
              Deploy automated content production across all territories & channels
            </p>
          </div>

          {/* Activation Card */}
          <Card className="border-2 border-blue-500 bg-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Orchestration Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded p-4 border border-blue-400">
                  <p className="text-sm text-blue-200 mb-2">Campaign Groups</p>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-slate-400 mt-1">Regional Authority, HVAC, Restaurant</p>
                </div>
                <div className="bg-slate-700 rounded p-4 border border-blue-400">
                  <p className="text-sm text-blue-200 mb-2">Territories Active</p>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-xs text-slate-400 mt-1">Mason City, Austin, Albert Lea, Rochester</p>
                </div>
                <div className="bg-slate-700 rounded p-4 border border-blue-400">
                  <p className="text-sm text-blue-200 mb-2">Channels</p>
                  <p className="text-2xl font-bold text-white">6+</p>
                  <p className="text-xs text-slate-400 mt-1">Facebook, IG, Google, LinkedIn, TikTok, YouTube</p>
                </div>
              </div>

              {/* Campaigns Preview */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-200">Campaigns to Deploy:</p>
                {[
                  {
                    name: 'Regional Authority Campaign',
                    desc: 'AI marketing system awareness (2 posts/day)',
                    icon: '🌐'
                  },
                  {
                    name: 'HVAC Territorial Domination',
                    desc: '4 territories × seasonal service urgency (1-2 posts/day)',
                    icon: '❄️'
                  },
                  {
                    name: 'Restaurant Territorial Domination',
                    desc: '4 territories × weekly promotions (1-2 posts/day)',
                    icon: '🍽️'
                  }
                ].map((camp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700 rounded border border-blue-400 p-3 flex items-start gap-3"
                  >
                    <span className="text-xl">{camp.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{camp.name}</p>
                      <p className="text-xs text-slate-300">{camp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activation Button */}
              <Button
                onClick={activateOrchestration}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 gap-2 text-lg"
              >
                {isLoading ? (
                  <>Activating...</>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    ACTIVATE LIVE ORCHESTRATION
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-900 border border-red-500 rounded p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Live Orchestration Dashboard</h1>
            <p className="text-green-200 text-sm mt-1">
              {isPaused ? '⏸️ PAUSED' : '✅ ACTIVE'} - Agent Orchestration Running
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={toggleOrchestration}
              variant="outline"
              className={`gap-2 ${isPaused ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Activation Summary */}
        <Card className="border-2 border-green-500 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Orchestration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-200 mb-1">Activation Time</p>
                <p className="text-white font-mono text-sm">
                  {new Date(orchestrationStatus.orchestration_details.activation_timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-200 mb-1">Mode</p>
                <Badge className="bg-green-600">LIVE ORCHESTRATION ACTIVE</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Active Campaigns ({orchestrationStatus.active_campaigns.length})
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {orchestrationStatus.active_campaigns.map((campaign, idx) => (
              <Card key={idx} className="border-green-500 bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge className="bg-green-600 w-fit mt-2">ACTIVE</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-green-200">Type</p>
                    <p className="text-sm text-white capitalize">{campaign.type.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-200">Territories</p>
                    <p className="text-sm text-white">{campaign.territories?.length || campaign.regions?.length} zones</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-200">Posting Cadence</p>
                    <p className="text-sm text-white font-semibold">
                      {campaign.posting_cadence.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-200">Channels</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.channels.slice(0, 3).map((ch, cidx) => (
                        <Badge key={cidx} variant="outline" className="text-xs bg-slate-700">
                          {ch.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {campaign.channels.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-slate-700">
                          +{campaign.channels.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Posting Schedule */}
        <Card className="border-green-500 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle>Posting Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(orchestrationStatus.posting_schedule).map(([campaign, schedule], idx) => (
              <div key={idx} className="border-l-4 border-green-400 pl-4">
                <p className="text-sm font-semibold text-white capitalize">{campaign.replace(/_/g, ' ')}</p>
                <p className="text-sm text-green-200">{schedule}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Channels Distribution */}
        <Card className="border-green-500 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle>Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {orchestrationStatus.channels.map((channel, idx) => (
                <div key={idx} className="bg-slate-700 rounded p-3 border border-green-400">
                  <p className="text-sm font-semibold text-white capitalize">{channel.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-green-200 mt-1">Auto-posting enabled</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Generation Status */}
        <Card className="border-green-500 bg-slate-800 text-white">
          <CardHeader>
            <CardTitle>Content Generation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(orchestrationStatus.content_generation_status).map(([campaign, status], idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <p className="text-sm capitalize">{campaign.replace(/_/g, ' ')}</p>
                  <Badge className={status === 'generated' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Actions */}
        <Card className="border-blue-500 bg-blue-900/20 text-white">
          <CardHeader>
            <CardTitle>Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">✅ All campaigns are ACTIVE and ready to publish</p>
              <p className="text-sm">✅ Content queues populated with generated assets</p>
              <p className="text-sm">✅ Posting schedule aligned: 1-2 posts per day per campaign</p>
              <p className="text-sm">✅ Publishing begins within next scheduling window</p>
              <p className="text-sm">📊 Monitor campaign performance from Analytics hub</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}