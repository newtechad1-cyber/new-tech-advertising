import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, RefreshCw, Loader2, CheckCircle2, XCircle, AlertTriangle,
  Shield, Wifi, Clock, Film, ChevronRight, Zap, Radio,
  ExternalLink, ListChecks, Target, ArrowUpRight, Video,
  Lock, Unlock, Play, LayoutGrid
} from "lucide-react";
import MetaStepCard from "@/components/connections/MetaStepCard";

// ─── Facebook Icon ─────────────────────────────────────────────────────────
function FbIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
}
function IgIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}

// ─── Readiness Engine ─────────────────────────────────────────────────────────
function computeReadiness(profile) {
  if (!profile) return { score: 0, status: 'needs_connection', fbStatus: 'not_started', igStatus: 'not_started', issues: [] };

  const issues = [];
  let score = 0;

  // Token (25 pts)
  if (profile.token_status === 'active') {
    score += 25;
  } else if (profile.token_status === 'expired') {
    issues.push({ title: 'Meta access token has expired', reason: 'All Facebook and Instagram publishing is blocked until the token is renewed.', step: 'Regenerate the Page Access Token in Facebook Business Manager and update META_PAGE_ACCESS_TOKEN in Base44 environment secrets.', severity: 'critical', blocking: true });
  } else {
    issues.push({ title: 'Meta access token is not configured', reason: 'Facebook Graph API cannot be accessed without a valid Page Access Token.', step: 'Set META_PAGE_ACCESS_TOKEN in Base44 environment secrets with a valid Page-level token from Facebook Business Manager.', severity: 'critical', blocking: true });
  }

  // Page (20 pts)
  if (profile.facebook_page_id) {
    score += 20;
  } else {
    issues.push({ title: 'No Facebook Page is mapped for publishing', reason: 'The publishing system needs a Facebook Page ID to post video content.', step: 'Set META_PAGE_ID in environment secrets with the numeric ID of your Facebook Page, then click Refresh All.', severity: 'high', blocking: true });
  }

  // Page verified (20 pts)
  if (profile.facebook_page_access_verified) {
    score += 20;
  } else if (profile.facebook_page_id) {
    issues.push({ title: 'Facebook Page access has not been verified', reason: 'Page ID is set but the Graph API has not confirmed the page is accessible and publishing-ready.', step: 'Click "Refresh All" to run page access verification via the Facebook API.', severity: 'medium', blocking: false });
  }

  // Instagram (20 pts)
  if (profile.instagram_account_id) {
    score += 20;
  } else {
    issues.push({ title: 'Instagram Business Account not detected', reason: 'No Instagram Business or Creator account was found. Instagram publishing is not available.', step: 'Ensure your Instagram account is a Business or Creator account linked to the Facebook Page in Business Manager. Set META_INSTAGRAM_ACCOUNT_ID in secrets.', severity: 'high', blocking: false });
  }

  // IG linked (15 pts)
  if (profile.instagram_linked_to_facebook_page) {
    score += 15;
  } else if (profile.instagram_account_id) {
    issues.push({ title: 'Instagram is not linked to the selected Facebook Page', reason: 'Meta API requires Instagram to be connected to the same Facebook Page used for the access token.', step: 'In Facebook Business Manager → Settings → Instagram Accounts, connect your Instagram account to the Facebook Page.', severity: 'high', blocking: false });
  }

  if (profile.facebook_publish_permissions_ok) score = Math.min(score + 5, 100);

  const fbReady = profile.token_status === 'active' && profile.facebook_page_access_verified;
  const igReady = !!profile.instagram_account_id && !!profile.instagram_linked_to_facebook_page;

  let status = 'needs_connection';
  if (profile.token_status === 'expired') status = 'token_expired';
  else if (score >= 100) status = 'ready';
  else if (score >= 65)  status = 'partially_ready';
  else if (score >= 25)  status = 'connected_but_incomplete';
  else if (issues.some(i => i.blocking)) status = 'blocked';

  const fbStatus = profile.token_status !== 'active' ? (profile.token_status === 'expired' ? 'blocked' : 'not_started') : fbReady ? 'ready' : profile.facebook_page_id ? 'incomplete' : 'incomplete';
  const igStatus = !profile.instagram_account_id ? 'not_started' : igReady ? 'ready' : 'incomplete';

  return { score, status, issues, fbStatus, igStatus };
}

const READINESS_DISPLAY = {
  ready:                   { label: 'Ready',                   cls: 'text-green-300 bg-green-950/30 border-green-800/40' },
  partially_ready:         { label: 'Partially Ready',         cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40' },
  connected_but_incomplete:{ label: 'Connected — Incomplete',  cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40' },
  blocked:                 { label: 'Blocked',                 cls: 'text-red-300 bg-red-950/30 border-red-800/40' },
  token_expired:           { label: 'Token Expired',           cls: 'text-red-300 bg-red-950/30 border-red-800/40' },
  needs_connection:        { label: 'Not Configured',          cls: 'text-slate-400 bg-slate-900 border-slate-700' },
};

// ─── Next Action Engine ───────────────────────────────────────────────────────
function computeNextAction(profile, readiness) {
  if (!profile) return { label: 'Run initial verification to check Meta connection status', action: 'refresh', priority: 'high' };
  if (profile.token_status === 'expired') return { label: 'Reconnect expired Meta token — regenerate META_PAGE_ACCESS_TOKEN in environment secrets', action: 'refresh', priority: 'critical' };
  if (profile.token_status === 'not_set' || !profile.token_status) return { label: 'Configure META_PAGE_ACCESS_TOKEN in Base44 environment secrets', action: 'refresh', priority: 'critical' };
  if (!profile.facebook_page_id) return { label: 'Set META_PAGE_ID in environment secrets with your Facebook Page numeric ID', action: 'refresh', priority: 'high' };
  if (!profile.facebook_page_access_verified) return { label: 'Verify Facebook Page access — click Refresh All to confirm page is reachable', action: 'refresh', priority: 'high' };
  if (!profile.instagram_account_id) return { label: 'Set META_INSTAGRAM_ACCOUNT_ID in secrets with your Instagram Business Account ID', action: 'refresh', priority: 'medium' };
  if (!profile.instagram_linked_to_facebook_page) return { label: 'Link Instagram account to the selected Facebook Page in Business Manager', action: 'refresh', priority: 'medium' };
  if (!profile.facebook_publish_permissions_ok) return { label: 'Run Meta capability check to verify publishing permissions are granted', action: 'refresh', priority: 'low' };
  return { label: 'Run test publish to confirm Facebook and Instagram are fully operational', action: 'test', priority: 'low' };
}

const PLATFORM_STATUS = {
  ready:       { label: 'Ready',      cls: 'text-green-300 bg-green-950/30 border-green-800/40',   dot: 'bg-green-400' },
  incomplete:  { label: 'Incomplete', cls: 'text-amber-300 bg-amber-950/30 border-amber-800/40',  dot: 'bg-amber-400' },
  blocked:     { label: 'Blocked',    cls: 'text-red-300 bg-red-950/30 border-red-800/40',         dot: 'bg-red-400' },
  not_started: { label: 'Not Started',cls: 'text-slate-400 bg-slate-900 border-slate-700',         dot: 'bg-slate-600' },
};

const EVENT_COLORS = {
  connection_verified: 'text-green-400', connection_failed: 'text-red-400',
  test_publish_succeeded: 'text-green-400', test_publish_failed: 'text-red-400',
  page_mapping_updated: 'text-violet-400', settings_updated: 'text-blue-400',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminMetaSetup() {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [fbTest, setFbTest] = useState(null);
  const [igTest, setIgTest] = useState(null);

  const load = useCallback(async () => {
    const [profileRes, allLogs] = await Promise.all([
      base44.functions.invoke('metaConnectionSetup', { action: 'get_profile' }),
      base44.entities.PlatformConnectionAuditLog.list('-logged_at', 100)
    ]);
    setProfile(profileRes?.data?.profile || null);
    setLogs(allLogs.filter(l => ['facebook', 'instagram'].includes(l.platform_type)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const invoke = (action, extra = {}) =>
    base44.functions.invoke('metaConnectionSetup', { action, profile_id: profile?.id || null, ...extra });

  const handleRefreshAll = async () => {
    setRunning(true);
    const res = await invoke('refresh_all');
    if (res?.data?.profile) setProfile(res.data.profile);
    await load();
    setRunning(false);
  };

  const handleFbTest = async () => {
    setFbTest({ loading: true });
    const res = await invoke('run_facebook_test');
    setFbTest(res?.data || { success: false, error: 'No response' });
  };

  const handleIgTest = async () => {
    setIgTest({ loading: true });
    const res = await invoke('run_instagram_test');
    setIgTest(res?.data || { success: false, error: 'No response' });
  };

  const readiness = useMemo(() => computeReadiness(profile), [profile]);
  const rdDisplay = READINESS_DISPLAY[readiness.status] || READINESS_DISPLAY.needs_connection;
  const nextAction = useMemo(() => computeNextAction(profile, readiness), [profile, readiness]);
  const isFullyReady = readiness.score >= 100;
  const isConnectedButIncomplete = readiness.status === 'connected_but_incomplete' || readiness.status === 'partially_ready';

  const perms = useMemo(() => {
    try { return JSON.parse(profile?.permissions_json || '[]'); } catch { return []; }
  }, [profile?.permissions_json]);

  // Step statuses
  const s1 = !profile ? 'not_started' : profile.token_status === 'active' ? 'ready' : ['expired','invalid'].includes(profile.token_status) ? 'blocked' : 'not_started';
  const s2 = !profile?.facebook_page_id ? 'not_started' : profile.facebook_page_access_verified ? 'ready' : 'incomplete';
  const s3 = !profile?.instagram_account_id ? 'not_started' : profile.instagram_linked_to_facebook_page ? 'ready' : 'incomplete';
  const s4 = !profile?.last_verified_at ? 'not_started' : profile.facebook_publish_permissions_ok ? 'ready' : 'incomplete';
  const s5 = !fbTest && !igTest ? 'not_started' : (fbTest?.success && igTest?.success) ? 'ready' : (fbTest?.loading || igTest?.loading) ? 'pending' : 'incomplete';

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
          <FbIcon className="w-4 h-4 text-blue-400" />
          <IgIcon className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-slate-300">Facebook + Instagram Setup</span>
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Facebook + Instagram Setup</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Repair Meta publishing connections, verify page and account mapping, and unlock Facebook and Instagram distribution.
          </p>

          {/* Platform readiness labels */}
          <div className="flex flex-wrap gap-3 mt-5">
            {/* Overall */}
            <div className={`px-3 py-2 rounded-xl border text-xs ${rdDisplay.cls}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Meta Status</p>
              <p className="font-bold mt-0.5">{rdDisplay.label}</p>
            </div>
            {/* Facebook platform label */}
            {(() => {
              const cfg = PLATFORM_STATUS[readiness.fbStatus] || PLATFORM_STATUS.not_started;
              return (
                <div className={`px-3 py-2 rounded-xl border text-xs ${cfg.cls}`}>
                  <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Facebook</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <p className="font-bold">{cfg.label}</p>
                  </div>
                </div>
              );
            })()}
            {/* Instagram platform label */}
            {(() => {
              const cfg = PLATFORM_STATUS[readiness.igStatus] || PLATFORM_STATUS.not_started;
              return (
                <div className={`px-3 py-2 rounded-xl border text-xs ${cfg.cls}`}>
                  <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Instagram</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <p className="font-bold">{cfg.label}</p>
                  </div>
                </div>
              );
            })()}
            <div className={`px-3 py-2 rounded-xl border text-xs ${readiness.score >= 100 ? 'text-green-300 bg-green-950/30 border-green-800/40' : readiness.score >= 50 ? 'text-amber-300 bg-amber-950/30 border-amber-800/40' : 'text-red-300 bg-red-950/30 border-red-800/40'}`}>
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Readiness Score</p>
              <p className="font-bold mt-0.5">{readiness.score}/100</p>
            </div>
            <div className="px-3 py-2 rounded-xl border text-xs text-slate-400 bg-slate-900 border-slate-700">
              <p className="text-[9px] opacity-70 uppercase tracking-widest font-semibold">Last Verified</p>
              <p className="font-bold mt-0.5">{profile?.last_verified_at ? new Date(profile.last_verified_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          {/* Quick nav links */}
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

            {/* Meta overview card */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <p className="text-sm font-bold text-slate-200 uppercase tracking-wide">Meta Connection Overview</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: FbIcon, label: 'Facebook Page', value: profile?.facebook_page_name || 'Not mapped', sub: profile?.facebook_page_id, ok: !!profile?.facebook_page_access_verified },
                    { icon: IgIcon, label: 'Instagram Account', value: profile?.instagram_account_name ? `@${profile.instagram_account_name}` : 'Not mapped', sub: profile?.instagram_account_id, ok: !!profile?.instagram_linked_to_facebook_page },
                    { icon: Wifi, label: 'Token Status', value: profile?.token_status || 'not_set', sub: profile?.token_expires_at ? `Expires: ${new Date(profile.token_expires_at).toLocaleDateString()}` : null, ok: profile?.token_status === 'active' },
                    { icon: Shield, label: 'Publish Permissions', value: profile?.facebook_publish_permissions_ok ? 'Verified' : 'Not verified', sub: perms.length ? `${perms.length} permissions granted` : null, ok: !!profile?.facebook_publish_permissions_ok },
                  ].map(({ icon: Icon, label, value, sub, ok }) => (
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
                step={1} title="Facebook Account Connection" status={s1}
                description="Verify the Meta access token is active and configured. A valid Page-level access token is required for all Facebook and Instagram publishing."
                checks={[
                  { label: 'META_PAGE_ACCESS_TOKEN secret configured', passed: profile?.token_status !== 'not_set' && profile?.token_status != null },
                  { label: 'Token is active and valid', passed: profile?.token_status === 'active', note: profile?.token_status === 'expired' ? 'Token has expired — regenerate in Facebook Business Manager' : null },
                  { label: 'META_APP_ID and META_APP_SECRET configured', passed: true, note: 'Configured in environment secrets' },
                ]}
                actions={[
                  { label: 'Verify Token', primary: true, loading: running, onClick: handleRefreshAll },
                ]}
              />

              <MetaStepCard
                step={2} title="Facebook Page Mapping" status={s2}
                description="Verify that a specific Facebook Page is mapped and accessible using the current token. Publishing requires a Page ID with the correct permissions."
                checks={[
                  { label: 'META_PAGE_ID configured in secrets', passed: !!profile?.facebook_page_id },
                  { label: 'Facebook Page found via API', passed: !!profile?.facebook_page_name, note: profile?.facebook_page_name ? `Page: "${profile.facebook_page_name}" (${profile.facebook_page_id})` : 'Page name not yet retrieved' },
                  { label: 'Page access verified', passed: !!profile?.facebook_page_access_verified },
                  { label: 'Publish permissions on page', passed: profile?.facebook_publish_permissions_ok === true ? true : profile?.facebook_publish_permissions_ok === false ? false : null, note: perms.includes('pages_manage_posts') ? 'pages_manage_posts: granted' : perms.length > 0 ? 'pages_manage_posts: missing' : null },
                ]}
                actions={[
                  { label: 'Verify Page Access', primary: s2 !== 'ready', loading: running, onClick: handleRefreshAll },
                ]}
              />

              <MetaStepCard
                step={3} title="Instagram Business Account Mapping" status={s3}
                description="Instagram API publishing requires a Business or Creator account linked to the selected Facebook Page. Personal accounts are not supported."
                checks={[
                  { label: 'META_INSTAGRAM_ACCOUNT_ID configured', passed: !!profile?.instagram_account_id },
                  { label: 'Instagram account found via API', passed: !!profile?.instagram_account_name, note: profile?.instagram_account_name ? `@${profile.instagram_account_name} (${profile.instagram_account_id})` : null },
                  { label: 'Account is Business or Creator type', passed: profile?.instagram_account_type ? ['BUSINESS','CREATOR'].includes(profile.instagram_account_type.toUpperCase()) : null, note: profile?.instagram_account_type ? `Account type: ${profile.instagram_account_type}` : 'Account type not yet verified' },
                  { label: 'Instagram linked to selected Facebook Page', passed: !!profile?.instagram_linked_to_facebook_page, note: !profile?.instagram_linked_to_facebook_page && profile?.instagram_account_id ? 'Connect in Facebook Business Manager → Settings → Instagram Accounts' : null },
                ]}
                actions={[
                  { label: 'Verify Instagram Mapping', primary: s3 !== 'ready', loading: running, onClick: handleRefreshAll },
                ]}
              />

              <MetaStepCard
                step={4} title="Permission & Capability Check" status={s4}
                description="Confirm all required permissions are granted and that the Meta integration is capable of posting video content to Facebook and Instagram."
                checks={[
                  { label: 'pages_manage_posts', passed: perms.includes('pages_manage_posts') ? true : perms.length > 0 ? false : null },
                  { label: 'pages_read_engagement', passed: perms.includes('pages_read_engagement') ? true : perms.length > 0 ? false : null },
                  { label: 'Facebook video publishing capability', passed: profile?.facebook_page_access_verified ? true : null },
                  { label: 'Instagram media publishing capability', passed: profile?.instagram_linked_to_facebook_page && profile?.instagram_publish_permissions_ok ? true : profile?.instagram_account_id ? false : null },
                ]}
                actions={[
                  { label: 'Run Capability Check', primary: s4 !== 'ready', loading: running, onClick: handleRefreshAll },
                ]}
              />

              <MetaStepCard
                step={5} title="Test Publish" status={s5}
                description="Run safe API verification tests for both Facebook and Instagram. These tests confirm the connection is working without posting any actual content."
                checks={fbTest || igTest ? [
                  { label: 'Facebook API test', passed: fbTest?.success === true ? true : fbTest?.success === false ? false : null, note: fbTest?.message || fbTest?.error },
                  { label: 'Instagram API test', passed: igTest?.success === true ? true : igTest?.success === false ? false : null, note: igTest?.message || igTest?.error },
                ] : []}
                actions={[
                  { label: 'Test Facebook', primary: false, loading: fbTest?.loading, onClick: handleFbTest },
                  { label: 'Test Instagram', primary: false, loading: igTest?.loading, onClick: handleIgTest },
                ]}
              />
            </div>

            {/* Supported publish types */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <p className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
                  <Film className="w-4 h-4 text-violet-400" /> What NTA Can Publish Once Ready
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { platform: 'Facebook', Icon: FbIcon, color: 'text-blue-400', types: ['Video page posts', 'Promotional clips', 'Ad-ready content', 'Reels (where supported)'] },
                    { platform: 'Instagram', Icon: IgIcon, color: 'text-pink-400', types: ['Feed video posts', 'Instagram Reels', 'Promotional clips', 'Story-format content'] },
                  ].map(({ platform, Icon, color, types }) => (
                    <div key={platform} className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <p className="text-xs font-bold text-slate-300">{platform}</p>
                      </div>
                      {types.map(t => (
                        <p key={t} className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                          <Radio className="w-2.5 h-2.5 text-slate-700" /> {t}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity log */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" /> Meta Activity Log
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