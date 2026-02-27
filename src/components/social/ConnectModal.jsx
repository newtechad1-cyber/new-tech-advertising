import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Loader2, CheckCircle } from 'lucide-react';

const platformMeta = {
  facebook:           { name: 'Facebook',           emoji: '📘', desc: 'Connect your Facebook Page to enable posting and analytics.' },
  instagram:          { name: 'Instagram',           emoji: '📷', desc: 'Connect your Instagram Business account.' },
  youtube:            { name: 'YouTube',             emoji: '▶️', desc: 'Connect your YouTube Channel to sync analytics.' },
  google_my_business: { name: 'Google My Business',  emoji: '🗺️', desc: 'Connect your Google Business Profile.' },
  tiktok:             { name: 'TikTok',              emoji: '🎵', desc: 'Connect your TikTok account.' },
  linkedin:           { name: 'LinkedIn',            emoji: '💼', desc: 'Connect your LinkedIn Company Page.' },
};

export default function ConnectModal({ account, open, onClose, onSaved }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setErrorMsg('');
    }
  }, [open, account?.platform]);

  if (!account) return null;
  const meta = platformMeta[account.platform];

  const handleConnect = async () => {
    setStatus('loading');
    setErrorMsg('');

    if (account.platform === 'linkedin') {
      // LinkedIn uses Base44 App Connector — just save the record directly
      // The connector is already authorized at the app level
      try {
        const data = {
          platform: 'linkedin',
          account_name: 'LinkedIn (App Connector)',
          platform_user_id: 'app_connector',
          status: 'connected',
          last_synced_at: new Date().toISOString(),
        };
        if (account.id) {
          await base44.entities.SocialAccount.update(account.id, data);
        } else {
          await base44.entities.SocialAccount.create(data);
        }
        setStatus('success');
        setTimeout(() => { onSaved(); }, 1200);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message);
      }
      return;
    }

    // All other platforms: open OAuth popup
    try {
      const res = await base44.functions.invoke('socialOAuth', { platform: account.platform });
      const { authUrl } = res.data;

      const popup = window.open(authUrl, 'oauth_popup', 'width=600,height=700,scrollbars=yes');

      const listener = (event) => {
        if (event.data?.type === 'oauth_success' && event.data.platform === account.platform) {
          window.removeEventListener('message', listener);
          setStatus('success');
          setTimeout(() => { onSaved(); }, 1200);
        } else if (event.data?.type === 'oauth_error' && event.data.platform === account.platform) {
          window.removeEventListener('message', listener);
          setStatus('error');
          setErrorMsg(event.data.error || 'Authorization failed');
        }
      };
      window.addEventListener('message', listener);

      // Fallback: if popup closed without message
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer);
          window.removeEventListener('message', listener);
          if (status === 'loading') setStatus('idle');
        }
      }, 1000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{meta.emoji}</span>
            Connect {meta.name}
          </DialogTitle>
          <DialogDescription>{meta.desc}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-6 text-green-600">
              <CheckCircle className="w-12 h-12" />
              <p className="font-semibold text-lg">{meta.name} Connected!</p>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {errorMsg || 'Something went wrong. Please try again.'}
                </div>
              )}

              <p className="text-sm text-slate-500 mb-6">
                {account.platform === 'linkedin'
                  ? 'LinkedIn is connected via Base44\'s built-in connector. Click below to mark it as connected.'
                  : `You'll be redirected to ${meta.name} to authorize access. A popup window will open.`}
              </p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={status === 'loading'}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2" onClick={handleConnect} disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                  ) : (
                    <><ExternalLink className="w-4 h-4" /> Connect {meta.name}</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}