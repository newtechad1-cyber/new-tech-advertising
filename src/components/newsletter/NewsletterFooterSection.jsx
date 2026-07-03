import React, { useState, useEffect } from 'react';

export default function NewsletterFooterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  // Anti-spam: honeypot + page-load timestamp
  const [_hp, setHp] = useState('');
  const [pageLoadTs] = useState(() => Date.now());

  useEffect(() => {
    if (localStorage.getItem('nta_newsletter_subscribed')) {
      setStatus('success');
    }
  }, []);

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
        body: JSON.stringify({ name: '', email, source: 'Website Newsletter Footer', _hp, _ts: pageLoadTs })
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

  return (
    <div className="w-full bg-[#0B1120] py-16 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h3 className="mb-2 text-2xl font-bold text-white">Stay Ahead of the Curve</h3>
          <p className="text-slate-300">
            One email a week. AI tips, marketing wins, and growth strategies for local businesses.
          </p>
        </div>
        
        <div className="w-full md:w-auto md:min-w-[400px]">
          {status === 'success' ? (
            <div className="flex h-12 items-center justify-center md:justify-start gap-2 text-[#10B981] font-semibold text-lg">
              ✅ You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              {/* Anti-spam honeypot — hidden from real users */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="ft_company_url">Company URL</label>
                <input id="ft_company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
                className="h-12 w-full flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-white placeholder:text-slate-500 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#10B981] px-6 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-70 sm:w-auto min-w-[140px]"
              >
                {status === 'loading' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-2 text-center text-sm text-red-500 md:text-left">
              Something went wrong — please try again
            </p>
          )}
        </div>
      </div>
    </div>
  );
}