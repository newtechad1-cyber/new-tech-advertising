import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: February 25, 2026</p>

      <div className="space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, business name, email address, phone number, website URL, and social media profiles when you sign up for our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our marketing services, communicate with you about your account, process payments, and deliver the AI-powered marketing solutions you've subscribed to.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with service providers who assist in delivering our services, such as hosting providers and payment processors.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p>We implement reasonable security measures to protect your information from unauthorized access, alteration, or destruction. However, no internet transmission is completely secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to improve your experience on our website, analyze traffic, and understand how visitors interact with our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Children's Privacy</h2>
          <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Third-Party Platform Integrations (TikTok, Meta, Google, LinkedIn)</h2>
          <p className="mb-3">Our platform allows users to connect their social media accounts — including TikTok, Facebook, Instagram, YouTube, Google My Business, and LinkedIn — to manage content, view analytics, and oversee advertising performance from a single dashboard.</p>
          <p className="mb-3"><strong>TikTok:</strong> When you connect your TikTok account, we access your basic account information (display name, profile image, account ID) to identify the linked account within our platform. We may also access your video list and performance data to display analytics, and publish video content on your behalf if you use our scheduling features. We request only the minimum permissions necessary. TikTok data is used solely to provide services back to you and is never sold or shared with third parties. You may disconnect your TikTok account at any time from your dashboard, which will revoke our access. For more information on how TikTok handles your data, see <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" className="text-blue-600 hover:underline">TikTok's Privacy Policy</a>.</p>
          <p className="mb-3"><strong>Meta (Facebook & Instagram):</strong> When you connect your Facebook or Instagram account, we access your pages and business account data to display analytics and post content on your behalf. Meta data is used solely to deliver our services to you.</p>
          <p className="mb-3"><strong>Google (YouTube & Google My Business):</strong> When you connect your Google account, we access your YouTube channel or Google Business Profile to display performance metrics and manage your presence. Google data is used solely to deliver our services to you.</p>
          <p><strong>LinkedIn:</strong> When you connect your LinkedIn account, we access your profile and organization data to publish content and view engagement metrics. LinkedIn data is used solely to deliver our services to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of significant changes by posting the new policy on our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
          <p>If you have questions about this privacy policy, please contact us at <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 hover:underline">rick@newtechadvertising.com</a> or call <a href="tel:641-420-8816" className="text-blue-600 hover:underline">641-420-8816</a>.</p>
        </section>
      </div>
    </div>
  );
}