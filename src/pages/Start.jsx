import { useState, useRef } from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import StartHero from '@/components/start/StartHero';
import StartWhatHappensNext from '@/components/start/StartWhatHappensNext';
import StartForm from '@/components/start/StartForm';
import StartSuccess from '@/components/start/StartSuccess';
import SEOHead from '@/components/shared/SEOHead';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const EMAIL = 'info@newtechadvertising.com';
const SMS_BODY = encodeURIComponent('Hey Rick, I started a free growth conversation and wanted to continue.');

function openGrowthGuide() {
  window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
    detail: { source: 'start_contact_options' },
  }));
}

export default function Start() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const formRef = useRef(null);

  // Read optional source attribution from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sourceData = {
    source_page: urlParams.get('source') || 'start',
    source_tool: urlParams.get('tool') || '',
    source_campaign: urlParams.get('campaign') || '',
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSuccess = ({ name }) => {
    setSubmittedName(name || '');
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <SEOHead
        title="Start a Free Growth Conversation | New Tech Advertising"
        description="You don't have to know what service you need before talking with NTA. Start with what's on your mind. The conversation is free—and the purpose is understanding your business better."
      />
      <MarketingNav />

      {submitted ? (
        <div className="flex-1 bg-slate-950">
          <StartSuccess name={submittedName} />
        </div>
      ) : (
        <div className="flex-1">
          {/* Hero */}
          <StartHero onScrollToForm={scrollToForm} />

          {/* What the conversation can include + understanding the business */}
          <StartWhatHappensNext />

          {/* Contact / conversation options */}
          <section className="bg-slate-950 py-14 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Begin However Feels Natural.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                You don't have to fill out anything to talk with NTA. Reach out however you prefer, or share a few details below and Rick will reach out to start the conversation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openGrowthGuide}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Talk to My Office™
                </button>
                <a
                  href={`tel:+1${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
                >
                  Call {PHONE_DISPLAY}
                </a>
                <a
                  href={`sms:+1${PHONE}?body=${SMS_BODY}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
                >
                  Text Rick
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
                >
                  Email Rick
                </a>
              </div>
            </div>
          </section>

          {/* Simplified conversation form */}
          <section className="bg-slate-950 pb-16 pt-2 px-4 sm:px-6" ref={formRef}>
            <div className="max-w-3xl mx-auto">
              <StartForm sourceData={sourceData} onSuccess={handleSuccess} />
            </div>
          </section>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}