import React, { useState, useEffect } from 'react';

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  // Anti-spam: honeypot + page-load timestamp
  const [_hp, setHp] = useState('');
  const [pageLoadTs] = useState(() => Date.now());

  useEffect(() => {
    const isSubscribed = localStorage.getItem('nta_newsletter_subscribed');
    const dismissedAt = localStorage.getItem('nta_newsletter_dismissed');

    if (isSubscribed) return;

    if (dismissedAt) {
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedAt) < threeDays) return;
    }

    let timeoutId;
    const handleMouseLeave = (e) => {
      // Show on exit intent (mouse leaving viewport top)
      if (e.clientY <= 0) {
        setShow(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(timeoutId);
      }
    };

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      timeoutId = setTimeout(() => {
        setShow(true);
      }, 20000);
    } else {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClose = () => {
    localStorage.setItem('nta_newsletter_dismissed', Date.now().toString());
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('https://grateful-lynx-44.convex.site/api/webhook/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'Website Newsletter Popup', _hp, _ts: pageLoadTs })
      });

      if (response.ok) {
        setStatus('success');
        localStorage.setItem('nta_newsletter_subscribed', 'true');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-[440px] animate-in fade-in zoom-in-95 rounded-xl bg-white p-8 shadow-2xl duration-300">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-[#0B1120] mb-2">Get Smarter Growth Tips Every Monday</h2>
          <p className="text-sm text-slate-600">
            Join local business owners getting one short, actionable AI &amp; marketing tip every week. Free forever.
          </p>
        </div>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-[#10B981] font-medium py-6 bg-emerald-50 rounded-lg">
            <span>🎉</span> You're in! Check your inbox Monday.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Anti-spam honeypot — hidden from real users */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
              <label htmlFor="nl_company_url">Company URL</label>
              <input id="nl_company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
            </div>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">Something went wrong — please try again</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-70 flex justify-center items-center h-12"
            >
              {status === 'loading' ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Subscribe — It's Free →"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              No spam. Unsubscribe in one click.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}