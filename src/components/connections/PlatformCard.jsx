import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw,
  Settings, Wifi, WifiOff, Clock, Play, ChevronDown, ChevronUp,
  ArrowUpRight, Film, List, ExternalLink
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export const STATUS_CONFIG = {
  connected:            { label: "Connected",          cls: "bg-green-900/30 text-green-300 border-green-700/40",   dot: "bg-green-400" },
  incomplete:           { label: "Incomplete",          cls: "bg-amber-900/30 text-amber-300 border-amber-700/40",   dot: "bg-amber-400" },
  needs_connection:     { label: "Not Connected",       cls: "bg-slate-800 text-slate-400 border-slate-700",         dot: "bg-slate-600" },
  token_expired:        { label: "Token Expired",       cls: "bg-red-900/30 text-red-300 border-red-700/40",         dot: "bg-red-400" },
  error:                { label: "Error",               cls: "bg-red-900/30 text-red-300 border-red-700/40",         dot: "bg-red-500" },
  disabled:             { label: "Disabled",            cls: "bg-slate-800 text-slate-600 border-slate-700",         dot: "bg-slate-700" },
  pending_verification: { label: "Pending",             cls: "bg-blue-900/30 text-blue-300 border-blue-700/40",      dot: "bg-blue-400" },
};

export function getReadiness(status) {
  if (status === 'connected') return { label: 'Ready', cls: 'text-green-400 bg-green-950/50 border-green-800/40' };
  if (['incomplete', 'pending_verification'].includes(status)) return { label: 'Partially Ready', cls: 'text-amber-300 bg-amber-950/40 border-amber-800/40' };
  if (['token_expired', 'error'].includes(status)) return { label: 'Blocked', cls: 'text-red-400 bg-red-950/40 border-red-800/40' };
  return { label: 'Not Configured', cls: 'text-slate-500 bg-slate-900 border-slate-700' };
}

export default function PlatformCard({ platform, conn, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showReqs, setShowReqs] = useState(false);
  const [editData, setEditData] = useState(null);

  const status = conn?.connection_status || 'needs_connection';
  const sCfg = STATUS_CONFIG[status] || STATUS_CONFIG.needs_connection;
  const readiness = getReadiness(status);
  const PIcon = platform.Icon;
  const isHealthy = status === 'connected';
  const isIncomplete = status === 'incomplete';
  const hasIssue = ['error', 'token_expired', 'incomplete'].includes(status);

  const openModal = () => {
    setEditData({
      account_label: conn?.account_label || '',
      page_id_or_channel_id: conn?.page_id_or_channel_id || '',
      publishing_enabled: conn?.publishing_enabled ?? false,
      default_destination: conn?.default_destination ?? false,
      notes: conn?.notes || '',
    });
    setTestResult(null);
    setModalOpen(true);
  };

  const invoke = (action, extra = {}) =>
    base44.functions.invoke('connectionHealthCheck', { action, platform_type: platform.type, connection_id: conn?.id || null, ...extra });

  const handleVerify = async () => {
    setVerifying(true);
    await invoke('verify_platform');
    await onRefresh();
    setVerifying(false);
  };

  const handleTest = async () => {
    setTesting(true);
    const res = await invoke('run_test_publish');
    setTestResult(res?.data || { success: false, error: 'No response' });
    setTesting(false);
  };

  const handleSave = async () => {
    if (!conn) return;
    setSaving(true);
    await invoke('update_settings', { settings: editData });
    await onRefresh();
    setSaving(false);
    setModalOpen(false);
  };

  const handleToggle = async (val) => {
    if (!conn) return;
    await invoke('toggle_publishing', { enabled: val });
    await onRefresh();
  };

  return (
    <>
      <Card className={`border-2 transition-all hover:shadow-lg hover:shadow-black/20 flex flex-col ${
        isHealthy   ? 'bg-slate-900 border-green-800/30' :
        isIncomplete? 'bg-slate-900 border-amber-800/25' :
        hasIssue    ? 'bg-slate-900 border-red-900/25' :
                      'bg-slate-900 border-slate-800'
      }`}>
        <CardContent className="p-5 space-y-3 flex flex-col flex-1">

          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${platform.iconBg}`}>
                <PIcon className={`w-5 h-5 ${platform.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">{platform.label}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[130px]">
                  {conn?.account_label || platform.defaultLabel}
                </p>
              </div>
            </div>
            {/* Status + Readiness stacked */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold ${sCfg.cls}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                {sCfg.label}
              </div>
              <div className={`flex items-center px-2 py-0.5 rounded-full border text-[9px] font-extrabold tracking-wide ${readiness.cls}`}>
                {readiness.label}
              </div>
            </div>
          </div>

          {/* What NTA can publish here */}
          {platform.publishTypes && (
            <div className="space-y-1.5">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold flex items-center gap-1">
                <Film className="w-2.5 h-2.5" /> What NTA publishes here
              </p>
              <div className="flex flex-wrap gap-1">
                {platform.publishTypes.map((pt, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Account ID */}
          {conn?.page_id_or_channel_id && (
            <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold">Account / Page ID</p>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5 truncate">{conn.page_id_or_channel_id}</p>
            </div>
          )}

          {/* Incomplete callout — token/auth exists but page mapping missing */}
          {isIncomplete && platform.setupGuide && (
            <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Connected but incomplete
              </p>
              <p className="text-[10px] text-slate-400 leading-snug">
                <span className="font-semibold text-slate-300">Missing: </span>{platform.setupGuide.missing}
              </p>
              <p className="text-[10px] text-amber-400/70 leading-snug">→ {platform.setupGuide.next_step}</p>
            </div>
          )}

          {/* Needs setup callout */}
          {(status === 'needs_connection') && platform.setupGuide && (
            <div className="rounded-lg border border-slate-700 bg-slate-800/30 px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-slate-500" /> Setup required
              </p>
              <p className="text-[10px] text-slate-500 leading-snug">{platform.setupGuide.blocked_reason}</p>
              <p className="text-[10px] text-violet-400/80 leading-snug">→ {platform.setupGuide.next_step}</p>
            </div>
          )}

          {/* Generic error */}
          {conn?.last_error && !isHealthy && !isIncomplete && status !== 'needs_connection' && (
            <div className="px-3 py-2 rounded-lg bg-slate-800/30 border border-red-900/30">
              <p className="text-[10px] text-red-300/70 leading-snug">{conn.last_error}</p>
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
            <span className={`flex items-center gap-1 ${conn?.token_status === 'active' ? 'text-green-500' : 'text-slate-600'}`}>
              {conn?.token_status === 'active' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {conn?.token_status || 'not set'}
            </span>
            {conn?.last_verified_at && (
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3 h-3" />
                {new Date(conn.last_verified_at).toLocaleDateString()}
              </span>
            )}
            {conn?.publishing_enabled && (
              <span className="flex items-center gap-1 text-violet-400 font-semibold">
                <Play className="w-3 h-3" /> Publishing ON
              </span>
            )}
          </div>

          {/* Publishing toggle */}
          {conn && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">Publishing Enabled</span>
              <Switch checked={!!conn.publishing_enabled} onCheckedChange={handleToggle} />
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={handleVerify} disabled={verifying}
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-1 text-xs h-8">
              {verifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Verify
            </Button>
            <Button size="sm" variant="outline" onClick={openModal}
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-1 text-xs h-8">
              <Settings className="w-3 h-3" /> Settings
            </Button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-800/60">
            {platform.metaSetupLink && (
              <Link to={createPageUrl("AdminMetaSetup")}
                className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                <ExternalLink className="w-3 h-3" /> Meta Setup →
              </Link>
            )}
            {platform.youtubeSetupLink && (
              <Link to={createPageUrl("AdminYouTubeSetup")}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-semibold transition-colors">
                <ExternalLink className="w-3 h-3" /> YouTube Setup →
              </Link>
            )}
            <Link to={createPageUrl("AdminVideoPublishing")}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-violet-400 transition-colors">
              <ArrowUpRight className="w-3 h-3" /> Publishing queue
            </Link>
            <Link to={`${createPageUrl("AdminVideoPublishing")}?platform=${platform.type}&filter=failed`}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-red-400 transition-colors">
              <XCircle className="w-3 h-3" /> Failed jobs
            </Link>
            <button onClick={() => { document.getElementById('audit-log')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer">
              <List className="w-3 h-3" /> Test logs
            </button>
          </div>

          {/* Requirements accordion */}
          <button
            onClick={() => setShowReqs(r => !r)}
            className="w-full flex items-center justify-between text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
            <span className="uppercase tracking-widest font-semibold">Requirements & Notes</span>
            {showReqs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showReqs && (
            <div className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3 space-y-1">
              {platform.requirements?.map((req, i) => (
                <p key={i} className="text-[10px] text-slate-500 leading-snug">• {req}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <PIcon className={`w-5 h-5 ${platform.iconColor}`} />
              {platform.label} — Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Status + Readiness */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold flex-1 ${sCfg.cls}`}>
                <div className={`w-2 h-2 rounded-full ${sCfg.dot}`} />
                {sCfg.label}
                {conn?.last_error && <span className="text-slate-500 font-normal ml-1 truncate text-[10px]">{conn.last_error}</span>}
              </div>
              <div className={`px-3 py-2 rounded-lg border text-xs font-extrabold ${readiness.cls}`}>
                {readiness.label}
              </div>
            </div>

            {/* Setup guide for incomplete/not configured */}
            {platform.setupGuide && !isHealthy && (
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-3 space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Setup Guide</p>
                {platform.setupGuide.missing && (
                  <p className="text-xs text-slate-300"><span className="text-amber-400 font-semibold">Missing: </span>{platform.setupGuide.missing}</p>
                )}
                {platform.setupGuide.blocked_reason && (
                  <p className="text-xs text-slate-400 leading-snug">{platform.setupGuide.blocked_reason}</p>
                )}
                <p className="text-xs text-violet-400 leading-snug">→ {platform.setupGuide.next_step}</p>
              </div>
            )}

            {/* Connection details */}
            {conn && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 space-y-1.5 text-xs">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Connection Details</p>
                {conn.profile_id && <p className="text-slate-400">Profile ID: <span className="text-slate-200 font-mono">{conn.profile_id}</span></p>}
                {conn.business_account_id && <p className="text-slate-400">Business ID: <span className="text-slate-200 font-mono">{conn.business_account_id}</span></p>}
                {conn.token_expires_at && <p className="text-slate-400">Token Expires: <span className={conn.token_status === 'expired' ? 'text-red-400' : 'text-slate-200'}>{new Date(conn.token_expires_at).toLocaleDateString()}</span></p>}
                {conn.last_verified_at && <p className="text-slate-400">Last Verified: <span className="text-slate-300">{new Date(conn.last_verified_at).toLocaleString()}</span></p>}
                {conn.last_publish_success_at && <p className="text-slate-400">Last Published: <span className="text-green-400">{new Date(conn.last_publish_success_at).toLocaleString()}</span></p>}
              </div>
            )}

            {/* Editable fields */}
            {editData && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5 block">Account Label</label>
                  <Input value={editData.account_label} onChange={e => setEditData(p => ({ ...p, account_label: e.target.value }))}
                    placeholder="e.g. Main Facebook Page"
                    className="bg-slate-800 border-slate-700 text-white text-sm focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5 block">
                    {platform.idLabel || 'Page / Channel / Account ID'}
                  </label>
                  <Input value={editData.page_id_or_channel_id} onChange={e => setEditData(p => ({ ...p, page_id_or_channel_id: e.target.value }))}
                    placeholder={platform.idPlaceholder || 'Enter ID...'}
                    className="bg-slate-800 border-slate-700 text-white text-sm font-mono focus:border-violet-500" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-b border-slate-800">
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Publishing Enabled</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Allow this channel to receive publish jobs</p>
                  </div>
                  <Switch checked={!!editData.publishing_enabled} onCheckedChange={v => setEditData(p => ({ ...p, publishing_enabled: v }))} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Default Destination</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Pre-select for new video projects</p>
                  </div>
                  <Switch checked={!!editData.default_destination} onCheckedChange={v => setEditData(p => ({ ...p, default_destination: v }))} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5 block">Internal Notes</label>
                  <Textarea value={editData.notes} onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Notes about this connection..."
                    className="bg-slate-800 border-slate-700 text-slate-200 text-sm min-h-[60px] resize-none focus:border-violet-500" />
                </div>
              </div>
            )}

            {/* Test tool */}
            <div className="border-t border-slate-800 pt-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Test Tools</p>
              <div className="flex items-start gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}
                  className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-1 text-xs">
                  {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
                  Run Test
                </Button>
                {testResult && (
                  <div className={`flex items-start gap-1.5 text-[10px] px-2.5 py-2 rounded-lg border flex-1 ${
                    testResult.success ? 'bg-green-900/20 border-green-700/40 text-green-300' : 'bg-red-900/20 border-red-700/40 text-red-300'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" /> : <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />}
                    <span className="leading-snug">{testResult.success ? (testResult.message || 'Connection OK') : (testResult.error || testResult.message || 'Test failed')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Platform Requirements</p>
              {platform.requirements?.map((req, i) => (
                <p key={i} className="text-[10px] text-slate-500 leading-snug">• {req}</p>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleSave} disabled={saving || !conn}
                className="flex-1 bg-violet-600 hover:bg-violet-500 font-bold gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Settings
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)}
                className="border-slate-700 text-slate-400 hover:text-white">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}