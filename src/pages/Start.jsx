import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import StartHero from '@/components/start/StartHero';
import StartWhatHappensNext from '@/components/start/StartWhatHappensNext';
import StartForm from '@/components/start/StartForm';
import StartSuccess from '@/components/start/StartSuccess';

export default function Start() {
  const [submitted, setSubmitted] = useState(false);
  const [trialId, setTrialId] = useState(null);
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

  const handleSuccess = ({ trialId: id }) => {
    setTrialId(id);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-slate-800 py-4 px-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
              alt="New Tech Advertising"
              className="h-9 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">
              Prefer a call? →
            </a>
          </div>
        </div>
      </header>

      {submitted ? (
        <div className="flex-1 bg-slate-950">
          <StartSuccess trialId={trialId} />
        </div>
      ) : (
        <div className="flex-1">
          {/* Hero */}
          <StartHero onScrollToForm={scrollToForm} />

          {/* What happens next */}
          <StartWhatHappensNext />

          {/* Form section */}
          <section className="bg-slate-950 py-14" ref={formRef}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="grid lg:grid-cols-5 gap-10 items-start">
                {/* Left: form context */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Tell Us About Your Business
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    This short form is the first step in setting up your marketing system. We use this information to generate your starting plan — not to pitch you.
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: 'Weekly marketing plan', sub: 'Generated for your industry and goals' },
                      { label: 'Content & video ideas', sub: 'Ready to create from day one' },
                      { label: 'Campaign direction', sub: 'Based on your location and services' },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-white text-sm font-semibold">{item.label}</p>
                          <p className="text-slate-500 text-xs">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: form */}
                <div className="lg:col-span-3">
                  <StartForm sourceData={sourceData} onSuccess={handleSuccess} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}