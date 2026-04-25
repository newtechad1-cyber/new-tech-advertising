import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Loader2, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

const platformMeta = {
  facebook:           { name: 'Facebook',          emoji: '📘', desc: 'Connect your Facebook Page to enable posting.' },
  instagram:          { name: 'Instagram',          emoji: '📷', desc: 'Connect your Instagram Business account.' },
  youtube:            { name: 'YouTube',            emoji: '▶️', desc: 'Connect your YouTube Channel.' },
  google_my_business: { name: 'Google My Business', emoji: '🗺️', desc: 'Connect your Google Business Profile.' },
  tiktok:             { name: 'TikTok',             emoji: '🎵', desc: 'Connect your TikTok account.' },
  linkedin:           { name: 'LinkedIn',           emoji: '💼', desc: 'Connect your LinkedIn Company Page.' },
};

// Platforms that always need a destination selected before they are "ready"
const NEEDS_DESTINATION = ['facebook', 'instagram', 'youtube', 'google_my_business'];

export default function ConnectModal({ account, open, onClose, onSaved }) {
  const [step, setStep] = useState('idle'); // idle | loading | destination_select | syncing | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [liveAccount, setLiveAccount] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [savingDest, setSavingDest] = useState(false);

  useEffect(() => {
    if (open) {
      setStep('idle');
      setErrorMsg('');
      setLiveAccount(null);
      setDestinations([]);
      setSelectedDest('');
    }
  }, [open, account?.platform]);

  if (!account) return null;
  const meta = platformMeta[account.platform];

  // ── LinkedIn: mark directly ──────────────────────────────────────────────
  const handleLinkedIn = async () => {
    setStep('loading');
    try {
      const data = {
        platform: 'linkedin',
        account_name: 'LinkedIn (App Connector)',
        platform_user_id: 'app_connector',
        status: 'ready',
        last_synced_at: new Date().toISOString(),
      };
      if (account.id) {
        await base44.entities.SocialAccount.update(account.id, data);
      } else {
        await base44.entities.SocialAccount.create(data);
      }
      setStep('success');
      setTimeout(() => onSaved(), 1200);
    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
    }
  };

  // ── OAuth popup + poll ───────────────────────────────────────────────────
  const handleConnect = async () => {
    if (account.platform === 'linkedin') return handleLinkedIn();

    setStep('loading');
    setErrorMsg('');

    try {
      const res = await base44.functions.invoke('socialOAuth', { platform: account.platform });
      const { authUrl } = res.data;
      const popup = window.open(authUrl, 'oauth_popup', 'width=600,height=700,scrollbars=yes');

      const startTime = Date.now();
      const poll = setInterval(async () => {
        if (popup?.closed && Date.now() - startTime > 2000) {
          clearInterval(poll);
          // Re-check DB in case it completed just before popup closed
          checkForCompletedAccount(poll);
          return;
        }
        await checkForCompletedAccount(poll);
      }, 2000);

      setTimeout(() => {
        clearInterval(poll);
        if (step === 'loading') setStep('idle');
      }, 180000);

    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
    }
  };

  const checkForCompletedAccount = async (poll) => {
    try {
      const accounts = await base44.entities.SocialAccount.list();
      const found = accounts.find(a => a.platform === account.platform);
      if (!found) return;

      if (found.status === 'ready') {
        clearInterval(poll);
        setStep('success');
        setTimeout(() => onSaved(), 1200);
        return;
      }

      if (found.status === 'connected_no_destination') {
        clearInterval(poll);
        setLiveAccount(found);
        const dests = safeParseDestinations(found.destinations_json);
        setDestinations(dests);
        setStep('destination_select');
        return;
      }

      if (found.status === 'error') {
        clearInterval(poll);
        setStep('error');
        setErrorMsg(found.error_message || 'Connection failed. No destinations found.');
        return;
      }
    } catch (_) {
      // ignore poll errors
    }
  };

  const safeParseDestinations = (json) => {
    try { return JSON.parse(json) || []; } catch { return []; }
  };

  // ── Sync destinations ────────────────────────────────────────────────────
  const handleSyncDestinations = async () => {
    if (!liveAccount?.id) return;
    setStep('syncing');
    try {
      const res = await base44.functions.invoke('socialOAuth', {
        action: 'sync_destinations',
        account_id: liveAccount.id,
      });
      const { destinations: newDests, status } = res.data;
      if (status === 'ready') {
        setStep('success');
        setTimeout(() => onSaved(), 1200);
      } else if (newDests?.length > 0) {
        setDestinations(newDests);
        setStep('destination_select');
      } else {
        setStep('error');
        setErrorMsg('No destinations found after sync. Check your account settings.');
      }
    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
    }
  };

  // ── Save selected destination ────────────────────────────────────────────
  const handleSelectDestination = async () => {
    if (!selectedDest || !liveAccount?.id) return;
    const dest = destinations.find(d => d.id === selectedDest);
    setSavingDest(true);
    try {
      await base44.functions.invoke('socialOAuth', {
        action: 'select_destination',
        account_id: liveAccount.id,
        destination_id: dest.id,
        destination_name: dest.name,
      });
      setStep('success');
      setTimeout(() => onSaved(), 1200);
    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
    } finally {
      setSavingDest(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{meta?.emoji}</span>
            Connect {meta?.name}
          </DialogTitle>
          <DialogDescription>{meta?.desc}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-3 py-6 text-green-600">
              <CheckCircle className="w-12 h-12" />
              <p className="font-semibold text-lg">{meta?.name} Ready!</p>
              <p className="text-sm text-slate-500">This channel is now ready for publishing.</p>
            </div>
          )}

          {/* ── Error ── */}
          {step === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Connection Failed</p>
                  <p className="text-sm text-red-700 mt-1">{errorMsg || 'Something went wrong.'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button className="flex-1" onClick={() => setStep('idle')}>Try Again</Button>
              </div>
            </div>
          )}

          {/* ── Destination selection ── */}
          {(step === 'destination_select' || step === 'syncing') && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Select a destination</strong> to complete the connection. Only the selected account will be used for publishing.
              </div>

              {destinations.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available {account.platform === 'facebook' ? 'Pages' : account.platform === 'instagram' ? 'Business Accounts' : account.platform === 'youtube' ? 'Channels' : 'Locations'}
                  </label>
                  <select
                    value={selectedDest}
                    onChange={e => setSelectedDest(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Select one —</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-3">No destinations loaded yet.</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleSyncDestinations}
                  disabled={step === 'syncing'}
                >
                  {step === 'syncing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Sync
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSelectDestination}
                  disabled={!selectedDest || savingDest}
                >
                  {savingDest ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Confirm Selection
                </Button>
              </div>
            </div>
          )}

          {/* ── Idle / Loading ── */}
          {(step === 'idle' || step === 'loading') && (
            <>
              <p className="text-sm text-slate-500 mb-6">
                {account.platform === 'linkedin'
                  ? "LinkedIn is connected via the app's built-in connector. Click below to activate."
                  : `A popup will open to authorize ${meta?.name}. After login, destinations (pages/channels) will be fetched automatically.`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={step === 'loading'}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2" onClick={handleConnect} disabled={step === 'loading'}>
                  {step === 'loading' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</>
                  ) : (
                    <><ExternalLink className="w-4 h-4" /> Connect {meta?.name}</>
                  )}
                </Button>
              </div>
              {step === 'loading' && (
                <p className="text-xs text-slate-400 text-center mt-3">
                  Waiting for authorization… Complete the popup, then we'll fetch your destinations.
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}