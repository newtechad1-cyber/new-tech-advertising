import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
      <p className="text-slate-500 mb-8">Last updated: February 25, 2026</p>

      <div className="space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Services</h2>
          <p>New Tech Advertising provides AI-powered marketing services including website design, local SEO optimization, content creation, and video production for a monthly subscription fee.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Payment Terms</h2>
          <p>Services are billed monthly at $297/month. Payment is due at the beginning of each billing cycle. We accept major credit cards and electronic payments.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Cancellation Policy</h2>
          <p>There are no long-term contracts. You may cancel your subscription at any time with no penalties or fees. Cancellation will take effect at the end of your current billing period.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Refund Policy</h2>
          <p>We do not offer money-back guarantees. Like you, we need to be compensated for our work. However, if you're not satisfied with our services, you may cancel at any time with no penalty.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Service Delivery</h2>
          <p>We aim to complete initial setup within 48 hours of onboarding. Ongoing services including content creation and SEO optimization are provided continuously throughout your subscription.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
          <p>All content, websites, and materials created for your business remain your property. We retain rights to our proprietary tools, processes, and AI systems.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>While we strive for excellent results, marketing outcomes can vary. New Tech Advertising is not liable for business results, revenue changes, or market conditions beyond our control.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 hover:underline">rick@newtechadvertising.com</a> or call <a href="tel:641-420-8816" className="text-blue-600 hover:underline">641-420-8816</a>.</p>
        </section>
      </div>
    </div>
  );
}