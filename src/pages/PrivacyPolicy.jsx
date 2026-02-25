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
          <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
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