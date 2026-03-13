import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Zap, Calendar, TrendingUp, Users } from 'lucide-react';

export default function AlbertLeaRestaurantDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);

  const generateCampaign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('generateAlbertLeaRestaurantCampaign', {});
      if (response.data?.campaign) {
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="bg-white rounded-lg border border-amber-200 p-8 text-center space-y-4 mb-8">
            <div className="text-5xl">🍽️</div>
            <h1 className="text-3xl font-bold text-slate-900">
              Albert Lea Restaurant Visibility Campaign
            </h1>
            <p className="text-slate-600 text-lg">
              Weekly Specials, Community Loyalty & Event Night Marketing
            </p>
          </div>

          {/* Campaign Overview */}
          <Card className="mb-8 border-amber-200">
            <CardHeader>
              <CardTitle>Campaign Activation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Region</p>
                  <p className="text-slate-900 font-semibold">Albert Lea, Minnesota</p>
                  <p className="text-sm text-slate-600">Growing restaurant community market</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Total Posting Volume</p>
                  <p className="text-slate-900 font-semibold">5-6 posts per week</p>
                  <p className="text-sm text-slate-600">Aligned with HVAC campaigns</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Content Focus</p>
                  <p className="text-slate-900">Specials, Events, Community Loyalty</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Distribution</p>
                  <p className="text-slate-900">Facebook, Instagram, Google, TikTok, YouTube</p>
                </div>
              </div>

              <Button
                onClick={generateCampaign}
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 gap-2"
              >
                {isLoading ? (
                  <>Generating Campaign...</>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Albert Lea Restaurant Campaign
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
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle>Projected Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Monthly Targets</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      '500-800 engagement interactions',
                      '20-30 event attendance increases',
                      '15-25 new regular customers',
                      '3-5 demo bookings'
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-amber-50 p-3 rounded border border-amber-200">
                        <p className="text-xs text-amber-700">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-amber-200 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Quarterly Targets</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      '1500-2400 total engagement',
                      '60-90 event attendees',
                      '45-75 new customers',
                      '$15K+ MRR'
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-xs text-green-700">{metric}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Albert Lea Restaurant Visibility Campaign
            </h1>
            <p className="text-slate-600 mt-1">
              {campaign.campaign_type.replace(/_/g, ' ')} | Albert Lea, Minnesota
            </p>
          </div>
          <Badge className="bg-green-100 text-green-900 text-sm py-2 px-3">
            {campaign.activation_status.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="bg-white rounded-lg border border-amber-200">
          <TabsList className="border-b border-amber-200 w-full justify-start rounded-none bg-amber-50 px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Streams</TabsTrigger>
            <TabsTrigger value="videos">Video Scripts</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Campaign Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Market</p>
                    <p className="text-slate-900 font-bold">{campaign.campaign?.market}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Region</p>
                    <p className="text-slate-900">{campaign.campaign?.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Industry</p>
                    <p className="text-slate-900">{campaign.campaign?.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Focus</p>
                    <p className="text-slate-900 text-sm">{campaign.campaign?.territory_focus}</p>
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
                    <p className="text-slate-900 font-bold">{campaign.campaign?.posting_cadence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-900 capitalize">
                      {campaign.campaign?.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Channel Distribution</p>
                    <p className="text-slate-900 text-sm">
                      Facebook, Instagram, Google, TikTok, YouTube Shorts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unique Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Unique Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaign.campaign?.unique_offers?.map((offer, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                      <span className="text-lg">✓</span>
                      <p className="text-sm text-slate-700">{offer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Streams Tab */}
          <TabsContent value="content" className="p-6 space-y-4">
            {campaign.campaign?.content_streams?.map((stream, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{stream.stream_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stream.posts?.map((post, pidx) => (
                    <div key={pidx} className="border border-slate-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-slate-900">{post.headline}</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{post.body}</p>
                      <p className="text-xs font-semibold text-amber-600 mt-2">CTA: {post.cta}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Video Scripts Tab */}
          <TabsContent value="videos" className="p-6 space-y-4">
            {campaign.campaign?.video_scripts?.map((video, idx) => (
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

          {/* Seasonal Tab */}
          <TabsContent value="seasonal" className="p-6 space-y-4">
            {campaign.campaign?.seasonal_events?.map((seasonal, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{seasonal.season}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Focus</p>
                    <p className="text-slate-900">{seasonal.focus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Content Themes</p>
                    <div className="flex flex-wrap gap-2">
                      {seasonal.content_themes?.map((theme, tidx) => (
                        <Badge key={tidx} variant="outline" className="bg-amber-50">
                          {theme}
                        </Badge>
                      ))}
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
                  Weekly Posting Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {campaign.campaign?.weekly_schedule}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Campaign Integration */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔄 Cross-Campaign Integration (Albert Lea)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Alignment</p>
                <p className="text-slate-900">{campaign.integration?.aligned_posting}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Channel Distribution</p>
                <p className="text-slate-900">{campaign.integration?.channel_distribution}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-slate-700 mb-2">Geographic Alignment</p>
                <p className="text-slate-900">{campaign.integration?.geographic_alignment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Monthly Targets</p>
                <div className="space-y-2">
                  {campaign.metrics?.monthly_targets?.map((metric, idx) => (
                    <p key={idx} className="text-sm text-slate-700">• {metric}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Quarterly Targets</p>
                <div className="space-y-2">
                  {campaign.metrics?.quarterly_targets?.map((metric, idx) => (
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