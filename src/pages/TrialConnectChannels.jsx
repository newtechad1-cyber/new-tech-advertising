import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

const CHANNELS = [
  {
    id: 'google',
    label: 'Google Business Profile',
    description: 'Boost local visibility and customer reviews',
    icon: '🔵'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Post to your business page',
    icon: 'f'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Share visual content and stories',
    icon: '📷'
  },
  {
    id: 'website',
    label: 'Website',
    description: 'Auto-publish your content',
    icon: '🌐'
  },
  {
    id: 'youtube',
    label: 'YouTube / TikTok',
    description: 'Upload videos (optional)',
    icon: '▶'
  }
];

export default function TrialConnectChannels() {
  const [connected, setConnected] = useState(new Set());

  const toggleConnect = (id) => {
    const next = new Set(connected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setConnected(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[50%] bg-violet-500 transition-all" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Connect Your Marketing Channels</h1>
          <p className="text-slate-400 text-sm">Start with the ones that matter most to your business.</p>
        </div>

        {/* Channels */}
        <div className="space-y-3 mb-8">
          {CHANNELS.map(channel => (
            <div
              key={channel.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-start justify-between hover:border-slate-600 transition-colors group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{channel.icon}</span>
                  <h3 className="font-semibold text-white">{channel.label}</h3>
                  {connected.has(channel.id) && (
                    <span className="text-xs bg-green-500/20 border border-green-500 text-green-300 px-2 py-1 rounded">Connected</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm ml-9">{channel.description}</p>
              </div>
              <button
                onClick={() => toggleConnect(channel.id)}
                className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  connected.has(channel.id)
                    ? 'bg-green-600/20 border border-green-600 text-green-300 hover:bg-green-600/30'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {connected.has(channel.id) ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Skip option */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 text-center mb-10">
          <p className="text-slate-400 text-sm">You can skip and connect channels later from your dashboard.</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={createPageUrl('TrialBusinessSetup')}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Link
            to={createPageUrl('TrialActivationPreview')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}