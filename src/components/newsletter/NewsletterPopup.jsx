import { useState, useEffect, useId, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { invokeVerifiedPublicFunction } from '@/lib/publicVerification';

function getFunctionError(error, fallback) {
  return error?.response?.data?.error || error?.data?.error || error?.message || fallback;
}

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const newsletterId = useId();
  const previousFocusRef = useRef(null);
  const nameId = `${newsletterId}-name`;
  const emailId = `${newsletterId}-email`;
  const honeypotId = `${newsletterId}-company-url`;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [consent, setConsent] = useState(false);
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

    const openPopup = () => {
      previousFocusRef.current = document.activeElement;
      setShow(true);
    };
    let timeoutId;
    const handleMouseLeave = (e) => {
      // Show on exit intent (mouse leaving viewport top)
      if (e.clientY <= 0) {
        openPopup();
        document.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(timeoutId);
      }
    };

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      timeoutId = setTimeout(() => {
        openPopup();
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
      const registration = await invokeVerifiedPublicFunction('publicationSignup', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        business_name: '',
        source: 'website_newsletter_popup',
        source_page: window.location.pathname,
        source_url: window.location.href,
        publication_title: 'The NTA Journal',
        publication_tag: 'nta-journal',
        consent,
        consent_context: 'Subscribed to The NTA Journal from the website popup.',
        tags: ['nta-newsletter', 'website-popup'],
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
      setErrorMessage(getFunctionError(error, 'Something went wrong — please try again.'));
      setStatus('error');
    }
  };

  if (!show) return null;

  return (
    <DialogPrimitive.Root open={show} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[120] bg-black/50 transition-opacity duration-300" />
      <DialogPrimitive.Content
        onCloseAutoFocus={event => {
          event.preventDefault();
          if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus({ preventScroll: true });
        }}
        className="fixed left-1/2 top-1/2 z-[121] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl focus:outline-none"
      >
        <DialogPrimitive.Close asChild>
        <button
          type="button"
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close newsletter signup"
        >
          ✕
        </button>
        </DialogPrimitive.Close>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📬</div>
          <DialogPrimitive.Title className="text-2xl font-bold text-[#0B1120] mb-2">Get Smarter Growth Tips Every Tuesday Morning</DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-slate-600">
            Join local business owners getting one short, actionable AI &amp; marketing tip every week. Free forever.
          </DialogPrimitive.Description>
        </div>

        {status === 'success' ? (
          <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 text-[#10B981] font-medium py-6 bg-emerald-50 rounded-lg">
            <span>🎉</span> You're in! The NTA Journal arrives by email every Tuesday morning.
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-busy={status === 'loading'} className="space-y-4">
            {/* Anti-spam honeypot — hidden from real users */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
              <label htmlFor={honeypotId}>Company URL</label>
              <input id={honeypotId} name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
            </div>
            <div>
              <label htmlFor={nameId} className="mb-1 block text-sm font-medium text-slate-700">First name</label>
              <input
                id={nameId}
                name="given_name"
                autoComplete="given-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>
            <div>
              <label htmlFor={emailId} className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
              <input
                id={emailId}
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
              />
            </div>
            <label className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-3.5 w-3.5 rounded border-slate-300"
              />
              <span>
                I want to receive The NTA Journal and related NTA publication updates by email. We never sell your information, and you can unsubscribe at any time.
              </span>
            </label>
            {status === 'error' && (
              <p role="alert" className="text-red-500 text-sm text-center">{errorMessage || 'Something went wrong — please try again.'}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-70 flex justify-center items-center h-12"
            >
              {status === 'loading' ? (
                <>
                  <div aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="sr-only">Subscribing…</span>
                </>
              ) : (
                "Subscribe — It's Free →"
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              No spam. Unsubscribe in one click.
            </p>
          </form>
        )}
      </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}