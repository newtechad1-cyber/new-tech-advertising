import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function ServiceLocation() {
  const { service, location } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);

        // Convert URL slug to city name
        const cityName = location
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Fetch location page
        const pages = await base44.entities.LocationPage.filter({
          service_slug: service,
          city: cityName,
        });

        if (pages.length === 0) {
          setError(`Page not found: ${service} in ${cityName}`);
          return;
        }

        setPage(pages[0]);
      } catch (err) {
        console.error('[ServiceLocation] Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [service, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <MarketingNav />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-slate-300 mb-6">{error || 'The page you are looking for does not exist.'}</p>
            <Link to={createPageUrl('Home')} className="text-violet-400 hover:text-violet-300 font-semibold">
              Return to Home
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const faq = page.faq ? JSON.parse(page.faq) : [];
  const keywords = page.keywords || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketingNav />

      {/* Hero */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-slate-400 text-sm">
            <Link to={createPageUrl('Home')} className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{page.service_slug}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{page.city}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{page.h1}</h1>
          <p className="text-xl text-slate-300 mb-8">{page.intro_paragraph}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={page.cta_primary_url}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {page.cta_primary}
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href={page.cta_secondary_url}
              className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {page.cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">What is {page.service_slug}?</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">{page.service_overview}</p>
          <p className="text-slate-300 text-lg leading-relaxed">{page.why_this_service_matters}</p>
        </div>
      </section>

      {/* Local Market Context */}
      <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Why It Matters in {page.city}</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">{page.local_market_context}</p>
          {page.local_examples && page.local_examples.length > 0 && (
            <div>
              <p className="text-slate-300 font-semibold mb-4">Industries that benefit:</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {page.local_examples.map((example, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-slate-300 text-lg leading-relaxed">{page.how_it_works}</p>
        </div>
      </section>

      {/* Video */}
      {page.video_embed_url && (
        <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{page.video_title}</h2>
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={page.video_embed_url}
                title={page.video_title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-16 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-6 cursor-pointer">
                  <summary className="text-white font-semibold flex items-center justify-between">
                    {item.question}
                    <span className="text-slate-400">+</span>
                  </summary>
                  <p className="text-slate-300 mt-4 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Study */}
      {page.case_study_section && (
        <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Success Story</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
              <p className="text-slate-300 leading-relaxed">{page.case_study_section}</p>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Let's help {page.city} businesses succeed with {page.service_slug}.
          </p>
          <a
            href={page.cta_primary_url}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            {page.cta_primary}
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}