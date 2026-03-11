import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Globe, Link2, Linkedin, Youtube, Smartphone, Building2, ArrowLeft,
  RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock, Radio,
  Loader2, ShieldCheck, Wifi, ChevronRight, Zap, Sparkles, Wrench
} from "lucide-react";
import PlatformCard, { STATUS_CONFIG } from "@/components/connections/PlatformCard";

// ─── Platform Config ──────────────────────────────────────────────────────────

function FacebookIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function InstagramIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
}

const PLATFORM_DEFS = [
  {
    type: 'website',
    label: 'Website',
    defaultLabel: 'NTA Website Publishing',
    Icon: Globe,
    iconBg: 'bg-cyan-900/30 border border-cyan-700/30',
    iconColor: 'text-cyan-400',
    idLabel: 'Website Domain',
    idPlaceholder: 'e.g. newtechadvertising.com',
    publishTypes: ['Video story pages', 'Blog-style posts', 'SEO landing pages', 'Embedded video pages'],
    requirements: [
      'Always available — no external connection required',
      'Creates published video story pages on your website',
      'Includes SEO title, summary, embedded video, and CTA',
      'Stories are immediately available after publish job completes',
      'Website publishing is the most reliable destination',
    ]
  },
  {
    type: 'google',
    label: 'Google',
    defaultLabel: 'Google Account',
    Icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    iconBg: 'bg-slate-800/50 border border-slate-700',
    iconColor: 'text-slate-300',
    idLabel: 'GBP Location ID (optional)',
    idPlaceholder: 'Google Business Profile location ID',
    publishTypes: ['Business Profile updates', 'Promotional posts', 'Video link posts'],
    requirements: [
      'Connected via Base44 Google OAuth connector',
      'Google Calendar / Business API scopes must be authorized',
      'GBP posting supports text + link format',
      'Direct video upload to GBP may require additional permissions',
      'Currently authorized — verify with "Run Test" to confirm',
    ]
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    defaultLabel: 'LinkedIn Account',
    Icon: Linkedin,
    iconBg: 'bg-blue-900/30 border border-blue-700/30',
    iconColor: 'text-blue-400',
    idLabel: 'Company Page ID (optional)',
    idPlaceholder: 'LinkedIn company URN or page ID',
    publishTypes: ['Company page posts', 'Video posts', 'Promotional clips', 'Thought leadership'],
    requirements: [
      'Connected via Base44 LinkedIn OAuth connector',
      'Supports w_member_social and w_organization_social scopes',
      'Can post to connected company pages and personal profile',
      'Video upload via LinkedIn API requires additional configuration',
      'Currently authorized — verify with "Run Test" to confirm',
    ]
  },
  {
    type: 'facebook',
    label: 'Facebook',
    defaultLabel: 'Facebook Page',
    Icon: FacebookIcon,
    iconBg: 'bg-blue-950/40 border border-blue-900/30',
    iconColor: 'text-blue-500',
    idLabel: 'Facebook Page ID',
    idPlaceholder: 'e.g. 123456789012345',
    publishTypes: ['Page video posts', 'Promotional clips', 'Ad-ready content', 'Reels'],
    metaSetupLink: true,
    setupGuide: {
      missing: 'Facebook Page mapping or valid Page Access Token',
      blocked_reason: 'Token or Page ID may be set but the Facebook Graph API cannot validate the page. Publishing will be blocked until this is resolved.',
      next_step: 'Use the Meta Setup flow to verify token, map your Page, and run capability checks.',
    },
    requirements: [
      'Requires META_PAGE_ACCESS_TOKEN secret (Page-level token, not user token)',
      'Requires META_PAGE_ID secret (your Facebook Page numeric ID)',
      'Token must have pages_manage_posts and pages_read_engagement permissions',
      'Video must be publicly accessible HTTPS URL for upload',
      'Token expires — regenerate in Facebook Business Manager when needed',
    ]
  },
  {
    type: 'instagram',
    label: 'Instagram',
    defaultLabel: 'Instagram Business Account',
    Icon: InstagramIcon,
    iconBg: 'bg-pink-950/30 border border-pink-900/20',
    iconColor: 'text-pink-400',
    idLabel: 'Instagram Business Account ID',
    idPlaceholder: 'e.g. 17841400000000000',
    publishTypes: ['Reels', 'Feed video posts', 'Promo clips', 'Story-format video'],
    metaSetupLink: true,
    setupGuide: {
      missing: 'Instagram Business Account ID or account type verification',
      blocked_reason: 'Instagram requires a Business or Creator account linked to a Facebook Page. Personal accounts cannot be used for API publishing.',
      next_step: 'Use the Meta Setup flow to verify the Instagram account, confirm Facebook Page linkage, and run capability checks.',
    },
    requirements: [
      'Requires META_INSTAGRAM_ACCOUNT_ID secret (Instagram Business Account ID)',
      'Account must be a Business or Creator account (not personal)',
      'Must be linked to a Facebook Page with a valid Page Access Token',
      'Video must be a publicly accessible HTTPS URL',
      'Reels posting uses 2-step: create container → publish (4s processing delay)',
    ]
  },
  {
    type: 'youtube',
    label: 'YouTube',
    defaultLabel: 'YouTube Channel',
    Icon: Youtube,
    iconBg: 'bg-red-950/30 border border-red-900/20',
    iconColor: 'text-red-400',
    idLabel: 'YouTube Channel ID',
    idPlaceholder: 'e.g. UCxxxxxxxxxxxxx',
    publishTypes: ['Long-form video uploads', 'YouTube Shorts', 'Promotional videos', 'Case studies'],
    youtubeSetupLink: true,
    setupGuide: {
      missing: 'YouTube Data API OAuth authorization and channel connection',
      blocked_reason: 'YouTube publishing requires a connected Google account with YouTube channel access. This OAuth flow has not been completed yet.',
      next_step: 'Use the YouTube Setup flow to verify your token, map your channel, and confirm upload capability.',
    },
    requirements: [
      'Requires YouTube Data API v3 OAuth credentials',
      'Must authorize a Google account with YouTube channel access',
      'Supports video upload, title, description, visibility settings',
      'Not currently configured — OAuth setup required to enable',
      'Videos must be under 128GB and meet YouTube format requirements',
    ]
  },
  {
    type: 'tiktok',
    label: 'TikTok',
    defaultLabel: 'TikTok Account',
    Icon: Smartphone,
    iconBg: 'bg-slate-800/60 border border-slate-700',
    iconColor: 'text-slate-300',
    idLabel: 'TikTok Account Label',
    idPlaceholder: 'e.g. @ntavideos',
    publishTypes: ['Short-form video', 'Promotional clips', 'Product showcases', 'Trending-format content'],
    setupGuide: {
      missing: 'TikTok user OAuth authorization (API keys are configured)',
      blocked_reason: 'TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are set, but the user-level OAuth authorization flow has not been completed. Publishing requires an authorized user token.',
      next_step: 'Complete the TikTok Content Posting API user authorization flow. Contact the development team to implement the OAuth redirect and token exchange.',
    },
    requirements: [
      'TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET secrets are configured',
      'TikTok user OAuth authorization flow must be completed',
      'Requires Content Posting API access from TikTok Developer Portal',
      'Videos must meet TikTok format and duration requirements',
      'OAuth user flow implementation needed to complete this integration',
    ]
  },
];

// ─── Audit Log Component ──────────────────────────────────────────────────────

const EVENT_COLORS = {
  connection_verified: 'text-green-400', connection_failed: 'text-red-400',
  test_publish_succeeded: 'text-green-400', test_publish_failed: 'text-red-400',
  token_expired: 'text-amber-400', publishing_enabled: 'text-violet-400',
  publishing_disabled: 'text-slate-500', settings_updated: 'text-blue-400',
};

function AuditLogSection({ logs, filterPlatform, setFilterPlatform }) {
  const platforms = ['all', ...PLATFORM_DEFS.map(p => p.type)];
  const filtered = filterPlatform === 'all' ? logs : logs.filter(l => l.platform_type === filterPlatform);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            Connection Audit Log
          </CardTitle>
          <div className="flex gap-1 flex-wrap">
            {platforms.map(p => (
              <button key={p} onClick={() => setFilterPlatform(p)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-all capitalize ${
                  filterPlatform === p
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No audit events yet. Verify connections to generate logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Time', 'Platform', 'Event', 'Status', 'Details', 'Actor'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.slice(0, 50).map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap text-[10px]">
                      {log.logged_at ? new Date(log.logged_at).toLocaleString() : '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize text-slate-400 font-medium">{log.platform_type}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`${EVENT_COLORS[log.event_type] || 'text-slate-400'}`}>
                        {log.event_label || log.event_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] text-slate-500 capitalize">{log.status_after || '—'}</span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[220px]">
                      <p className="text-slate-600 truncate text-[10px]">{log.event_details || '—'}</p>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[10px]">{log.actor_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminConnections() {
  const [connections, setConnections] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('all');

  const load = useCallback(async () => {
    const [conns, logs] = await Promise.all([
      base44.entities.VideoDistributionConnection.list(),
      base44.entities.PlatformConnectionAuditLog.list('-logged_at', 100)
    ]);
    setConnections(conns);
    setAuditLogs(logs);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    await base44.functions.invoke('connectionHealthCheck', { action: 'seed_connections' });
    await load();
    setSeeding(false);
  };

  const handleVerifyAll = async () => {
    setVerifyingAll(true);
    for (const def of PLATFORM_DEFS) {
      const conn = connections.find(c => c.platform_type === def.type);
      await base44.functions.invoke('connectionHealthCheck', {
        action: 'verify_platform', platform_type: def.type, connection_id: conn?.id || null
      });
    }
    await load();
    setVerifyingAll(false);
  };

  const getConn = (type) => connections.find(c => c.platform_type === type);

  // Summary stats
  const connected = connections.filter(c => c.connection_status === 'connected').length;
  const needsAttention = connections.filter(c => ['error', 'token_expired', 'incomplete', 'needs_connection'].includes(c.connection_status)).length;
  const publishingEnabled = connections.filter(c => c.publishing_enabled).length;
  const failed = connections.filter(c => c.connection_status === 'error').length;
  const tokenExpiring = connections.filter(c => {
    if (!c.token_expires_at) return false;
    const days = (new Date(c.token_expires_at) - new Date()) / (1000 * 60 * 60 * 24);
    return days > 0 && days < 14;
  }).length;
  const lastSuccess = connections.filter(c => c.last_publish_success_at).sort((a, b) =>
    new Date(b.last_publish_success_at) - new Date(a.last_publish_success_at)
  )[0];

  // Issues list
  const issues = connections.filter(c =>
    ['error', 'token_expired', 'incomplete', 'needs_connection'].includes(c.connection_status)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top nav */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link to={createPageUrl("AdminVideoPublishing")}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Publishing Ops
          </Button>
        </Link>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-slate-300">Channel Connections</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={load} className="text-slate-500 hover:text-slate-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleVerifyAll} disabled={verifyingAll || connections.length === 0}
            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-1.5 text-xs">
            {verifyingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
            Verify All
          </Button>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Channel Connections</h1>
              <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
                Manage publishing destinations, account health, and platform access for automated video distribution.
              </p>
            </div>
            {connections.length === 0 && !loading && (
              <Button onClick={handleSeed} disabled={seeding}
                className="bg-violet-600 hover:bg-violet-500 gap-2 font-bold">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Initialize Connections
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Connected", value: connected, Icon: CheckCircle2, color: "text-green-400", bg: "border-green-800/25 bg-green-950/10" },
            { label: "Needs Attention", value: needsAttention, Icon: AlertTriangle, color: "text-amber-400", bg: "border-amber-800/25 bg-amber-950/10" },
            { label: "Expiring Soon", value: tokenExpiring, Icon: Clock, color: "text-orange-400", bg: "border-orange-800/25 bg-orange-950/10" },
            { label: "Publishing ON", value: publishingEnabled, Icon: Radio, color: "text-violet-400", bg: "border-violet-800/25 bg-violet-950/10" },
            { label: "Failed Checks", value: failed, Icon: XCircle, color: "text-red-400", bg: "border-red-800/25 bg-red-950/10" },
            { label: "Last Publish", value: lastSuccess ? new Date(lastSuccess.last_publish_success_at).toLocaleDateString() : '—', Icon: ShieldCheck, color: "text-cyan-400", bg: "border-cyan-800/25 bg-cyan-950/10", small: true },
          ].map(({ label, value, Icon, color, bg, small }) => (
            <Card key={label} className={`border bg-slate-900 ${bg}`}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
                <p className={`font-extrabold text-white ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin callout banner — shown when connections exist */}
        {!loading && connections.length > 0 && (() => {
          const connectedPlatforms = connections.filter(c => c.connection_status === 'connected').map(c => c.platform_type);
          const blockedCount = connections.filter(c => ['needs_connection', 'incomplete', 'token_expired', 'error'].includes(c.connection_status)).length;
          const connectedNames = connectedPlatforms.map(p => PLATFORM_DEFS.find(d => d.type === p)?.label).filter(Boolean);
          return (
            <div className={`rounded-2xl border px-5 py-4 flex items-start gap-4 ${
              blockedCount === 0
                ? 'border-green-800/40 bg-green-950/15'
                : 'border-violet-800/40 bg-violet-950/15'
            }`}>
              <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 ${blockedCount === 0 ? 'text-green-400' : 'text-violet-400'}`} />
              <div className="flex-1 min-w-0">
                {blockedCount === 0 ? (
                  <>
                    <p className="text-sm font-bold text-green-300">All channels are connected and ready.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Full automated distribution is enabled across all platforms.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-100">
                      {connectedNames.length > 0
                        ? `${connectedNames.join(' and ')} ${connectedNames.length === 1 ? 'is' : 'are'} connected.`
                        : 'No channels connected yet.'
                      }
                      {' '}Finish the remaining channels to unlock full automated distribution.
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {blockedCount} channel{blockedCount !== 1 ? 's' : ''} need{blockedCount === 1 ? 's' : ''} attention before automated publishing can run end-to-end.
                    </p>
                  </>
                )}
              </div>
              {blockedCount > 0 && (
                <span className="flex-shrink-0 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-violet-800/40 border border-violet-700/50 text-violet-300">
                  {blockedCount} action{blockedCount !== 1 ? 's' : ''} needed
                </span>
              )}
            </div>
          );
        })()}

        {/* Loading or empty */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
            <Link2 className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="text-slate-400 font-semibold">No connections initialized yet.</p>
            <p className="text-slate-600 text-sm mt-1 mb-4">Click "Initialize Connections" to set up your channel registry.</p>
            <Button onClick={handleSeed} disabled={seeding} className="bg-violet-600 hover:bg-violet-500 gap-2">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Initialize Connections
            </Button>
          </div>
        ) : (
          <>
            {/* Platform cards grid */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Radio className="w-4 h-4 text-violet-400" /> Publishing Channels
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {PLATFORM_DEFS.map(platform => (
                  <PlatformCard
                    key={platform.type}
                    platform={platform}
                    conn={getConn(platform.type)}
                    onRefresh={load}
                  />
                ))}
              </div>
            </div>

            {/* Health & Troubleshooting */}
            {issues.length > 0 && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Connection Health & Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connections.filter(c => c.connection_status === 'connected').length > 0 && (
                    <div className="rounded-xl border border-green-800/30 bg-green-950/10 p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p className="text-xs text-green-300 font-semibold">
                        {connections.filter(c => c.connection_status === 'connected').map(c => c.platform_type).join(', ')} — connected and healthy
                      </p>
                    </div>
                  )}
                  {issues.map(conn => {
                    const def = PLATFORM_DEFS.find(p => p.type === conn.platform_type);
                    const statusLabel = STATUS_CONFIG[conn.connection_status]?.label || conn.connection_status;
                    return (
                      <div key={conn.id} className="rounded-xl border border-orange-800/25 bg-orange-950/10 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-orange-200">
                              {def?.label || conn.platform_type} — <span className="font-normal text-orange-300">{statusLabel}</span>
                            </p>
                            {conn.last_error && (
                              <p className="text-xs text-slate-400 mt-1 leading-snug">{conn.last_error}</p>
                            )}
                            {conn.connection_status === 'token_expired' && (
                              <p className="text-[11px] text-slate-500 mt-1.5">→ Regenerate the access token in your platform's developer console and update the environment secret.</p>
                            )}
                            {conn.connection_status === 'needs_connection' && (
                              <p className="text-[11px] text-slate-500 mt-1.5">→ Configure required secrets or authorize via Base44 connectors, then click Verify on the channel card above.</p>
                            )}
                            {conn.connection_status === 'incomplete' && (
                              <p className="text-[11px] text-slate-500 mt-1.5">→ Open the platform's Settings card above, enter the missing Account / Page ID, save, then run Verify.</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                  {/* Meta shortcut callout */}
                  {issues.some(c => ['facebook','instagram'].includes(c.platform_type)) && (
                    <div className="rounded-xl border border-violet-800/40 bg-violet-950/15 p-4 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs font-bold text-violet-200 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" /> Facebook + Instagram need repair
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">These two platforms are linked and must be fixed together via the Meta Setup flow.</p>
                      </div>
                      <Link to={createPageUrl("AdminMetaSetup")}>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-500 font-bold gap-1.5 text-xs whitespace-nowrap">
                          <Wrench className="w-3 h-3" /> Open Meta Setup
                        </Button>
                      </Link>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-600 pt-1">
                    Fix these issues to unlock publishing for the affected channels. Blocked publish jobs will automatically show retry options once connections are restored.
                    {' '}<Link to={createPageUrl("AdminVideoPublishing")} className="text-violet-500 hover:text-violet-400">View blocked publish jobs →</Link>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Audit log */}
            <div id="audit-log">
            <AuditLogSection
              logs={auditLogs}
              filterPlatform={filterPlatform}
              setFilterPlatform={setFilterPlatform}
            />
            </div>
          </>
        )}
      </div>
    </div>
  );
}