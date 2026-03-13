import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, X, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

// Wizard step definitions per platform
const WIZARD_STEPS = {
  facebook_instagram: [
    { id: 'login',     title: 'Log In to Facebook',       desc: 'Use your business Facebook account credentials.' },
    { id: 'page',      title: 'Select Your Facebook Page', desc: 'Choose the page that represents your business.' },
    { id: 'instagram', title: 'Pair Instagram Account',    desc: 'Connect your Instagram Business Profile linked to this page.' },
    { id: 'perms',     title: 'Grant Permissions',         desc: 'Allow NTA to publish content and read insights on your behalf.' },
    { id: 'success',   title: 'All Set!',                  desc: 'Facebook and Instagram are connected and ready to publish.' },
  ],
  google_business: [
    { id: 'login',    title: 'Sign In with Google',    desc: 'Use the Google account that manages your Business Profile.' },
    { id: 'location', title: 'Select Your Location',   desc: 'Choose the correct business location from your account.' },
    { id: 'perms',    title: 'Confirm Permissions',    desc: 'Allow insights access and post publishing for this location.' },
    { id: 'success',  title: 'Google Business Ready!', desc: 'Your profile is connected. Reviews and posts are now managed.' },
  ],
  youtube: [
    { id: 'login',   title: 'Connect YouTube Channel', desc: 'Sign in with the Google account that owns your channel.' },
    { id: 'channel', title: 'Select Channel',           desc: 'Confirm which channel will receive NTA video uploads.' },
    { id: 'perms',   title: 'Publishing Permission',    desc: 'Allow NTA to upload and schedule videos to your channel.' },
    { id: 'success', title: 'YouTube Connected!',       desc: 'Videos will now be published directly to your channel.' },
  ],
  tiktok: [
    { id: 'login',   title: 'Connect TikTok Account', desc: 'Use your TikTok Creator or Business account.' },
    { id: 'perms',   title: 'Grant Access',            desc: 'Allow video upload and profile read access.' },
    { id: 'success', title: 'TikTok Connected!',       desc: 'Short-form video content will now publish to TikTok.' },
  ],
};

const MOCK_PAGES = {
  facebook_instagram: [
    { id: 'page_1', name: 'ABC Plumbing & Heating', ig: 'abcplumbing_official', followers: '1.2k' },
    { id: 'page_2', name: 'ABC Plumbing Services', ig: null, followers: '340' },
  ],
  google_business: [
    { id: 'loc_1', name: 'ABC Plumbing - Main Location', address: '123 Main St, Denver CO' },
    { id: 'loc_2', name: 'ABC Plumbing - North Branch', address: '456 Oak Ave, Thornton CO' },
  ],
  youtube: [
    { id: 'ch_1', name: 'ABC Plumbing Official', subscribers: '842', handle: '@abcplumbing' },
  ],
};

export default function CHConnectionWizard({ platform, onClose, onSuccess }) {
  const steps = WIZARD_STEPS[platform] || [];
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const current = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const mockItems = MOCK_PAGES[platform] || [];

  const advance = async () => {
    setError(null);
    if (current.id === 'login' || current.id === 'perms') {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1400));
      setLoading(false);
    }
    if ((current.id === 'page' || current.id === 'location' || current.id === 'channel') && !selectedItem) {
      setError('Please select an option to continue.');
      return;
    }
    if (isLast) { onSuccess(selectedItem); return; }
    setStepIdx(i => i + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-white font-black text-lg">Connect {platform.replace('_', ' + ').replace('facebook instagram', 'Facebook + Instagram')}</h2>
            <p className="text-slate-500 text-xs mt-0.5">Step {stepIdx + 1} of {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="flex gap-1 px-6 pt-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 h-1 rounded-full transition-all duration-300" style={{
              background: i < stepIdx ? '#10b981' : i === stepIdx ? '#3b82f6' : '#1e293b'
            }} />
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          {isLast ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-600/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">{current.title}</h3>
              <p className="text-slate-400 text-sm mb-2">{current.desc}</p>
              {selectedItem && (
                <p className="text-green-400 text-sm font-semibold">
                  ✓ {selectedItem.name || selectedItem.handle}
                </p>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-white font-bold text-base mb-1">{current.title}</h3>
              <p className="text-slate-400 text-sm mb-5">{current.desc}</p>

              {/* Selection lists */}
              {(current.id === 'page' || current.id === 'location' || current.id === 'channel') && (
                <div className="space-y-2 mb-4">
                  {mockItems.map((item) => (
                    <button key={item.id} onClick={() => setSelectedItem(item)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        selectedItem?.id === item.id
                          ? 'border-blue-500 bg-blue-950/30'
                          : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                        selectedItem?.id === item.id ? 'border-blue-400' : 'border-slate-600'
                      }`}>
                        {selectedItem?.id === item.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        {item.address && <p className="text-slate-500 text-xs mt-0.5">{item.address}</p>}
                        {item.ig && <p className="text-slate-500 text-xs mt-0.5">Instagram: @{item.ig} · {item.followers} followers</p>}
                        {!item.ig && item.followers && <p className="text-slate-500 text-xs mt-0.5">{item.followers} followers · No Instagram paired</p>}
                        {item.subscribers && <p className="text-slate-500 text-xs mt-0.5">{item.subscribers} subscribers · {item.handle}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Login step mock */}
              {current.id === 'login' && (
                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl text-center mb-4">
                  <ExternalLink className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm">A secure OAuth window will open to authenticate your account. No passwords are stored.</p>
                </div>
              )}

              {/* Permission step */}
              {current.id === 'perms' && (
                <div className="space-y-2 mb-4">
                  {['Publish posts and stories', 'Read page/profile insights', 'Access audience analytics', 'Manage scheduled content'].map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> {perm}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-800/40 rounded-xl mb-4 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-between">
          <button onClick={() => stepIdx > 0 ? setStepIdx(i => i - 1) : onClose()}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
            {stepIdx === 0 ? 'Cancel' : 'Back'}
          </button>
          <button onClick={advance} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: isLast ? '#10b981' : '#3b82f6' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Authenticating...' : isLast ? 'Done' : 'Continue'}
            {!loading && !isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}