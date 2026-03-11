import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw, Settings, Wifi, WifiOff, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  connected:            { label: "Connected",          cls: "bg-green-900/30 text-green-300 border-green-700/40",   dot: "bg-green-400" },
  ready:                { label: "Ready",               cls: "bg-green-900/30 text-green-300 border-green-700/40",   dot: "bg-green-400" },
  incomplete:           { label: "Incomplete",          cls: "bg-amber-900/30 text-amber-300 border-amber-700/40",   dot: "bg-amber-400" },
  needs_connection:     { label: "Not Connected",       cls: "bg-slate-800 text-slate-500 border-slate-700",         dot: "bg-slate-600" },
  token_expired:        { label: "Token Expired",       cls: "bg-red-900/30 text-red-300 border-red-700/40",         dot: "bg-red-400" },
  error:                { label: "Error",               cls: "bg-red-900/30 text-red-300 border-red-700/40",         dot: "bg-red-500" },
  disabled:             { label: "Disabled",            cls: "bg-slate-800 text-slate-600 border-slate-700",         dot: "bg-slate-700" },
  pending_verification: { label: "Pending",             cls: "bg-blue-900/30 text-blue-300 border-blue-700/40",      dot: "bg-blue-400" },
};

export default function PlatformConnectionCard({ platform, conn, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [editData, setEditData] = useState(null);

  const status = conn?.connection_status || 'needs_connection';
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.needs_connection;
  const PlatformIcon = platform.Icon;
  const isHealthy = status === 'connected' || status === 'ready';
  const hasIssue = status === 'error' || status === 'token_expired' || status === 'incomplete';
  const needsSetup = status === 'needs_connection';

  const handleOpenModal = () => {
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

  const handleVerify = async () => {
    setVerifying(true);
    await base44.functions.invoke('connectionHealthCheck', {
      action: 'verify_platform',
      platform_type: platform.type,
      connection_id: conn?.id || null
    });
    await onRefresh();
    setVerifying(false);
  };

  const handleTest = async () => {
    setTesting(true);
    const res = await base44.functions.invoke('connectionHealthCheck', {
      action: 'run_test_publish',
      platform_type: platform.type,
      connection_id: conn?.id || null
    });
    setTestResult(res?.data || { success: false, error: 'No response' });
    setTesting(false);
  };

  const handleSaveSettings = async () => {
    if (!conn) return;
    setSaving(true);
    await base44.functions.invoke('connectionHealthCheck', {
      action: 'update_settings',
      connection_id: conn.id,
      settings: editData
    });
    await onRefresh();
    setSaving(false);
    setModalOpen(false);
  };

  const handleTogglePublishing = async (val) => {
    if (!conn) return;
    await base44.functions.invoke('connectionHealthCheck', {
      action: 'toggle_publishing',
      connection_id: conn.id,
      enabled: val
    });
    await onRefresh();
  };

  return (
    <>
      <Card className={`border-2 transition-all ${
        isHealthy ? 'bg-slate-900 border-green-800/30' :
        hasIssue ? 'bg-slate-900 border-red-800/30' :
        needsSetup ? 'bg-slate-900 border-slate-700' :
        'bg-slate-900 border-slate-800'
      }`}>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${platform.iconBg}`}>
                <PlatformIcon className={`w-5 h-5 ${platform.iconColor}`} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-100">{platform.label}</p>
                <p className="text-xs text-slate-500 truncate max-w-[140px]">{conn?.account_label || platform.defaultLabel}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold flex-shrink-0 ${statusCfg.cls}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </div>
          </div>

          {/* Account info */}
          {conn?.page_id_or_channel_id && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Account / Page ID</p>
              <p className="text-xs text-slate-300 font-mono mt-0.5 truncate">{conn.page_id_or_channel_id}</p>
            </div>
          )}

          {/* Error */}
          {conn?.last_error && (hasIssue || needsSetup) && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p className="text-[10px] text-slate-500 leading-snug">{conn.last_error}</p>
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-[10px] text-slate-600">
            {conn?.token_status && (
              <span className={`flex items-center gap-1 ${conn.token_status === 'active' ? 'text-green-500' : 'text-red-400'}`}>
                {conn.token_status === 'active' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                Token: {conn.token_status}
              </span>
            )}
            {conn?.last_verified_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(conn.last_verified_at).toLocaleDateString()}
              </span>
            )}
            {conn?.last_publish_success_at && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                {new Date(conn.last_publish_success_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Publishing toggle */}
          {conn && (
            <div className="flex items-center justify-between py-2.5 border-t border-slate-800 mb-3">
              <span className="text-xs text-slate-400 font-medium">Publishing Enabled</span>
              <Switch
                checked={!!conn.publishing_enabled}
                onCheckedChange={handleTogglePublishing}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleVerify}
              disabled={verifying}
              className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1 text-xs flex-1"
            >
              {verifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Verify
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenModal}
              className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1 text-xs flex-1"
            >
              <Settings className="w-3 h-3" /> Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail / Settings Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <PlatformIcon className={`w-5 h-5 ${platform.iconColor}`} />
              {platform.label} — Connection Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            {/* Status */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${statusCfg.cls}`}>
              <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
              {conn?.last_error && <span className="text-slate-500 font-normal ml-1 truncate">{conn.last_error}</span>}
            </div>

            {/* Read-only connection details */}
            {conn && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 space-y-1.5 text-xs">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Connection Details</p>
                {conn.profile_id && <p className="text-slate-400">Profile ID: <span className="text-slate-200 font-mono">{conn.profile_id}</span></p>}
                {conn.business_account_id && <p className="text-slate-400">Business ID: <span className="text-slate-200 font-mono">{conn.business_account_id}</span></p>}
                {conn.token_expires_at && <p className="text-slate-400">Token Expires: <span className={conn.token_status === 'expired' ? 'text-red-400' : 'text-slate-200'}>{new Date(conn.token_expires_at).toLocaleDateString()}</span></p>}
                {conn.last_verified_at && <p className="text-slate-400">Last Verified: <span className="text-slate-200">{new Date(conn.last_verified_at).toLocaleString()}</span></p>}
                {conn.last_publish_success_at && <p className="text-slate-400">Last Published: <span className="text-green-400">{new Date(conn.last_publish_success_at).toLocaleString()}</span></p>}
              </div>
            )}

            {/* Editable fields */}
            {editData && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1 block">Account Label</label>
                  <Input value={editData.account_label} onChange={e => setEditData(p => ({...p, account_label: e.target.value}))}
                    placeholder="e.g. Main Facebook Page"
                    className="bg-slate-800 border-slate-700 text-white text-sm focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1 block">
                    {platform.idLabel || 'Page / Channel / Account ID'}
                  </label>
                  <Input value={editData.page_id_or_channel_id} onChange={e => setEditData(p => ({...p, page_id_or_channel_id: e.target.value}))}
                    placeholder={platform.idPlaceholder || 'Enter ID...'}
                    className="bg-slate-800 border-slate-700 text-white text-sm font-mono focus:border-violet-500" />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Publishing Enabled</p>
                    <p className="text-[10px] text-slate-600">Allow this channel to receive publish jobs</p>
                  </div>
                  <Switch checked={!!editData.publishing_enabled} onCheckedChange={v => setEditData(p => ({...p, publishing_enabled: v}))} />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Default Destination</p>
                    <p className="text-[10px] text-slate-600">Pre-select for new video projects</p>
                  </div>
                  <Switch checked={!!editData.default_destination} onCheckedChange={v => setEditData(p => ({...p, default_destination: v}))} />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1 block">Internal Notes</label>
                  <Textarea value={editData.notes} onChange={e => setEditData(p => ({...p, notes: e.target.value}))}
                    placeholder="Notes about this connection..."
                    className="bg-slate-800 border-slate-700 text-slate-200 text-sm min-h-[60px] resize-none focus:border-violet-500" />
                </div>
              </div>
            )}

            {/* Test publish tool */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Test Tools</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}
                  className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1 text-xs">
                  {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
                  Run Test
                </Button>
                {testResult && !testResult.loading && (
                  <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${testResult.success ? 'bg-green-900/20 border-green-700/40 text-green-300' : 'bg-red-900/20 border-red-700/40 text-red-300'}`}>
                    {testResult.success ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span className="text-[10px]">{testResult.success ? (testResult.message || 'Connection OK') : (testResult.error || 'Test failed')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Platform requirements */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/20 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Platform Requirements</p>
              <div className="space-y-1">
                {platform.requirements?.map((req, i) => (
                  <p key={i} className="text-[10px] text-slate-500 leading-snug">• {req}</p>
                ))}
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSaveSettings} disabled={saving || !conn}
                className="flex-1 bg-violet-600 hover:bg-violet-500 gap-2 text-sm font-bold">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Settings
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)} className="border-slate-700 text-slate-400 hover:text-slate-200">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}