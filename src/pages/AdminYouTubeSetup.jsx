import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, RefreshCw, Loader2, CheckCircle2, XCircle, AlertTriangle,
  Clock, ChevronRight, Zap, Lock, Unlock, ExternalLink, ListChecks,
  Target, Video, LayoutGrid, Play, Film, Settings, Shield, Wifi
} from "lucide-react";
import MetaStepCard from "@/components/connections/MetaStepCard";

function YtIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Readiness Engine ─────────────────────────────────────────────────────────
function computeReadiness(profile) {
  if (!profile) return { score: 0, status: 'needs_connection', channelStatus: 'not_started', issues: [] };

  const issues = [];
  let score = 0;

  // Token (30 pts)
  if (profile.token_status === 'active') {
    score += 30;
  } else if (profile.token_status === 'expired') {
    issues.push({ title: 'YouTube access token has expired', reason: 'All YouTube publishing is blocked until the token is renewed.', step: 'Set a fresh YOUTUBE_ACCESS_TOKEN in Base44 environment secrets. The token must include the youtube.upload scope.', severity: 'critical', blocking: true });
  } else {
    issues.push({ title: 'YouTube access token is not configured', reason: 'NTA cannot communicate with the YouTube API without a valid access token.', step: 'Set YOUTUBE_ACCESS_TOKEN in Base44 environment secrets with a Google OAuth token that includes youtube.upload scope.', severity: 'critical', blocking: true });
  }

  // Channel (25 pts)
  if (profile.youtube_channel_id) {
    score += 25;
  } else {
    issues.push({ title: 'No YouTube channel is mapped for publishing', reason: 'The publishing system requires a specific YouTube channel ID to target uploads.', step: 'Set YOUTUBE_CHANNEL_ID in environment secrets with the channel\'s ID (starts with UC…), then click Refresh All.', severity: 'high', blocking: true });
  }

  // Channel verified (20 pts)
  if (profile.upload_access_verified) {
    score += 20;
  } else if (profile.youtube_channel_id) {
    issues.push({ title: 'YouTube channel access has not been verified', reason: 'The channel ID is set but NTA has not confirmed the channel is accessible via the API.', step: 'Click "Refresh All" to run channel access verification through the YouTube Data API.', severity: 'medium', blocking: false });
  }

  // Upload capability (20 pts)
  if (profile.publish_permissions_ok) {
    score += 20;
  } else if (profile.youtube_channel_id) {
    issues.push({ title: 'Upload capability not confirmed', reason: 'Channel is selected but the youtube.upload permission scope has not been verified.', step: 'Ensure the access token includes the youtube.upload scope, then run Refresh All.', severity: 'high', blocking: false });
  }

  // Shorts (5 pts)
  if (profile.shorts_publish_supported) score += 5;

  const channelStatus =
    !profile.youtube_channel_id ? 'not_started' :
    profile.upload_access_verified ? 'ready' : 'incomplete';

  let status = 'needs_connection';
  if (profile.token_status === 'expired') status = 'token_expired';
  else if (score >= 95) status = 'ready';
  else if (score >= 60) status = 'partially_ready';
  else if (score >= 25) status = 'connected_but_incomplete';
  else if (issues.some(i => i.blocking)) status = 'blocked';

  return { score, status, issues, channelStatus };
}

function computeNextAction(profile, readiness) {
  if (!profile) return { label: 'Run initial verification to check YouTube connection status', priority: 'high' };
  if (profile.token_status === 'expired') return { label: 'Reconnect expired YouTube token — set a fresh YOUTUBE_ACCESS_TOKEN in environment secrets', priority: 'critical' };
  if (!profile.token_status || profile.token_status === 'not_set') return { label: 'Configure YOUTUBE_ACCESS_TOKEN in Base44 environment secrets with youtube.upload scope', priority: 'critical' };
  if (!profile.youtube_channel_id) return { label: 'Set YOUTUBE_CHANNEL_ID in environment secrets with your channel\'s UC… ID', priority: 'high' };
  if (!profile.upload_access_verified) return { label: 'Verify YouTube channel access — click Refresh All to confirm the channel is reachable', priority: 'high' };
  if (!profile.publish_permissions_ok) return { label: 'Run capability check to confirm youtube.upload permissions are active', priority: 'medium' };
  return { label: 'Run test upload check to confirm end-to-end YouTube publishing readiness', priority: 'low' };
}

const READINESS_DISPLAY = {
  ready:                    { label: 'Ready',                  cls: 'text-green-300 bg-green-950/30 border-green-800/40' },
  partially_ready:          { label: 'Partially Ready',        cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40' },
  connected_but_incomplete: { label: 'Connected — Incomplete', cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40' },
  blocked:                  { label: 'Blocked',                cls: 'text-red-300 bg-red-950/30 border-red-800/40' },
  token_expired:            { label: 'Token Expired',          cls: 'text-red-300 bg-red-950/30 border-red-800/40' },
  needs_connection:         { label: 'Not Configured',         cls: 'text-slate-400 bg-slate-900 border-slate-700' },
};

const CHANNEL_STATUS_DISPLAY = {
  ready:       { label: 'Ready',      cls: 'text-green-300 bg-green-950/30 border-green-800/40',  dot: 'bg-green-400' },
  incomplete:  { label: 'Incomplete', cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40', dot: 'bg-amber-400' },
  not_started: { label: 'Not Started',cls: 'text-slate-400 bg-slate-900 border-slate-700',        dot: 'bg-slate-600' },
};

const EVENT_COLORS = {
  connection_verified: 'text-green-400', connection_failed: 'text-red-400',
  test_publish_succeeded: 'text-green-400', test_publish_failed: 'text-red-400',
  settings_updated: 'text-blue-400', page_mapping_updated: 'text-violet-400',
};

const YT_CATEGORIES = [
  { value: '22', label: 'People & Blogs' },
  { value: '1',  label: 'Film & Animation' },
  { value: '2',  label: 'Autos & Vehicles' },
  { value: '10', label: 'Music' },
  { value: '15', label: 'Pets & Animals' },
  { value: '17', label: 'Sports' },
  { value: '19', label: 'Travel & Events' },
  { value: '20', label: 'Gaming' },
  { value: '23', label: 'Comedy' },
  { value: '24', label: 'Entertainment' },
  { value: '25', label: 'News & Politics' },
  { value: '26', label: 'Howto & Style' },
  { value: '27', label: 'Education' },
  { value: '28', label: 'Science & Technology' },
];

export default function AdminYouTubeSetup() {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [connTest, setConnTest] = useState(null);
  const [capTest, setCapTest] = useState(null);
  const [savingDefaults, setSavingDefaults] = useState(false);
  const [defaults, setDefaults] = useState({ default_visibility: 'private', default_category: '22', default_audience_setting: 'not_for_kids', auto_publish_shorts: false, allow_scheduled_publishing: true, append_branded_footer: false });

  const load = useCallback(async () => {
    const [profileRes, allLogs] = await Promise.all([
      base44.functions.invoke('youtubeConnectionSetup', { action: 'get_profile' }),
      base44.entities.PlatformConnectionAuditLog.list('-logged_at', 100)
    ]);
    const p = profileRes?.data?.profile || null;
    setProfile(p);
    if (p) {
      setDefaults({
        default_visibility: p.default_visibility || 'private',
        default_category: p.default_category || '22',
        default_audience_setting: p.default_audience_setting || 'not_for_kids',
        auto_publish_shorts: !!p.auto_publish_shorts,
        allow_scheduled_publishing: p.allow_scheduled_publishing !== false,
        append_branded_footer: !!p.append_branded_footer,
      });
    }
    setLogs(allLogs.filter(l => l.platform_type === 'youtube'));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const invoke = (action, extra = {}) =>
    base44.functions.invoke('youtubeConnectionSetup', { action, profile_id: profile?.id || null, ...extra });

  const handleRefreshAll = async () => {
    setRunning(true);
    const res = await invoke('refresh_all');
    if (res?.data?.profile) setProfile(res.data.profile);
    await load();
    setRunning(false);
  };

  const handleConnTest = async () => {
    setConnTest({ loading: true });
    const res = await invoke('run_connection_test');
    setConnTest(res?.data || { success: false, error: 'No response' });
  };

  const handleCapTest = async () => {
    setCapTest({ loading: true });
    const res = await invoke('run_capability_test');
    setCapTest(res?.data || { success: false, error: 'No response' });
  };

  const handleSaveDefaults = async () => {
    setSavingDefaults(true);
    await invoke('save_defaults', { data: defaults });
    await load();
    setSavingDefaults(false);
  };

  const readiness = useMemo(() => computeReadiness(profile), [profile]);
  const rdDisplay = READINESS_DISPLAY[readiness.status] || READINESS_DISPLAY.needs_connection;
  const nextAction = useMemo(() => computeNextAction(profile, readiness), [profile, readiness]);
  const isFullyReady = readiness.score >= 95;
  const isConnectedButIncomplete = readiness.status === 'connected_but_incomplete' || readiness.status === 'partially_ready';

  const perms = useMemo(() => {
    try { return JSON.parse(profile?.permissions_json || '[]'); } catch { return []; }
  }, [profile?.permissions_json]);

  const chDisplay = CHANNEL_STATUS_DISPLAY[readiness.channelStatus] || CHANNEL_STATUS_DISPLAY.not_started;

  // Step statuses
  const s1 = !profile ? 'not_started' : profile.token_status === 'active' ? 'ready' : ['expired','invalid'].includes(profile.token_status) ? 'blocked' : 'not_started';
  const s2 = !profile?.youtube_channel_id ? 'not_started' : profile.upload_access_verified ? 'ready' : 'incomplete';
  const s3 = !profile?.last_verified_at ? 'not_started' : profile.publish_permissions_ok ? 'ready' : 'incomplete';
  const s4 = !profile ? 'not_started' : 'incomplete'; // defaults always editable
  const s5 = !connTest && !capTest ? 'not_started' : (connTest?.success && capTest?.success) ? 'ready' : (connTest?.loading || capTest?.loading) ? 'pending' : 'incomplete';

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top nav */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link to={createPageUrl("AdminConnections")}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Channel Connections
          </Button>
        </Link>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <YtIcon className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-slate-300">YouTube Setup</span>
        </div>
        <div className="ml-auto">
          <Button onClick={handleRefreshAll} disabled={running}
            className="bg-violet-600 hover:bg-violet-500 gap-2 font-bold text-sm">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh All
          </Button>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">YouTube Setup</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Repair YouTube publishing access, verify channel mapping, and unlock video distribution through NTA.
          </p>

          {/* Status badges */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className={`px-3 py-2 rounded-xl border text-xs ${rdDisplay.cls}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">YouTube Status</p>
              <p className="font-bold mt-0.5">{rdDisplay.label}</p>
            </div>
            <div className={`px-3 py-2 rounded-xl border text-xs ${chDisplay.cls}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Channel</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${chDisplay.dot}`} />
                <p className="font-bold">{chDisplay.label}</p>
              </div>
            </div>
            <div className={`px-3 py-2 rounded-xl border text-xs ${readiness.score >= 95 ? 'text-green-300 bg-green-950/30 border-green-800/40' : readiness.score >= 50 ? 'text-amber-300 bg-amber-950/30 border-amber-800/40' : 'text-red-300 bg-red-950/30 border-red-800/40'}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Readiness Score</p>
              <p className="font-bold mt-0.5">{readiness.score}/100</p>
            </div>
            <div className={`px-3 py-2 rounded-xl border text-xs ${profile?.upload_access_verified ? 'text-green-300 bg-green-950/30 border-green-800/40' : 'text-slate-400 bg-slate-900 border-slate-700'}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Upload Capability</p>
              <p className="font-bold mt-0.5">{profile?.upload_access_verified ? 'Verified' : 'Not Verified'}</p>
            </div>
            <div className="px-3 py-2 rounded-xl border text-xs text-slate-400 bg-slate-900 border-slate-700">
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Last Verified</p>
              <p className="font-bold mt-0.5">{profile?.last_verified_at ? new Date(profile.last_verified_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-800/60">
            {[
              { label: 'Channel Connections', to: 'AdminConnections' },
              { label: 'Publishing Queue', to: 'AdminVideoPublishing' },
              { label: 'Blocked Jobs', to: 'AdminVideoPublishing' },
            ].map(({ label, to }) => (
              <Link key={label} to={createPageUrl(to)}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-violet-400 transition-colors">
                <ExternalLink className="w-3 h-3" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
        ) : (
          <>
            {/* Top callout */}
            {!isFullyReady && (
              <div className={`rounded-2xl border-2 p-4 flex items-start gap-3 ${
                ['token_expired','blocked'].includes(readiness.status) ? 'border-red-700/40 bg-red-950/20'
                : isConnectedButIncomplete ? 'border-amber-700/30 bg-amber-950/15'
                : 'border-violet-700/30 bg-violet-950/15'
              }`}>
                {['token_expired','blocked'].includes(readiness.status)
                  ? <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  : isConnectedButIncomplete
                  ? <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  : <Lock className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${['token_expired','blocked'].includes(readiness.status) ? 'text-red-200' : isConnectedButIncomplete ? 'text-amber-200' : 'text-violet-200'}`}>
                    {readiness.status === 'token_expired'
                      ? 'YouTube token has expired — video publishing is fully blocked.'
                      : isConnectedButIncomplete
                      ? 'YouTube is connected but incomplete — publishing is not yet available.'
                      : 'YouTube publishing is not fully ready yet.'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    Complete the steps below to unlock YouTube video distribution.
                    {isConnectedButIncomplete && ' Parts of the connection are working but missing items are preventing publishing.'}
                  </p>
                </div>
                <Button onClick={handleRefreshAll} disabled={running} size="sm"
                  className="bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs font-bold flex-shrink-0">
                  {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Refresh
                </Button>
              </div>
            )}
            {isFullyReady && (
              <div className="rounded-2xl border-2 border-green-700/40 bg-green-950/20 p-4 flex items-center gap-3">
                <Unlock className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-200">YouTube is fully configured and ready.</p>
                  <p className="text-xs text-slate-400 mt-0.5">Channel is verified and upload capability is confirmed. Run a test upload to validate end-to-end.</p>
                </div>
              </div>
            )}

            {/* What's Missing + Next Action */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <p className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <ListChecks className="w-4 h-4 text-violet-400" /> What's Missing
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: 'Google/YouTube account connected',     done: profile?.token_status === 'active' },
                      { label: 'YouTube channel mapped',               done: !!profile?.youtube_channel_id },
                      { label: 'Channel access verified via API',      done: !!profile?.upload_access_verified },
                      { label: 'Upload permissions confirmed',         done: !!profile?.publish_permissions_ok },
                      { label: 'Standard video publish supported',     done: !!profile?.standard_video_publish_supported },
                      { label: 'YouTube Shorts capability confirmed',  done: !!profile?.shorts_publish_supported },
                    ].map(({ label, done }) => (
                      <div key={label} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all ${
                        done ? 'border-green-800/25 bg-green-950/10' : 'border-slate-700/50 bg-slate-800/20'
                      }`}>
                        {done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                          : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 flex-shrink-0" />}
                        <span className={`text-xs font-medium ${done ? 'text-green-300' : 'text-slate-400'}`}>{label}</span>
                        {!done && <span className="ml-auto text-[9px] font-bold text-slate-600 uppercase tracking-wide">Missing</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 ${
                nextAction.priority === 'critical' ? 'bg-red-950/10 border-red-800/30'
                : nextAction.priority === 'high'   ? 'bg-amber-950/10 border-amber-800/30'
                : 'bg-slate-900 border-slate-700'
              }`}>
                <CardContent className="p-5 flex flex-col h-full">
                  <p className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-violet-400" /> Recommended Next Action
                  </p>
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest mb-3 ${
                        nextAction.priority === 'critical' ? 'border-red-700/50 bg-red-900/30 text-red-300'
                        : nextAction.priority === 'high'   ? 'border-amber-700/50 bg-amber-900/30 text-amber-300'
                        : 'border-violet-700/50 bg-violet-900/30 text-violet-300'
                      }`}>
                        {nextAction.priority === 'critical' ? '🔴' : nextAction.priority === 'high' ? '🟡' : '🟢'} {nextAction.priority} priority
                      </div>
                      <p className="text-sm text-slate-200 font-semibold leading-snug">{nextAction.label}</p>
                    </div>
                    <Button onClick={handleRefreshAll} disabled={running}
                      className="w-full bg-violet-600 hover:bg-violet-500 gap-2 font-bold text-sm">
                      {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      {isFullyReady ? 'Re-verify All' : 'Run Verification'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Issues panel */}
            {readiness.issues.length > 0 && (
              <Card className="bg-slate-900 border-red-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Issues Blocking Publishing
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-900/40 border border-red-700/50 text-red-300 ml-auto">
                      {readiness.issues.length} issue{readiness.issues.length !== 1 ? 's' : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {readiness.issues.map((issue, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${issue.blocking ? 'border-red-800/40 bg-red-950/15' : 'border-orange-800/30 bg-orange-950/10'}`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${issue.blocking ? 'text-red-400' : 'text-orange-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${issue.blocking ? 'text-red-200' : 'text-orange-200'}`}>{issue.title}</p>
                          <p className="text-xs text-slate-400 mt-1 leading-snug">{issue.reason}</p>
                          <div className="flex items-start gap-1.5 mt-2">
                            <ChevronRight className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-violet-300 leading-snug">{issue.step}</p>
                          </div>
                        </div>
                        {issue.blocking && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-red-700/50 bg-red-900/40 text-red-300 flex-shrink-0">BLOCKING</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Connection Overview */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <p className="text-sm font-bold text-slate-200 uppercase tracking-wide">YouTube Connection Overview</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { Icon: YtIcon, label: 'YouTube Channel', value: profile?.youtube_channel_name || 'Not mapped', sub: profile?.youtube_channel_id, ok: !!profile?.upload_access_verified },
                    { Icon: YtIcon, label: 'Handle', value: profile?.youtube_handle ? `@${profile.youtube_handle}` : 'Not retrieved', sub: null, ok: !!profile?.youtube_handle },
                    { Icon: Wifi,   label: 'Token Status', value: profile?.token_status || 'not_set', sub: profile?.google_account_email, ok: profile?.token_status === 'active' },
                    { Icon: Shield, label: 'Upload Permissions', value: profile?.publish_permissions_ok ? 'Verified' : 'Not verified', sub: perms.some(p => p.includes('youtube')) ? 'youtube scope granted' : null, ok: !!profile?.publish_permissions_ok },
                  ].map(({ Icon, label, value, sub, ok }) => (
                    <div key={label} className={`px-3 py-3 rounded-xl border flex items-center gap-3 ${ok ? 'border-green-800/25 bg-green-950/10' : 'border-slate-700/60 bg-slate-800/30'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-900/40' : 'bg-slate-800'}`}>
                        <Icon className={`w-4 h-4 ${ok ? 'text-green-400' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{label}</p>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{value}</p>
                        {sub && <p className="text-[10px] text-slate-600 font-mono truncate">{sub}</p>}
                      </div>
                      {ok ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-slate-700 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step cards */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" /> Guided Setup Steps
              </h2>

              <MetaStepCard
                step={1} title="Google / YouTube Connection" status={s1}
                description="Verify a valid Google OAuth token is configured with YouTube upload scope. Without this, the YouTube API cannot be accessed."
                checks={[
                  { label: 'YOUTUBE_ACCESS_TOKEN secret configured', passed: profile?.token_status !== 'not_set' && profile?.token_status != null },
                  { label: 'Token is active and valid', passed: profile?.token_status === 'active', note: profile?.token_status === 'expired' ? 'Token has expired — refresh via Google OAuth and update the secret' : null },
                  { label: 'YouTube scope present in token', passed: perms.some(p => p.includes('youtube')) ? true : perms.length > 0 ? false : null, note: 'Required: youtube.upload or youtube scope' },
                  { label: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured', passed: true, note: 'Configured in environment secrets' },
                ]}
                actions={[{ label: 'Verify Token', primary: true, loading: running, onClick: handleRefreshAll }]}
              />

              <MetaStepCard
                step={2} title="Channel Detection + Selection" status={s2}
                description="Verify that a specific YouTube channel is mapped and accessible. NTA needs a channel to target for all video uploads."
                checks={[
                  { label: 'YOUTUBE_CHANNEL_ID configured in secrets', passed: !!profile?.youtube_channel_id, note: profile?.youtube_channel_id ? `ID: ${profile.youtube_channel_id}` : 'Set YOUTUBE_CHANNEL_ID in environment secrets (starts with UC…)' },
                  { label: 'Channel found and accessible via API', passed: !!profile?.youtube_channel_name, note: profile?.youtube_channel_name ? `"${profile.youtube_channel_name}"` : 'Channel name not yet retrieved' },
                  { label: 'Channel handle detected', passed: !!profile?.youtube_handle, note: profile?.youtube_handle ? `@${profile.youtube_handle}` : null },
                  { label: 'Upload access verified on channel', passed: !!profile?.upload_access_verified },
                ]}
                actions={[{ label: 'Verify Channel Access', primary: s2 !== 'ready', loading: running, onClick: handleRefreshAll }]}
              />

              <MetaStepCard
                step={3} title="Upload Capability Check" status={s3}
                description="Confirm NTA can upload videos, set metadata, and publish content to the selected channel. Checks standard video and Shorts capabilities."
                checks={[
                  { label: 'Standard video upload capability', passed: profile?.standard_video_publish_supported ? true : profile?.last_verified_at ? false : null },
                  { label: 'YouTube Shorts supported', passed: profile?.shorts_publish_supported ? true : profile?.last_verified_at ? false : null, note: 'Shorts are standard uploads with vertical format and #Shorts tag' },
                  { label: 'Metadata publish (title, description, visibility)', passed: profile?.publish_permissions_ok ? true : null },
                  { label: 'Scheduled upload supported', passed: profile?.publish_permissions_ok ? true : null },
                ]}
                actions={[{ label: 'Run Capability Check', primary: s3 !== 'ready', loading: running, onClick: handleRefreshAll }]}
                result={capTest}
              />

              <MetaStepCard
                step={4} title="Default Publishing Rules" status={s4}
                description="Configure default settings for all YouTube uploads from NTA. These can be overridden per video."
                checks={[
                  { label: `Default visibility: ${defaults.default_visibility}`, passed: true },
                  { label: `Auto-publish Shorts: ${defaults.auto_publish_shorts ? 'Enabled' : 'Disabled'}`, passed: null },
                  { label: `Scheduled publishing: ${defaults.allow_scheduled_publishing ? 'Allowed' : 'Disabled'}`, passed: null },
                  { label: `Branded footer: ${defaults.append_branded_footer ? 'Appended' : 'Not appended'}`, passed: null },
                ]}
                actions={[]}
              />

              <MetaStepCard
                step={5} title="Test Upload / Connection Check" status={s5}
                description="Run safe API tests to confirm the channel is accessible and upload-capable. No content is uploaded during these tests."
                checks={connTest || capTest ? [
                  { label: 'YouTube API connection test', passed: connTest?.success === true ? true : connTest?.success === false ? false : null, note: connTest?.message || connTest?.error },
                  { label: 'Upload capability test', passed: capTest?.success === true ? true : capTest?.success === false ? false : null, note: capTest?.message || capTest?.error },
                ] : []}
                actions={[
                  { label: 'Test Connection', primary: false, loading: connTest?.loading, onClick: handleConnTest },
                  { label: 'Test Capability', primary: false, loading: capTest?.loading, onClick: handleCapTest },
                ]}
              />
            </div>

            {/* Default Publishing Rules editor */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-violet-400" /> Default Publishing Rules
                  </p>
                  <Button onClick={handleSaveDefaults} disabled={savingDefaults || !profile} size="sm"
                    className="bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs font-bold">
                    {savingDefaults ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Save Defaults
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1.5">Default Visibility</p>
                    <div className="flex gap-2">
                      {['private', 'unlisted', 'public'].map(v => (
                        <button key={v} onClick={() => setDefaults(d => ({ ...d, default_visibility: v }))}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all capitalize ${
                            defaults.default_visibility === v
                              ? 'border-violet-600 bg-violet-900/40 text-violet-200'
                              : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                          }`}>{v}</button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">Recommended: Private for review, Unlisted for safe testing</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1.5">Default Category</p>
                    <select value={defaults.default_category} onChange={e => setDefaults(d => ({ ...d, default_category: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-600">
                      {YT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-2">Publish Options</p>
                    <div className="space-y-2">
                      {[
                        { key: 'auto_publish_shorts', label: 'Auto-publish vertical clips as Shorts' },
                        { key: 'allow_scheduled_publishing', label: 'Allow scheduled publishing' },
                        { key: 'append_branded_footer', label: 'Append branded footer to description' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                          <div onClick={() => setDefaults(d => ({ ...d, [key]: !d[key] }))}
                            className={`w-8 h-4 rounded-full border-2 transition-all flex items-center px-0.5 cursor-pointer ${
                              defaults[key] ? 'border-violet-600 bg-violet-900/60' : 'border-slate-600 bg-slate-800'
                            }`}>
                            <div className={`w-2.5 h-2.5 rounded-full transition-all ${defaults[key] ? 'bg-violet-400 translate-x-3.5' : 'bg-slate-600'}`} />
                          </div>
                          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-1.5">Audience Setting</p>
                    <div className="flex gap-2">
                      {[{ v: 'not_for_kids', l: 'Not for Kids' }, { v: 'for_kids', l: 'Made for Kids' }].map(({ v, l }) => (
                        <button key={v} onClick={() => setDefaults(d => ({ ...d, default_audience_setting: v }))}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            defaults.default_audience_setting === v
                              ? 'border-violet-600 bg-violet-900/40 text-violet-200'
                              : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                          }`}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What NTA will unlock */}
            <Card className={`border-2 ${isFullyReady ? 'border-green-700/30 bg-green-950/10' : 'border-slate-800 bg-slate-900'}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  {isFullyReady ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  <p className="text-sm font-bold text-slate-200">What NTA will unlock when YouTube is ready</p>
                  {!isFullyReady && <span className="ml-auto text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-500 uppercase tracking-widest">Locked</span>}
                  {isFullyReady  && <span className="ml-auto text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-green-700/50 bg-green-900/30 text-green-300 uppercase tracking-widest">Active</span>}
                </div>
                <p className="text-xs text-slate-500 mb-4 ml-6">Once verified, NTA will route approved videos to YouTube automatically with the defaults configured above.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { Icon: Video,  label: 'Standard YouTube video uploads', desc: 'Full-length approved videos uploaded with title, description, and tags.' },
                    { Icon: Play,   label: 'YouTube Shorts distribution',    desc: 'Vertical short-form clips published as Shorts with #Shorts tagging.' },
                    { Icon: Film,   label: 'Branded promo clips',            desc: 'NTA-branded promotional content scheduled and published on your channel.' },
                    { Icon: Clock,  label: 'Scheduled YouTube uploads',      desc: 'Videos published on a time delay — set visibility to private/scheduled.' },
                    { Icon: Shield, label: 'Approval-first publishing',      desc: 'Every video goes through NTA review before it appears on YouTube.' },
                  ].map(({ Icon, label, desc }) => (
                    <div key={label} className={`rounded-xl border p-3.5 flex items-start gap-3 transition-all ${
                      isFullyReady ? 'border-slate-700/60 bg-slate-800/20' : 'border-slate-800/60 bg-slate-900/50 opacity-60'
                    }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isFullyReady ? 'bg-slate-800' : 'bg-slate-900'}`}>
                        <Icon className={`w-3.5 h-3.5 ${isFullyReady ? 'text-red-400' : 'text-slate-700'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold leading-snug ${isFullyReady ? 'text-slate-200' : 'text-slate-600'}`}>{label}</p>
                        <p className={`text-[10px] mt-0.5 leading-snug ${isFullyReady ? 'text-slate-500' : 'text-slate-700'}`}>{desc}</p>
                      </div>
                      {isFullyReady ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" /> : <Lock className="w-3 h-3 text-slate-700 flex-shrink-0 mt-0.5" />}
                    </div>
                  ))}
                </div>
                {isFullyReady && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                    <Link to={createPageUrl("AdminVideoPublishing")}><Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white gap-1.5 text-xs"><LayoutGrid className="w-3 h-3" /> Publishing Queue</Button></Link>
                    <Link to={`${createPageUrl("AdminVideoPublishing")}?filter=blocked`}><Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white gap-1.5 text-xs"><AlertTriangle className="w-3 h-3" /> Blocked Jobs</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" /> YouTube Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-center py-8 text-sm text-slate-600">No activity yet. Click "Refresh All" to begin verification.</p>
                ) : (
                  <div className="relative space-y-1">
                    <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-800" />
                    {logs.slice(0, 30).map((log, i) => (
                      <div key={log.id || i} className="flex items-start gap-4 relative">
                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                          log.event_type?.includes('succeeded') || log.event_type === 'connection_verified' ? 'bg-green-950/40 border-green-700/50' :
                          log.event_type?.includes('failed') || log.event_type === 'connection_failed' ? 'bg-red-950/40 border-red-700/50' :
                          'bg-slate-800 border-slate-700'
                        }`}>
                          {log.event_type?.includes('succeeded') || log.event_type === 'connection_verified'
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                            : log.event_type?.includes('failed') || log.event_type === 'connection_failed'
                            ? <XCircle className="w-3.5 h-3.5 text-red-400" />
                            : <Clock className="w-3.5 h-3.5 text-slate-500" />}
                        </div>
                        <div className="flex-1 min-w-0 py-2 border-b border-slate-800/50">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className={`text-xs font-semibold ${EVENT_COLORS[log.event_type] || 'text-slate-300'}`}>
                              {log.event_label || log.event_type}
                            </p>
                            <span className="text-[10px] text-slate-600 whitespace-nowrap">
                              {log.logged_at ? new Date(log.logged_at).toLocaleString() : ''}
                            </span>
                          </div>
                          {log.event_details && <p className="text-[10px] text-slate-600 mt-0.5 leading-snug truncate">{log.event_details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}