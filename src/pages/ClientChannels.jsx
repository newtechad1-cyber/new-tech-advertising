import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressHeader from '@/components/channels/ProgressHeader.jsx';
import PublishReadinessStrip from '@/components/channels/PublishReadinessStrip.jsx';
import ChannelCard from '@/components/channels/ChannelCard.jsx';
import TroubleshootingPanel from '@/components/channels/TroubleshootingPanel.jsx';
import BottomActionBar from '@/components/channels/BottomActionBar.jsx';

const CHANNEL_DATA = [
  {
    id: 'google',
    logo: '🔍',
    name: 'Google Business',
    description: 'Allows customers to find you in local search results.',
    status: 'disconnected',
    lastSync: null,
  },
  {
    id: 'facebook',
    logo: '👍',
    name: 'Facebook Page',
    description: 'Allows posting updates and building local engagement.',
    status: 'connected',
    lastSync: 'Last successful post: 2 days ago',
  },
  {
    id: 'instagram',
    logo: '📷',
    name: 'Instagram',
    description: 'Allows sharing visual content and reaching younger audiences.',
    status: 'attention',
    lastSync: 'Permission needs renewal',
  },
  {
    id: 'website',
    logo: '🌐',
    name: 'Website Publishing',
    description: 'Allows updating your website with fresh content.',
    status: 'disconnected',
    lastSync: null,
  },
  {
    id: 'youtube',
    logo: '📺',
    name: 'YouTube',
    description: 'Allows publishing video content and building authority.',
    status: 'reconnect',
    lastSync: 'Connection expired',
  },
  {
    id: 'tiktok',
    logo: '🎵',
    name: 'TikTok',
    description: 'Allows reaching trending audiences with short-form content.',
    status: 'disconnected',
    lastSync: null,
  },
];

export default function ClientChannels() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState(CHANNEL_DATA);

  const handleConnect = (channelId) => {
    setChannels(channels.map(ch => 
      ch.id === channelId ? { ...ch, status: 'connected', lastSync: 'Last successful post: now' } : ch
    ));
  };

  const handleReconnect = (channelId) => {
    setChannels(channels.map(ch => 
      ch.id === channelId ? { ...ch, status: 'connected', lastSync: 'Last successful post: now' } : ch
    ));
  };

  const handleTest = (channelId) => {
    alert(`Test post initiated for ${channelId}`);
  };

  const handleContinue = () => {
    navigate('/trial/activation');
  };

  const handleSkip = () => {
    navigate('/trial/activation');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress Header */}
        <ProgressHeader step={3} totalSteps={4} />

        {/* Publish Readiness Strip */}
        <PublishReadinessStrip 
          contentReady="ready"
          channelsReady="partial"
          approvalReady="ready"
          publishSafe="blocked"
        />

        {/* Channel Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {channels.map(channel => (
            <ChannelCard
              key={channel.id}
              logo={channel.logo}
              name={channel.name}
              description={channel.description}
              status={channel.status}
              lastSync={channel.lastSync}
              onConnect={() => handleConnect(channel.id)}
              onReconnect={() => handleReconnect(channel.id)}
              onTest={() => handleTest(channel.id)}
            />
          ))}
        </div>

        {/* Troubleshooting Panel */}
        <TroubleshootingPanel />

        {/* Bottom Action Bar */}
        <BottomActionBar 
          onContinue={handleContinue}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}