import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Zap, Calendar, Share2, Download } from 'lucide-react';

const CAMPAIGN_THEMES = {
  authority: { label: 'Authority Posts', icon: '📊', color: 'bg-blue-100' },
  offer: { label: 'Offer Announcements', icon: '🎯', color: 'bg-green-100' },
  educational: { label: 'Educational Content', icon: '📚', color: 'bg-purple-100' },
  video: { label: 'Video Scripts', icon: '🎬', color: 'bg-pink-100' },
  proof: { label: 'Proof Posts', icon: '✨', color: 'bg-amber-100' }
};

const CHANNELS = [
  { id: 'facebook', name: 'Facebook', icon: '👍', tone: 'Conversational & Story-Driven' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', tone: 'Authority & Business Growth' },
  { id: 'instagram', name: 'Instagram', icon: '📸', tone: 'Punchy & Visual' },
  { id: 'google_business', name: 'Google Business', icon: '📍', tone: 'Local Growth Focused' },
  { id: 'youtube_shorts', name: 'YouTube Shorts', icon: '🎥', tone: 'Hook-Driven Scripts' }
];

export default function NTALaunchCampaignBuilder() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedChannel, setSelectedChannel] = useState('facebook');
  const [error, setError] = useState(null);

  const generateCampaign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('generateNTALaunchCampaign', {});
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-4 mb-8">
            <div className="text-5xl">🚀</div>
            <h1 className="text-3xl font-bold text-slate-900">
              NTA DIY Growth System Launch Campaign
            </h1>
            <p className="text-slate-600 text-lg">
              AI-powered multi-channel content generation for your launch
            </p>
          </div>

          {/* Campaign Brief */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Campaign Brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Theme</p>
                  <p className="text-slate-900">AI Marketing System for Small Businesses</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Duration</p>
                  <p className="text-slate-900">14 Days | 1-2 Posts Per Day</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Key Offer</p>
                  <p className="text-slate-900">DIY Growth System @ $99/month</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Positioning</p>
                  <p className="text-slate-900">Early Access / Founding Client</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-900">Content Categories</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.entries(CAMPAIGN_THEMES).map(([key, theme]) => (
                    <div key={key} className="flex items-center gap-2 text-sm text-blue-800">
                      <span>{theme.icon}</span>
                      <span>{theme.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateCampaign}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <>Generating Campaign...</>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Launch Campaign
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Distribution Info */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {CHANNELS.map((channel) => (
                  <div
                    key={channel.id}
                    className="border border-slate-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{channel.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{channel.name}</p>
                        <p className="text-xs text-slate-600">{channel.tone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {campaign.campaign.campaign_name}
            </h1>
            <p className="text-slate-600 mt-1">
              {campaign.content_count.authority_posts +
                campaign.content_count.offer_posts +
                campaign.content_count.educational_posts +
                campaign.content_count.video_scripts +
                campaign.content_count.proof_posts}{' '}
              pieces of content ready to deploy
            </p>
          </div>
          <Badge className="bg-green-100 text-green-900 text-sm py-2 px-3">
            Ready to Deploy
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="bg-white rounded-lg border border-slate-200">
          <TabsList className="border-b border-slate-200 w-full justify-start rounded-none bg-slate-50 px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Library</TabsTrigger>
            <TabsTrigger value="schedule">Posting Schedule</TabsTrigger>
            <TabsTrigger value="channels">Channel Variations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries({
                authority: campaign.content_count.authority_posts,
                offer: campaign.content_count.offer_posts,
                educational: campaign.content_count.educational_posts,
                video: campaign.content_count.video_scripts,
                proof: campaign.content_count.proof_posts
              }).map(([key, count]) => (
                <Card key={key} className="text-center">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-3xl">{CAMPAIGN_THEMES[key].icon}</div>
                    <p className="text-sm font-semibold text-slate-700">
                      {CAMPAIGN_THEMES[key].label}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Theme</p>
                    <p className="text-slate-900">{campaign.campaign.campaign_theme}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Duration</p>
                    <p className="text-slate-900">{campaign.campaign.duration_days} Days</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Cadence</p>
                    <p className="text-slate-900">{campaign.campaign.posting_cadence}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Unified CTA</p>
                    <p className="text-slate-900">{campaign.campaign.cta_unified}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Library Tab */}
          <TabsContent value="content" className="p-6 space-y-6">
            {Object.entries(CAMPAIGN_THEMES).map(([key, theme]) => {
              const contentKey = key === 'proof' ? 'proof_posts' : `${key}_posts`;
              const contentArray = campaign.campaign.content_library[contentKey] || [];

              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{theme.icon}</span>
                      {theme.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentArray.map((item, idx) => (
                        <div
                          key={idx}
                          className="border border-slate-200 rounded-lg p-4 space-y-2 hover:border-blue-400 transition-colors"
                        >
                          <h4 className="font-semibold text-slate-900">{item.title || item.length}</h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {item.content || item.script || item.tone}
                          </p>
                          {item.cta && (
                            <p className="text-xs font-semibold text-blue-600 mt-2">CTA: {item.cta}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="p-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  14-Day Posting Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(campaign.campaign.content_library.posting_schedule || {}).map(
                    ([period, posts]) => (
                      <div
                        key={period}
                        className="border border-slate-200 rounded-lg p-4 space-y-2"
                      >
                        <p className="font-semibold text-slate-900 capitalize">{period.replace(/_/g, ' ')}</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                          {Array.isArray(posts)
                            ? posts.map((post, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>{post.replace(/_/g, ' ')}</span>
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channel Variations Tab */}
          <TabsContent value="channels" className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {CHANNELS.map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel === channel.id ? 'default' : 'outline'}
                  onClick={() => setSelectedChannel(channel.id)}
                  className="justify-start gap-2 h-auto py-3"
                >
                  <span className="text-lg">{channel.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{channel.name}</div>
                    <div className="text-xs text-slate-600">{channel.tone}</div>
                  </div>
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{CHANNELS.find(c => c.id === selectedChannel)?.name} Format</CardTitle>
              </CardHeader>
              <CardContent>
                {campaign.campaign.content_library.channel_variations?.[selectedChannel] && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Example Post</p>
                      <p className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 leading-relaxed">
                        {campaign.campaign.content_library.channel_variations[selectedChannel].example_post}
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Tone</p>
                        <p className="text-sm text-slate-600 capitalize">
                          {campaign.campaign.content_library.channel_variations[selectedChannel].tone?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Length</p>
                        <p className="text-sm text-slate-600">
                          {campaign.campaign.content_library.channel_variations[selectedChannel].length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Format</p>
                        <p className="text-sm text-slate-600 capitalize">
                          {campaign.campaign.content_library.channel_variations[selectedChannel].format?.replace(/_/g, ' ') || 'Text'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Content
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Share2 className="w-4 h-4" />
            Deploy Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}