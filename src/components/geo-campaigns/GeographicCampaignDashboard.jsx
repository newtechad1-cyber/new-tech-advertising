import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Map, Target, Calendar, Zap, TrendingUp } from 'lucide-react';

const MARKET_COLORS = {
  'Mason City Market': 'bg-blue-100 border-blue-300',
  'Austin Minnesota Market': 'bg-green-100 border-green-300',
  'Rochester Minnesota Expansion Campaign': 'bg-purple-100 border-purple-300'
};

const MARKET_ICONS = {
  'Mason City Market': '🏘️',
  'Austin Minnesota Market': '🏪',
  'Rochester Minnesota Expansion Campaign': '🏢'
};

export default function GeographicCampaignDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(0);
  const [error, setError] = useState(null);

  const generateCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('generateGeographicCampaigns', {});
      if (response.data?.campaigns) {
        setCampaigns(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaigns) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-4 mb-8">
            <div className="text-5xl">🗺️</div>
            <h1 className="text-3xl font-bold text-slate-900">
              Geographic Dominance Campaign Strategy
            </h1>
            <p className="text-slate-600 text-lg">
              3-Market Regional Expansion for NTA DIY Growth System
            </p>
          </div>

          {/* Markets Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Mason City Market',
                region: 'Mason City, Iowa',
                focus: 'Local small businesses & service companies',
                icon: '🏘️',
                messaging: 'local visibility, community authority'
              },
              {
                name: 'Austin Minnesota Market',
                region: 'Austin, Minnesota',
                focus: 'Service trades, restaurants, retail',
                icon: '🏪',
                messaging: 'lead generation, seasonal visibility'
              },
              {
                name: 'Rochester Expansion',
                region: 'Rochester, Minnesota',
                focus: 'Growth-focused & professional services',
                icon: '🏢',
                messaging: 'brand authority, marketing scale'
              }
            ].map((market, idx) => (
              <Card key={idx} className="border-2 hover:border-blue-400 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="text-4xl">{market.icon}</div>
                  <h3 className="font-bold text-slate-900">{market.name}</h3>
                  <p className="text-sm text-slate-600">{market.region}</p>
                  <div className="bg-slate-50 rounded p-2">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Focus</p>
                    <p className="text-xs text-slate-600">{market.focus}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-2">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Messaging</p>
                    <p className="text-xs text-slate-600">{market.messaging}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaign Strategy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Campaign Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Unified Offer</p>
                  <p className="text-slate-900">DIY Growth System @ $99/month</p>
                  <p className="text-xs text-slate-600 mt-1">Early access positioning across all markets</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Launch Timeline</p>
                  <p className="text-slate-900">Staggered rollout</p>
                  <p className="text-xs text-slate-600 mt-1">Day 0, Day 7, Day 14 to manage capacity</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Posting Cadence</p>
                  <p className="text-slate-900">1-2 posts per day per market</p>
                  <p className="text-xs text-slate-600 mt-1">Multi-channel coordinated schedule</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">CTA Strategy</p>
                  <p className="text-slate-900">Market-specific booking links</p>
                  <p className="text-xs text-slate-600 mt-1">Dedicated follow-up sequences per region</p>
                </div>
              </div>

              <Button
                onClick={generateCampaigns}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 gap-2"
              >
                {isLoading ? (
                  <>Generating Geographic Campaigns...</>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate All 3 Market Campaigns
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

          {/* Success Metrics Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Per Market (30 days)</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600">Demo Bookings</p>
                      <p className="text-lg font-bold text-slate-900">20+</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600">Early Access Signups</p>
                      <p className="text-lg font-bold text-slate-900">50+</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600">Engagement Rate</p>
                      <p className="text-lg font-bold text-slate-900">3-5%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600">Leads/Week</p>
                      <p className="text-lg font-bold text-slate-900">2-3</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Aggregate (90 days)</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-xs text-green-700">Total Demo Bookings</p>
                      <p className="text-lg font-bold text-green-900">60+</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-xs text-green-700">Total Signups</p>
                      <p className="text-lg font-bold text-green-900">150+</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-xs text-green-700">Qualified Leads/Week</p>
                      <p className="text-lg font-bold text-green-900">9-15</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-xs text-green-700">Projected MRR</p>
                      <p className="text-lg font-bold text-green-900">$30K+</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCampaign = campaigns.campaigns?.[selectedMarket];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Geographic Dominance Campaigns
            </h1>
            <p className="text-slate-600 mt-1">
              {campaigns.total_campaigns} Active Markets | 90-Day Strategy
            </p>
          </div>
          <Badge className="bg-green-100 text-green-900 text-sm py-2 px-3">
            Active Deployment
          </Badge>
        </div>

        {/* Market Selector */}
        <div className="grid md:grid-cols-3 gap-4">
          {campaigns.campaigns?.map((campaign, idx) => (
            <Button
              key={idx}
              variant={selectedMarket === idx ? 'default' : 'outline'}
              onClick={() => setSelectedMarket(idx)}
              className={`justify-start gap-2 h-auto py-3 ${selectedMarket === idx ? 'bg-blue-600' : ''}`}
            >
              <span className="text-2xl">{MARKET_ICONS[campaign.market_name]}</span>
              <div className="text-left">
                <div className="font-semibold text-sm">{campaign.market_name}</div>
                <div className="text-xs text-slate-600">{campaign.region}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="bg-white rounded-lg border border-slate-200">
          <TabsList className="border-b border-slate-200 w-full justify-start rounded-none bg-slate-50 px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Themes</TabsTrigger>
            <TabsTrigger value="schedule">Posting Schedule</TabsTrigger>
            <TabsTrigger value="channels">Channel Strategy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Market Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Market Name</p>
                    <p className="text-slate-900">{currentCampaign?.market_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Region</p>
                    <p className="text-slate-900">{currentCampaign?.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Target Audience</p>
                    <p className="text-slate-900">{currentCampaign?.target_audience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Core Messaging</p>
                    <p className="text-slate-900">{currentCampaign?.messaging_core}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Campaign Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Launch Date</p>
                    <p className="text-slate-900">{currentCampaign?.launch_date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Duration</p>
                    <p className="text-slate-900">{currentCampaign?.duration_days} Days</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Posting Cadence</p>
                    <p className="text-slate-900">{currentCampaign?.posting_cadence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-900 capitalize">
                      {currentCampaign?.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Offer & CTA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Market-Specific Offer</p>
                  <p className="text-slate-900">{currentCampaign?.offer_positioning}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Call-to-Action</p>
                  <p className="text-slate-900">{currentCampaign?.cta}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Unique Market Offers</p>
                  <ul className="space-y-2">
                    {currentCampaign?.unique_offers?.map((offer, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{offer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Themes Tab */}
          <TabsContent value="content" className="p-6 space-y-4">
            {currentCampaign?.content_themes?.map((theme, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{theme.theme}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Sample Posts</p>
                    <ul className="space-y-2">
                      {theme.posts?.map((post, pidx) => (
                        <li key={pidx} className="text-sm text-slate-700 flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{post}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Localization Focus</p>
                    <p className="text-sm text-slate-600">{theme.localization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Posting Schedule Tab */}
          <TabsContent value="schedule" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  30-Day Posting Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  {currentCampaign?.posting_cadence} across all enabled channels
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-900">Campaign Timeline</p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Week 1: Authority building + intro offer</li>
                    <li>• Week 2: Educational content + problem positioning</li>
                    <li>• Week 3: Social proof + unique market offers</li>
                    <li>• Week 4: Final push + urgency messaging</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channel Strategy Tab */}
          <TabsContent value="channels" className="p-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentCampaign?.channel_schedule &&
                    Object.entries(currentCampaign.channel_schedule).map(([channel, strategy]) => (
                      <div key={channel} className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 capitalize mb-2">
                          {channel.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-slate-700">{strategy}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Campaign Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Cross-Campaign Coordination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Unified Offer</p>
                <p className="text-slate-900">{campaigns.strategy?.unified_offer}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Brand Consistency</p>
                <p className="text-slate-900">{campaigns.strategy?.brand_consistency}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Regional Differentiation</p>
                <p className="text-slate-900">{campaigns.strategy?.regional_differentiation}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Posting Coordination</p>
                <p className="text-slate-900">{campaigns.strategy?.posting_coordination}</p>
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
                <p className="text-sm font-semibold text-slate-700 mb-3">Per Market (30 days)</p>
                <div className="space-y-2">
                  {campaigns.metrics?.per_market?.map((metric, idx) => (
                    <p key={idx} className="text-sm text-slate-700">• {metric}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Aggregate (90 days)</p>
                <div className="space-y-2">
                  {campaigns.metrics?.aggregate?.map((metric, idx) => (
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