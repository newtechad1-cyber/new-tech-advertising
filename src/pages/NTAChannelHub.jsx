import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ArrowLeft, Bell } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import CHPlatformCard from '@/components/channel-hub/CHPlatformCard';
import CHConnectionWizard from '@/components/channel-hub/CHConnectionWizard';
import CHTikTokFallback from '@/components/channel-hub/CHTikTokFallback';
import CHDiagnosticsPanel from '@/components/channel-hub/CHDiagnosticsPanel';
import CHReadinessIndicator from '@/components/channel-hub/CHReadinessIndicator';

// Platform definitions
const PLATFORMS = [
  {
    id: 'facebook',
    wizardKey: 'facebook_instagram',
    name: 'Facebook',
    color: '#1877f2',
    benefit: 'Automated post publishing, page analytics, and audience targeting for your business page.',
    perms: ['pages_manage_posts', 'pages_read_engagement', 'ads_read'],
    Logo: () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  },
  {
    id: 'instagram',
    wizardKey: 'facebook_instagram',
    name: 'Instagram',
    color: '#e1306c',
    benefit: 'Visual content publishing, Stories, and Reels distribution through your connected Facebook Page.',
    perms: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    Logo: () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
  },
  {
    id: 'google_business',
    wizardKey: 'google_business',
    name: 'Google Business',
    color: '#4285f4',
    benefit: 'Review management, Business Profile posts, and local SEO signals for your service area.',
    perms: ['mybusiness.manage', 'businessreviews.manage'],
    Logo: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    wizardKey: 'youtube',
    name: 'YouTube',
    color: '#ff0000',
    benefit: 'Automated video publishing, channel analytics, and subscriber engagement for your YouTube presence.',
    perms: ['youtube.upload', 'youtube.readonly', 'youtube.force-ssl'],
    Logo: () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
  },
  {
    id: 'tiktok',
    wizardKey: 'tiktok',
    name: 'TikTok',
    color: '#69c9d0',
    benefit: 'Short-form video publishing to grow reach with younger audiences and local discovery content.',
    perms: ['video.upload', 'user.info.basic'],
    Logo: () => <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#69c9d0"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>,
    isOptional: true,
  },
];

function buildInitialConnections() {
  return PLATFORMS.map(p => ({ platform: p.id, status: 'not_connected' }));
}

export default function NTAChannelHub() {
  const urlParams = new URLSearchParams(window.location.search);
  const onboardingId = urlParams.get('id');

  const [connections, setConnections] = useState(buildInitialConnections());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wizard, setWizard] = useState(null); // { platformId, wizardKey }
  const [tiktokFallback, setTiktokFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conns, permLogs] = await Promise.all([
          onboardingId
            ? base44.entities.ChannelConnection.filter({ onboarding_id: onboardingId })
            : base44.entities.ChannelConnection.list(),
          base44.entities.ChannelPermissionLog.list('-created_date', 20),
        ]);

        if (conns.length > 0) {
          setConnections(PLATFORMS.map(p => {
            const saved = conns.find(c => c.platform === p.id);
            return saved || { platform: p.id, status: 'not_connected' };
          }));
        }
        setLogs(permLogs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [onboardingId]);

  const getConn = (platformId) => connections.find(c => c.platform === platformId);

  const updateConnection = (platformId, updates) => {
    setConnections(prev => prev.map(c => c.platform === platformId ? { ...c, ...updates } : c));
  };

  const handleConnect = (platform) => {
    if (platform.id === 'instagram') {
      // Instagram is paired through Facebook wizard
      setWizard({ platformId: 'facebook', wizardKey: 'facebook_instagram', pairing: true });
      return;
    }
    updateConnection(platform.id, { status: 'connecting' });
    setTimeout(() => setWizard({ platformId: platform.id, wizardKey: platform.wizardKey }), 400);
  };

  const handleWizardSuccess = async (selectedItem) => {
    const { platformId, wizardKey } = wizard;
    const now = new Date().toISOString();

    const updates = {
      status: 'connected',
      page_name: selectedItem?.name || 'Connected Account',
      account_name: selectedItem?.name || 'Connected',
      last_sync_at: now,
      connected_at: now,
      publishing_enabled: true,
      analytics_enabled: true,
      onboarding_id: onboardingId || '',
    };

    updateConnection(platformId, updates);

    // If Facebook+Instagram wizard, also connect Instagram
    if (wizardKey === 'facebook_instagram' && selectedItem?.ig) {
      updateConnection('instagram', {
        ...updates,
        page_name: `@${selectedItem.ig}`,
        account_name: selectedItem.ig,
      });
    }

    // Persist to DB
    try {
      const existing = getConn(platformId);
      if (existing?.id) {
        await base44.entities.ChannelConnection.update(existing.id, updates);
      } else {
        const created = await base44.entities.ChannelConnection.create({ platform: platformId, ...updates });
        setConnections(prev => prev.map(c => c.platform === platformId ? { ...c, ...created } : c));
      }
      await base44.entities.ChannelPermissionLog.create({
        platform: platformId, event_type: 'connected', details: `Connected via wizard: ${selectedItem?.name || 'unknown'}`, resolved: true,
      });
      setLogs(prev => [{ platform: platformId, event_type: 'connected', created_date: now }, ...prev]);
    } catch (e) {
      console.error(e);
    }

    setWizard(null);
  };

  const handleWizardClose = () => {
    if (wizard) updateConnection(wizard.platformId, { status: 'not_connected' });
    setWizard(null);
  };

  const handleReconnect = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (platform) {
      updateConnection(platformId, { status: 'connecting' });
      setTimeout(() => setWizard({ platformId, wizardKey: platform.wizardKey }), 400);
    }
  };

  const handleDisconnect = async (platformId) => {
    updateConnection(platformId, { status: 'disconnected', page_name: null, account_name: null });
    const conn = getConn(platformId);
    if (conn?.id) {
      await base44.entities.ChannelConnection.update(conn.id, { status: 'disconnected' }).catch(console.error);
    }
    await base44.entities.ChannelPermissionLog.create({ platform: platformId, event_type: 'disconnected' }).catch(console.error);
  };

  const handleTikTokRetry = () => {
    setTiktokFallback(false);
    handleReconnect('tiktok');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const connectedCount = connections.filter(c => c.status === 'connected').length;

  return (
    <div className="min-h-screen bg-slate-950">
      <NTACommandNav />
      {/* Wizard overlay */}
      {wizard && (
        <CHConnectionWizard
          platform={wizard.wizardKey}
          onClose={handleWizardClose}
          onSuccess={handleWizardSuccess}
        />
      )}

      {/* TikTok fallback */}
      {tiktokFallback && (
        <CHTikTokFallback onRetry={handleTikTokRetry} onSkip={() => setTiktokFallback(false)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950/15 to-slate-950 border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <a href={onboardingId ? `/nta/onboarding?id=${onboardingId}` : '/nta/onboarding'}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 hover:bg-slate-800 transition-colors text-slate-400">
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <h1 className="text-white text-xl font-black">Channel Connection Hub</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Connect your platforms to unlock automated publishing and analytics.
              <span className="text-green-400 font-bold ml-2">{connectedCount}/5 connected</span>
              <a href="/channel-help" className="text-blue-400 hover:text-blue-300 ml-3 underline text-xs">Setup Help Guide</a>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {connectedCount >= 3 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-800/40 rounded-xl">
                <Bell className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">Publishing agents active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intro banner */}
      <div className="border-b border-slate-800 bg-blue-950/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            <span className="text-white font-bold">Why connect these platforms?</span> Once connected, NTA automatically publishes your approved content, tracks performance data, and optimizes your local visibility — all without you needing to log in to each platform daily.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">

          {/* Main: connection cards */}
          <div className="col-span-8 space-y-6">
            {/* Facebook + Instagram combined section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                <h2 className="text-white font-bold text-sm">Facebook + Instagram <span className="text-slate-500 font-normal text-xs ml-1">— Connected together via Meta Business</span></h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['facebook', 'instagram'].map((pid) => {
                  const platform = PLATFORMS.find(p => p.id === pid);
                  const conn = getConn(pid);
                  return (
                    <CHPlatformCard
                      key={pid}
                      platform={platform}
                      connection={conn}
                      onConnect={() => handleConnect(platform)}
                      onReconnect={() => handleReconnect(pid)}
                      onDisconnect={() => handleDisconnect(pid)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Google Business */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-green-500 rounded-full" />
                <h2 className="text-white font-bold text-sm">Google Business Profile <span className="text-slate-500 font-normal text-xs ml-1">— Required for local SEO + review management</span></h2>
              </div>
              {(() => {
                const platform = PLATFORMS.find(p => p.id === 'google_business');
                const conn = getConn('google_business');
                return (
                  <CHPlatformCard
                    platform={platform}
                    connection={conn}
                    onConnect={() => handleConnect(platform)}
                    onReconnect={() => handleReconnect('google_business')}
                    onDisconnect={() => handleDisconnect('google_business')}
                  />
                );
              })()}
            </div>

            {/* YouTube + TikTok */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-red-500 rounded-full" />
                <h2 className="text-white font-bold text-sm">Video Channels <span className="text-slate-500 font-normal text-xs ml-1">— Automated video publishing</span></h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['youtube', 'tiktok'].map((pid) => {
                  const platform = PLATFORMS.find(p => p.id === pid);
                  const conn = getConn(pid);
                  return (
                    <CHPlatformCard
                      key={pid}
                      platform={platform}
                      connection={conn}
                      isOptional={platform.isOptional}
                      onConnect={() => {
                        if (pid === 'tiktok' && conn?.status === 'error') { setTiktokFallback(true); return; }
                        handleConnect(platform);
                      }}
                      onReconnect={() => pid === 'tiktok' ? setTiktokFallback(true) : handleReconnect(pid)}
                      onDisconnect={() => handleDisconnect(pid)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Diagnostics */}
            <CHDiagnosticsPanel
              connections={connections}
              logs={logs}
              onReconnect={handleReconnect}
            />
          </div>

          {/* Right sidebar */}
          <div className="col-span-4 space-y-5">
            <CHReadinessIndicator connections={connections} />

            {/* Automation status */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Automation Status</h3>
              {[
                { label: 'Social Publishing Agent', active: connections.find(c => c.platform === 'facebook')?.status === 'connected' },
                { label: 'Google Review Monitor', active: connections.find(c => c.platform === 'google_business')?.status === 'connected' },
                { label: 'Video Upload Pipeline', active: connections.find(c => c.platform === 'youtube')?.status === 'connected' },
                { label: 'Analytics Sync', active: connections.filter(c => c.status === 'connected').length >= 2 },
                { label: 'Token Refresh Scheduler', active: connections.filter(c => c.status === 'connected').length >= 1 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 mb-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? 'bg-green-400' : 'bg-slate-600'}`}
                    style={item.active ? { boxShadow: '0 0 6px #10b981' } : {}} />
                  <span className={`text-xs font-medium ${item.active ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: item.active ? '#10b981' : '#475569' }}>
                    {item.active ? 'Active' : 'Waiting'}
                  </span>
                </div>
              ))}
            </div>

            {/* Tips card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">Connection Tips</h3>
              <ul className="space-y-2.5 text-slate-400 text-xs">
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> Use the primary business admin account for each platform — not a personal account.</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> Facebook and Instagram must be connected through the same Meta Business account.</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> Grant all requested permissions — partial access limits what we can automate for you.</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> TikTok requires a Business Account. Personal accounts cannot authorize third-party tools.</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> Tokens typically last 60–90 days. We'll remind you before they expire.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}