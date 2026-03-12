import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const CHANNELS = [
  {
    id: 'google',
    name: 'Google Business',
    icon: '🔍',
    description: 'Appear in Google Search and Maps for local customers',
    color: 'from-red-500/20 to-yellow-500/20'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    description: 'Post to your business page and reach your audience',
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    description: 'Share visual content and build engagement',
    color: 'from-pink-500/20 to-purple-500/20'
  },
  {
    id: 'website',
    name: 'Your Website',
    icon: '🌐',
    description: 'Publish content directly to your site',
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'youtube',
    name: 'YouTube / TikTok',
    icon: '▶️',
    description: 'Share video content across platforms',
    color: 'from-orange-500/20 to-red-500/20'
  }
];

export default function TrialChannels() {
  const [connected, setConnected] = useState(new Set());
  const [attempted, setAttempted] = useState(new Set());

  // Load saved connections
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_channels');
    if (saved) {
      setConnected(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_channels', JSON.stringify(Array.from(connected)));
  }, [connected]);

  const handleConnect = (channelId) => {
    setAttempted(prev => new Set([...prev, channelId]));
    // Simulate connection after delay
    setTimeout(() => {
      setConnected(prev => new Set([...prev, channelId]));
    }, 1000);
  };

  const isConnected = (channelId) => connected.has(channelId);
  const isAttempting = (channelId) => attempted.has(channelId) && !isConnected(channelId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 w-full">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
          style={{ width: '75%' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Step Indicator */}
          <div className="mb-12">
            <p className="text-slate-400 text-sm font-semibold tracking-wide mb-3">STEP 3 OF 4</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= 3 ? 'bg-violet-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Connect Your Marketing Channels
            </h1>
            <p className="text-lg text-slate-400">
              Connect where your customers are. You can always add more later.
            </p>
          </div>

          {/* Channel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {CHANNELS.map(channel => (
              <div
                key={channel.id}
                className={`relative border rounded-xl p-6 transition-all ${
                  isConnected(channel.id)
                    ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'
                    : 'bg-gradient-to-br ' + channel.color + ' border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Icon & Title */}
                <div className="mb-4">
                  <div className="text-4xl mb-3">{channel.icon}</div>
                  <h3 className="text-white font-bold text-lg">{channel.name}</h3>
                  <p className="text-slate-400 text-sm mt-2">{channel.description}</p>
                </div>

                {/* Status or Button */}
                {isConnected(channel.id) ? (
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Connected
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(channel.id)}
                    disabled={isAttempting(channel.id)}
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
                  >
                    {isAttempting(channel.id) ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-5 py-4 mb-10">
            <p className="text-slate-300 text-sm leading-relaxed">
              💡 <span className="font-semibold">Don't have all accounts?</span> You can skip for now and add channels later from your dashboard. We'll send reminders when you're ready.
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <Link
              to={createPageUrl('TrialActivation')}
              className="block w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-center transition-all text-lg flex items-center justify-center gap-2 group"
            >
              Continue to Activation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => window.location.href = createPageUrl('TrialActivation')}
              className="w-full text-slate-400 hover:text-slate-200 font-semibold transition-colors py-3"
            >
              ⏭️ Skip for now
            </button>

            <Link
              to={createPageUrl('TrialBusiness')}
              className="w-full text-slate-400 hover:text-slate-200 font-semibold transition-colors py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}