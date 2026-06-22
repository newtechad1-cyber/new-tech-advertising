import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNav />
      <div className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: February 27, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the services provided by NewTech Advertising ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Services</h2>
            <p>NewTech Advertising provides AI-powered marketing services including website design, local SEO optimization, content creation, social media management, video production, and advertising management across platforms such as TikTok, Facebook, Instagram, YouTube, Google My Business, and LinkedIn.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Payment Terms</h2>
            <p>Services are billed monthly. Payment is due at the beginning of each billing cycle. We accept major credit cards and electronic payments. All fees are non-refundable except as expressly set forth in these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cancellation Policy</h2>
            <p>There are no long-term contracts. You may cancel your subscription at any time with no penalties or fees. Cancellation will take effect at the end of your current billing period.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Refund Policy</h2>
            <p>We do not offer money-back guarantees. If you are not satisfied with our services, you may cancel at any time with no penalty. No refunds will be issued for partial months of service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. User Accounts</h2>
            <p>To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and are responsible for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Post or transmit any content that is infringing, defamatory, obscene, or otherwise violates any law or right of any third party.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service.</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems or networks.</li>
              <li>Use the Service to send unsolicited commercial messages (spam).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Social Media Integrations (TikTok, Meta, Google, LinkedIn)</h2>
            <p className="mb-3">The Service allows you to connect and manage your social media accounts, including TikTok, Facebook, Instagram, YouTube, Google My Business, and LinkedIn. By connecting these accounts, you grant NewTech Advertising permission to access, manage, and publish content on your behalf in accordance with your instructions.</p>
            <p className="mb-3"><strong>TikTok:</strong> By connecting your TikTok account, you authorize us to access your account information, post content, and retrieve analytics data on your behalf using TikTok's official API. We comply with <a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" className="text-blue-600 hover:underline">TikTok's Terms of Service</a> and <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" className="text-blue-600 hover:underline">TikTok's Privacy Policy</a>. You may revoke our access at any time from your TikTok account settings or from your dashboard.</p>
            <p className="mb-3"><strong>Meta (Facebook & Instagram):</strong> By connecting your Meta accounts, you authorize us to manage your Pages, post content, and access analytics in compliance with <a href="https://www.facebook.com/terms.php" target="_blank" className="text-blue-600 hover:underline">Meta's Terms of Service</a>.</p>
            <p className="mb-3"><strong>Google (YouTube & Google My Business):</strong> By connecting your Google account, you authorize us to manage your YouTube channel or Google Business Profile in compliance with <a href="https://policies.google.com/terms" target="_blank" className="text-blue-600 hover:underline">Google's Terms of Service</a>.</p>
            <p><strong>LinkedIn:</strong> By connecting your LinkedIn account, you authorize us to publish content and access engagement metrics in compliance with <a href="https://www.linkedin.com/legal/user-agreement" target="_blank" className="text-blue-600 hover:underline">LinkedIn's User Agreement</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Intellectual Property</h2>
            <p>All content, websites, and materials created specifically for your business remain your property. NewTech Advertising retains rights to its proprietary tools, processes, AI systems, and platform technology.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Service Delivery</h2>
            <p>We aim to complete initial setup within 48 hours of onboarding. Ongoing services including content creation and SEO optimization are provided continuously throughout your subscription.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Disclaimers</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. NewTech Advertising makes no warranties, expressed or implied, regarding the operation or availability of the Service, or the accuracy, completeness, or reliability of any information obtained through the Service. Marketing outcomes can vary based on market conditions beyond our control.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Limitation of Liability</h2>
            <p>In no event shall NewTech Advertising be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your use of or inability to use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of Iowa, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide at least 30 days' notice prior to any material changes taking effect. By continuing to use the Service after revisions become effective, you agree to be bound by the revised terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">15. Contact Us</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 hover:underline">rick@newtechadvertising.com</a> or call <a href="tel:641-420-8816" className="text-blue-600 hover:underline">641-420-8816</a>.</p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}