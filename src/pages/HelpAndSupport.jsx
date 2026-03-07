import React, { useState } from 'react';
import { ChevronDown, Zap, BarChart3, Globe, Clock, Shield, BookOpen, Lightbulb } from 'lucide-react';

export default function HelpAndSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is programmatic SEO and how does it work?',
      answer: 'Programmatic SEO is an automated system that generates hundreds of high-quality, location and service-specific landing pages using structured data from our industry and market intelligence. Instead of manually writing each page, we use templates populated with unique local market data, industry insights, and FAQs to create pages that rank for local search queries while maintaining content quality at scale.'
    },
    {
      question: 'Why generate pages gradually instead of all at once?',
      answer: 'Google\'s algorithms monitor for "thin content" and bulk page creation. By generating 5-10 pages daily, we signal organic, sustainable growth to Google. This gradual rollout prevents spam signals and allows us to monitor performance and adjust quality in real-time. The system generates all 500 pages over approximately 100 days.'
    },
    {
      question: 'How is each page unique if they\'re generated automatically?',
      answer: 'Each page combines unique inputs: city-specific market data from LocalMarketIntel (competition, demographics, local intents), industry-specific problems from IndustryIntel, localized FAQs, and related service/tool links. The template ensures consistent structure while the data sources create distinct, relevant content for each city-service combination.'
    },
    {
      question: 'What\'s the expected organic traffic impact?',
      answer: 'With 500 pages targeting local intent keywords, conservative estimates show 25,000–100,000+ monthly organic visits within 6–12 months, depending on site authority, backlink profile, and search volume for targeted keywords. Initial traffic builds slowly, accelerates after 50+ pages rank, then compounds as the full 500-page network creates internal linking authority.'
    },
    {
      question: 'Can I monitor progress and see what\'s being generated?',
      answer: 'Yes. The Programmatic SEO Dashboard shows real-time generation status, success/failure rates per city, total pages live, estimated traffic projections, and generation timeline. You can drill into each city to see which services are queued or completed.'
    },
    {
      question: 'What do my clients see?',
      answer: 'Clients see professionally designed location pages (e.g., /services/ada-compliance/chicago) with their local market information, problem-solution messaging, FAQs, video embeds, and clear CTAs. The pages are SEO-optimized, mobile-friendly, and drive qualified leads back to service pages or contact forms.'
    },
    {
      question: 'How do I initialize the system?',
      answer: 'Run the initializeProgrammaticSEOQueue function from the admin backend. This populates the PageGenerationQueue with all 500 page combinations (100 cities × 5 services) in tiered priority. After that, the daily automation handles generation automatically.'
    },
    {
      question: 'What if a page fails to generate?',
      answer: 'The system tracks failures in the dashboard with error messages. Common issues include missing IndustryIntel/LocalMarketIntel data or API timeouts. You can retry individual pages, check data completeness, or contact support. The daily automation skips failed pages and tries them again the next cycle.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-slate-300">Learn how to use the Programmatic SEO engine and maximize your local search presence</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-8 h-8 text-emerald-600" />
            System Overview
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-emerald-600">
            <p className="text-slate-700 leading-relaxed mb-4">
              The Programmatic SEO engine automatically generates and publishes hundreds of high-quality location and service-specific landing pages across your website. Instead of manually creating each page, the system uses structured industry and market data to generate unique, relevant pages that rank organically while maintaining strict quality standards.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong>Scale:</strong> 500 pages across 100 cities and 5 services | <strong>Timeline:</strong> ~100 days (5–10 pages/day) | <strong>Content Depth:</strong> 900–1,400 words per page
            </p>
          </div>
        </section>

        {/* For Clients Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-600" />
            For Your Clients
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Expanded Local Presence</h3>
              <p className="text-slate-700">Clients get dedicated pages for their service in every major city they operate in—without the manual work of creating and maintaining them.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Targeted Lead Generation</h3>
              <p className="text-slate-700">Each page targets local search intent with city-specific problems, market context, and calls-to-action. Higher conversion rates from intent-matched traffic.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Consistent Brand Messaging</h3>
              <p className="text-slate-700">All pages follow a proven structure with consistent branding, tone, and CTA strategy—but customized for each local market.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Organic Traffic Growth</h3>
              <p className="text-slate-700">Conservative estimates: 25,000–100,000+ monthly organic visits within 6–12 months. Pages continue earning traffic years after publication.</p>
            </div>
          </div>
        </section>

        {/* For Your Business Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            For Your Business (Admin)
          </h2>

          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">How It Works</h3>
              <ol className="space-y-4 text-slate-700">
                <li className="flex gap-4">
                  <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                  <span><strong>Initialize Queue:</strong> Run initializeProgrammaticSEOQueue to populate PageGenerationQueue with all 500 page combinations (tiered by priority).</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                  <span><strong>Daily Generation:</strong> dailyProgrammaticPageGenerator automation runs daily (3 AM UTC). Processes 5–10 pages per run, generating unique content from IndustryIntel + LocalMarketIntel.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                  <span><strong>Content Validation:</strong> Each generated page is validated for minimum word count (900 words), unique sections, and quality metrics before publishing.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                  <span><strong>Live Publication:</strong> Pages are published automatically and indexed by Google. Dashboard updates in real-time with generation status.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-purple-600 flex-shrink-0">5.</span>
                  <span><strong>Monitor & Iterate:</strong> Use the dashboard to track progress, spot issues early, and refine content strategy based on performance signals.</span>
                </li>
              </ol>
            </div>

            {/* Data Inputs */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Data Inputs That Drive Uniqueness</h3>
              <div className="space-y-3 text-slate-700">
                <p><strong>IndustryIntel:</strong> Industry-specific problems, pain points, common objections, recommended content angles, and service patterns. Makes each service page unique.</p>
                <p><strong>LocalMarketIntel:</strong> City-level market data: competition scores, digital maturity, top intents, seasonal patterns, and recommended local topics. Makes each location page unique.</p>
                <p><strong>CTAOffer:</strong> Call-to-action messaging and destination links (e.g., /start, /demo, /free-audit). Drives conversion from traffic to leads.</p>
                <p><strong>Service Metadata:</strong> Service name, slug, description, and related pages/tools. Creates internal linking and content relationships.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Using the Dashboard
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-indigo-600">
            <p className="text-slate-700 mb-6">The Programmatic SEO Dashboard is your command center for monitoring and managing the 500-page rollout.</p>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">📊 Progress Tracker</h4>
                <p className="text-slate-700">View total pages generated, pages live, pages in progress, and pages queued. See the 100-day timeline with estimated completion date.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">🎯 Generation Status by City</h4>
                <p className="text-slate-700">See which cities are queued, in-progress, completed, or failed. Drill down to see individual service generation status and any error messages.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">📈 Performance Insights</h4>
                <p className="text-slate-700">View success/failure rates, average generation time, and estimated organic traffic projections based on current page count.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">🔄 Tier Breakdown</h4>
                <p className="text-slate-700">Pages are prioritized in 3 tiers: Tier 1 (largest cities), Tier 2 (mid-size), Tier 3 (smaller markets). Monitor progress across each tier.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">⚠️ Error Handling</h4>
                <p className="text-slate-700">If generation fails, click into the error to see the reason. Retry individual pages or check data completeness in related entities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Everything */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-amber-600" />
            How to Use Everything
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 1: Prepare Your Data</h3>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Ensure IndustryIntel records exist for all services (ada-compliance, streaming-tv, hvac, plumbing, etc.)</li>
                <li>✓ Ensure LocalMarketIntel records exist for all 100 target cities across all services</li>
                <li>✓ Define or update CTAOffer records (e.g., "Free Audit," "Book Demo," "Start Trial")</li>
                <li>✓ Verify service metadata (slugs, names, descriptions) are complete</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 2: Initialize the Queue</h3>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Go to Admin Dashboard → Functions</li>
                <li>✓ Call <code className="bg-slate-100 px-2 py-1 rounded">initializeProgrammaticSEOQueue</code> function</li>
                <li>✓ This populates PageGenerationQueue with all 500 page combinations in tiered order</li>
                <li>✓ Verify in the dashboard that the queue shows all 500 entries</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 3: Enable Daily Automation</h3>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Verify the <code className="bg-slate-100 px-2 py-1 rounded">dailyProgrammaticPageGenerator</code> automation is enabled (runs 3 AM UTC daily)</li>
                <li>✓ The automation processes 5–10 pages per run automatically</li>
                <li>✓ Check the dashboard each morning to see generation progress</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Step 4: Monitor & Optimize</h3>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Check dashboard 2–3 times per week for progress and any failures</li>
                <li>✓ If failures occur, investigate error messages and fix missing data</li>
                <li>✓ Track organic traffic growth metrics and adjust CTA messaging if needed</li>
                <li>✓ After pages begin ranking (week 3–4), monitor search console for top keywords</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-rose-600" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-left">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform flex-shrink-0 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-slate-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-600" />
            Pro Tips
          </h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-8 border-l-4 border-green-600">
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Start small:</strong> Generate pages for your top 3–5 target cities first, validate quality, then scale to full 100-city rollout.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Quality over speed:</strong> The 5–10 page/day pace ensures each page is high-quality and helps Google recognize organic growth, not spam.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Update market intel regularly:</strong> LocalMarketIntel and IndustryIntel are your content sources. Keep them fresh for better page generation.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Track performance:</strong> Once pages rank (week 3–4+), monitor search console and analytics for top keywords and conversion paths.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Iterate CTAs:</strong> A/B test different CTA offers on pages to find which drives the most qualified leads.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Support CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg text-indigo-100 mb-6">
            For technical issues or detailed setup assistance, check your admin documentation or contact the support team.
          </p>
          <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
}