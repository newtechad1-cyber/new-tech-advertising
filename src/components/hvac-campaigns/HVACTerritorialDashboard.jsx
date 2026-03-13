import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Zap, Map, Target, Calendar, TrendingUp } from 'lucide-react';

const TERRITORY_ICONS = {
  'Mason City HVAC': '❄️',
  'Austin MN HVAC': '🌡️',
  'Rochester HVAC Authority': '🏆'
};

const TERRITORY_COLORS = {
  'Mason City HVAC': 'bg-blue-100 border-blue-300',
  'Austin MN HVAC': 'bg-orange-100 border-orange-300',
  'Rochester HVAC Authority': 'bg-purple-100 border-purple-300'
};

export default function HVACTerritorialDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(0);
  const [error, setError] = useState(null);

  const generateCampaign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('generateHVACTerritorialCampaign', {});
      if (response.data?.campaigns) {
        setCampaign(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-4 mb-8">
            <div className="text-5xl">🔧</div>
            <h1 className="text-3xl font-bold text-slate-900">
              HVAC Territorial Dominance Campaign
            </h1>
            <p className="text-slate-600 text-lg">
              3-Territory HVAC Lead Generation & Authority Building System
            </p>
          </div>

          {/* Territories Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Mason City HVAC',
                region: 'Mason City, Iowa',
                icon: '❄️',
                focus: 'Local Authority, Seasonal Urgency, Review Momentum',
                message: 'Positioning HVAC expertise in growing market'
              },
              {
                name: 'Austin MN HVAC',
                region: 'Austin, Minnesota',
                icon: '🌡️',
                focus: 'Lead Generation, Maintenance Promotions, Competition',
                message: 'Consistent lead flow from service & repair market'
              },
              {
                name: 'Rochester HVAC Authority',
                region: 'Rochester, Minnesota',
                icon: '🏆',
                focus: 'Premium Positioning, Smart Systems, Brand Growth',
                message: 'Premium market leadership through innovation'
              }
            ].map((territory, idx) => (
              <Card key={idx} className={`border-2 ${TERRITORY_COLORS[territory.name]}`}>
                <CardContent className="p-6 space-y-3">
                  <div className="text-4xl">{territory.icon}</div>
                  <h3 className="font-bold text-slate-900">{territory.name}</h3>
                  <p className="text-sm text-slate-600 font-semibold">{territory.region}</p>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-semibold">Focus Areas:</p>
                    <p>{territory.focus}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaign Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Unified Offer</p>
                  <p className="text-slate-900 font-semibold">DIY Growth System for HVAC</p>
                  <p className="text-sm text-slate-600">$99/month founding rate</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Total Posting Volume</p>
                  <p className="text-slate-900 font-semibold">15-18 posts per week</p>
                  <p className="text-sm text-slate-600">5-6 posts per territory</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Industry Focus</p>
                  <p className="text-slate-900">HVAC-specific templates & seasonal calendars</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Distribution</p>
                  <p className="text-slate-900">Multi-channel per territory</p>
                </div>
              </div>

              <Button
                onClick={generateCampaign}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 gap-2"
              >
                {isLoading ? (
                  <>Generating HVAC Campaign...</>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate 3-Territory HVAC Campaign
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Per Territory (Monthly)</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {['15-25 qualified HVAC leads', '30-50 demo bookings', '8-12% engagement rate', '500-1000 impressions'].map(
                      (metric, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="text-xs text-slate-600">{metric.split(' ').slice(0, -2).join(' ')}</p>
                          <p className="text-sm font-bold text-slate-900">
                            {metric.split(' ').slice(-2).join(' ')}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Aggregate Quarterly</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      '45-75 HVAC leads',
                      '90-150 demo bookings',
                      '60-90 DIY signups',
                      '$50K+ MRR (HVAC vertical)'
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-xs text-green-700">{metric.split(' ').slice(0, -1).join(' ')}</p>
                        <p className="text-sm font-bold text-green-900">
                          {metric.split(' ').slice(-1).join(' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCampaign = campaign.campaigns?.[selectedTerritory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              HVAC Territorial Dominance Campaign
            </h1>
            <p className="text-slate-600 mt-1">
              {campaign.total_territories} Active Territories | Industry-Specific Strategy
            </p>
          </div>
          <Badge className="bg-green-100 text-green-900 text-sm py-2 px-3">
            {campaign.activation_status.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Territory Selector */}
        <div className="grid md:grid-cols-3 gap-4">
          {campaign.campaigns?.map((terr, idx) => (
            <Button
              key={idx}
              variant={selectedTerritory === idx ? 'default' : 'outline'}
              onClick={() => setSelectedTerritory(idx)}
              className={`justify-start gap-3 h-auto py-4 text-left ${
                selectedTerritory === idx ? 'bg-blue-600' : ''
              }`}
            >
              <span className="text-3xl">{TERRITORY_ICONS[terr.market]}</span>
              <div>
                <div className="font-semibold text-sm">{terr.market}</div>
                <div className="text-xs text-slate-600">{terr.region}</div>
                <div className="text-xs text-slate-600 mt-1">{terr.posting_cadence}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="bg-white rounded-lg border border-slate-200">
          <TabsList className="border-b border-slate-200 w-full justify-start rounded-none bg-slate-50 px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Streams</TabsTrigger>
            <TabsTrigger value="videos">Video Scripts</TabsTrigger>
            <TabsTrigger value="schedule">Posting Schedule</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Territory Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Territory</p>
                    <p className="text-slate-900 font-bold">{currentCampaign?.market}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Region</p>
                    <p className="text-slate-900">{currentCampaign?.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Focus Areas</p>
                    <p className="text-slate-900">{currentCampaign?.territory_focus}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Posting Cadence</p>
                    <p className="text-slate-900 font-bold">{currentCampaign?.posting_cadence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-900 capitalize">
                      {currentCampaign?.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Seasonal Focus</p>
                    <p className="text-xs text-slate-700">{currentCampaign?.seasonal_focus}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Posting Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {currentCampaign?.weekly_schedule}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Streams Tab */}
          <TabsContent value="content" className="p-6 space-y-4">
            {currentCampaign?.content_streams?.map((stream, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{stream.stream_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stream.posts?.map((post, pidx) => (
                    <div key={pidx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-slate-900">{post.headline}</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{post.body}</p>
                      <p className="text-xs font-semibold text-blue-600 mt-2">CTA: {post.cta}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Video Scripts Tab */}
          <TabsContent value="videos" className="p-6 space-y-4">
            {currentCampaign?.video_scripts?.map((video, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Length</p>
                      <p className="text-slate-900">{video.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Structure</p>
                      <p className="text-slate-900">{video.structure}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Script</p>
                    <div className="bg-slate-50 p-4 rounded border border-slate-200">
                      <p className="text-sm text-slate-700 leading-relaxed">{video.script}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Posting Schedule Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Weekly Cadence</p>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {currentCampaign?.posting_cadence} across all social channels
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700 uppercase">Distribution Pattern</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {['Facebook Groups', 'Google Business', 'Instagram', 'LinkedIn', 'YouTube Shorts'].map(
                        (channel, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-slate-200">
                            <p className="text-xs text-slate-600">{channel}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Territory Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Cross-Territory Coordination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Unified Offer</p>
                <p className="text-slate-900">{campaign.strategy?.unified_offer}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Industry Focus</p>
                <p className="text-slate-900">{campaign.strategy?.industry_focus}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Channel Distribution</p>
                <p className="text-slate-900 text-sm">{campaign.strategy?.channel_distribution}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Territorial Differentiation</p>
                <p className="text-slate-900 text-sm">{campaign.strategy?.territorial_differentiation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Per Territory (Monthly)</p>
                <div className="space-y-2">
                  {campaign.metrics?.per_territory_monthly?.map((metric, idx) => (
                    <p key={idx} className="text-sm text-slate-700">• {metric}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Aggregate Quarterly</p>
                <div className="space-y-2">
                  {campaign.metrics?.aggregate_quarterly?.map((metric, idx) => (
                    <p key={idx} className="text-sm text-slate-700">• {metric}</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}