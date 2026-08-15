import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function NewsletterFooterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [consent, setConsent] = useState(false);
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
    setErrorMessage('');

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    if (!consent) {
      setErrorMessage('Please confirm that you want to receive The NTA Journal and related updates.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const registration = await base44.functions.invoke('publicationSignup', {
        name: '',
        email: email.trim().toLowerCase(),
        business_name: '',
        source: 'website_newsletter_footer',
        source_page: window.location.pathname,
        source_url: window.location.href,
        publication_title: 'The NTA Journal',
        publication_tag: 'nta-journal',
        consent_context: 'Subscribed to The NTA Journal from the website footer.',
        tags: ['nta-newsletter', 'website-footer'],
        create_delivery_request: false,
        delivery_url: '',
        anti_spam: { honeypot: _hp, form_started_at: pageLoadTs },
      });

      if (registration?.data?.success === false) {
        throw new Error(registration.data.error || 'We could not save your subscription.');
      }

      setStatus('success');
      localStorage.setItem('nta_newsletter_subscribed', 'true');
    } catch (error) {
      setErrorMessage(error?.message || 'Something went wrong — please try again.');
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
              ✅ You're subscribed! The NTA Journal arrives by email on Mondays.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
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
              </div>
              <label className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-3.5 w-3.5 rounded border-slate-600"
                />
                <span>
                  I want to receive The NTA Journal and related NTA publication updates by email. We never sell your information, and you can unsubscribe at any time.
                </span>
              </label>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-2 text-center text-sm text-red-500 md:text-left">
              {errorMessage || 'Something went wrong — please try again.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}