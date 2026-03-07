import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight, CheckCircle, HelpCircle, TrendingUp } from 'lucide-react';

/**
 * LocalPageTemplate - Reusable SEO page template for city/service/industry pages
 * 
 * Data Sources:
 * - page: LocationPage entity (title, slug, content, CTAs, etc)
 * - industryIntel: IndustryIntel entity (problems, solutions, content angles)
 * - marketIntel: LocalMarketIntel entity (market context, local insights)
 * - cta: CTAOffer entity (headline, button text, destination)
 * - relatedPages: array of related Page objects
 * - relatedTools: array of Tool objects
 */
export default function LocalPageTemplate({
  page,
  industryIntel,
  marketIntel,
  cta,
  relatedPages = [],
  relatedTools = [],
}) {
  if (!page) return null;

  const faq = page.faq ? (typeof page.faq === 'string' ? JSON.parse(page.faq) : page.faq) : [];
  const keywords = page.keywords || [];

  // Extract state from canonical path or use page.state
  const stateDisplay = page.state || 'the area';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* SEO Meta Tags (rendered by parent) */}
      <meta name="description" content={page.meta_description} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.meta_description} />

      {/* Hero Section */}
      <section className="py-20 px-6 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-slate-400 text-sm">
            <Link to={createPageUrl('Home')} className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{page.city}</span>
          </div>

          {/* Hero Content */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            {page.h1}
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
            {page.intro_paragraph}
          </p>

          {/* CTA Buttons */}
          {(page.cta_primary || cta) && (
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={page.cta_primary_url || cta?.destination_url}
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                {page.cta_primary || cta?.button_text}
                <ChevronRight className="w-4 h-4" />
              </a>
              {page.cta_secondary && (
                <a
                  href={page.cta_secondary_url}
                  className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  {page.cta_secondary}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section 1: Service Overview */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">What Is {page.service_slug?.split('-').join(' ').toUpperCase()}?</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            {page.service_overview}
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            {page.why_this_service_matters}
          </p>
        </div>
      </section>

      {/* Section 2: Why This Matters in [City] */}
      <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why This Matters for {page.city} Businesses
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            {page.local_market_context}
          </p>

          {/* Market Insights from LocalMarketIntel */}
          {marketIntel && (
            <div className="grid sm:grid-cols-2 gap-6">
              {marketIntel.competition_level && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-slate-400 text-sm mb-2">Market Competitiveness</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-violet-500 h-full"
                        style={{ width: `${marketIntel.competition_level}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">
                      {Math.round(marketIntel.competition_level)}%
                    </span>
                  </div>
                </div>
              )}
              {marketIntel.digital_maturity_estimate && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <p className="text-slate-400 text-sm mb-2">Digital Adoption Rate</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${marketIntel.digital_maturity_estimate}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">
                      {Math.round(marketIntel.digital_maturity_estimate)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Local Examples */}
          {page.local_examples && page.local_examples.length > 0 && (
            <div className="mt-8">
              <p className="text-slate-300 font-semibold mb-4">Industries That Benefit Most:</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {page.local_examples.map((example, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Common Problems */}
      {industryIntel && (
        <section className="py-16 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Common Challenges for {page.city} Businesses
            </h2>

            {industryIntel.common_pain_points && (
              <div className="space-y-4 mb-8">
                {industryIntel.common_pain_points.slice(0, 4).map((problem, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
                    <AlertIcon className="w-6 h-6 text-rose-400 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">{problem}</p>
                  </div>
                ))}
              </div>
            )}

            {industryIntel.common_buying_triggers && (
              <div>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  When {page.city} businesses face these challenges, they typically look for solutions that address these specific needs:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {industryIntel.common_buying_triggers.slice(0, 6).map((trigger, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{trigger}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 4: How We Help */}
      <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">How We Help {page.city} Businesses</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            {page.how_it_works}
          </p>

          {/* Process Steps */}
          <div className="space-y-4">
            {['Assess your current situation', 'Develop a tailored solution', 'Implement with your team', 'Track results and optimize'].map(
              (step, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-800 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-full flex-shrink-0">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-slate-300 pt-1">{step}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Video */}
      {page.video_embed_url && (
        <section className="py-16 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">{page.video_title || 'See It In Action'}</h2>
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
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

      {/* Section 6: FAQ */}
      {faq.length > 0 && (
        <section className="py-16 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              Common Questions from {page.city} Businesses
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details
                  key={i}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-6 cursor-pointer group"
                >
                  <summary className="text-white font-semibold flex items-center justify-between hover:text-violet-400 transition-colors">
                    <span>{item.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      ⊕
                    </span>
                  </summary>
                  <p className="text-slate-300 mt-4 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 7: Related Resources */}
      <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Related Resources for {page.city}</h2>

          {relatedTools.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4">Free Tools</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedTools.slice(0, 4).map((tool) => (
                  <a
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-violet-500 transition-colors group"
                  >
                    <p className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                      {tool.name}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">{tool.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {relatedPages.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPages.slice(0, 4).map((relPage) => (
                  <a
                    key={relPage.id}
                    href={relPage.full_url}
                    className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors group"
                  >
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {relPage.title}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">{relPage.hero_subheading}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started in {page.city}?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's help your {page.city} business succeed. Schedule a free consultation to explore your options.
          </p>
          <a
            href={page.cta_primary_url || cta?.destination_url}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            {page.cta_primary || cta?.button_text || 'Get Started'}
            <ChevronRight className="w-5 h-5" />
          </a>
          <p className="text-slate-400 text-sm mt-6">
            No credit card required. Start free.
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper icon component
function AlertIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}