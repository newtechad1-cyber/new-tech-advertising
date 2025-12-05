import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-1">
              <h3 className="font-bold text-xl mb-4">New Tech Advertising</h3>
              <p className="text-slate-400 text-sm">
                AI-powered marketing solutions for local businesses
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to={createPageUrl('AiWebsites')} className="hover:text-blue-400 transition-colors">AI Websites</Link></li>
                <li><Link to={createPageUrl('AiVideos')} className="hover:text-blue-400 transition-colors">AI Videos</Link></li>
                <li><Link to={createPageUrl('AiSeo')} className="hover:text-blue-400 transition-colors">AI SEO</Link></li>
                <li><Link to={createPageUrl('AiAdvertising')} className="hover:text-blue-400 transition-colors">AI Advertising</Link></li>
                <li><Link to={createPageUrl('AiSocialMedia')} className="hover:text-blue-400 transition-colors">AI Social Media</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to={createPageUrl('About')} className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl('Home')} className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to={createPageUrl('Blog')} className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link to={createPageUrl('Dashboard')} className="hover:text-blue-400 transition-colors">Client Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="tel:641-420-8816" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  641-420-8816
                </a>
                <a href="mailto:rick@newtechadvertising.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  rick@newtechadvertising.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-slate-400 hover:text-blue-400 transition-colors block"
                >
                  Terms and Conditions
                </button>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-slate-400 hover:text-blue-400 transition-colors block"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} New Tech Advertising. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3 className="font-semibold text-lg mt-6 mb-3">1. Services</h3>
            <p className="text-slate-700 mb-4">
              New Tech Advertising provides AI-powered marketing services including website design, local SEO optimization, 
              content creation, and video production for a monthly subscription fee.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">2. Payment Terms</h3>
            <p className="text-slate-700 mb-4">
              Services are billed monthly at $297/month. Payment is due at the beginning of each billing cycle. 
              We accept major credit cards and electronic payments.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">3. Cancellation Policy</h3>
            <p className="text-slate-700 mb-4">
              There are no long-term contracts. You may cancel your subscription at any time with no penalties or fees. 
              Cancellation will take effect at the end of your current billing period.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">4. Refund Policy</h3>
            <p className="text-slate-700 mb-4">
              We do not offer money-back guarantees. Like you, we need to be compensated for our work. However, 
              if you're not satisfied with our services, you may cancel at any time with no penalty.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">5. Service Delivery</h3>
            <p className="text-slate-700 mb-4">
              We aim to complete initial setup within 48 hours of onboarding. Ongoing services including content 
              creation and SEO optimization are provided continuously throughout your subscription.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">6. Intellectual Property</h3>
            <p className="text-slate-700 mb-4">
              All content, websites, and materials created for your business remain your property. We retain rights 
              to our proprietary tools, processes, and AI systems.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">7. Limitation of Liability</h3>
            <p className="text-slate-700 mb-4">
              While we strive for excellent results, marketing outcomes can vary. New Tech Advertising is not liable 
              for business results, revenue changes, or market conditions beyond our control.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">8. Contact</h3>
            <p className="text-slate-700">
              For questions about these terms, contact us at rick@newtechadvertising.com or call 641-420-8816.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3 className="font-semibold text-lg mt-6 mb-3">1. Information We Collect</h3>
            <p className="text-slate-700 mb-4">
              We collect information you provide directly to us, including your name, business name, email address, 
              phone number, website URL, and social media profiles when you sign up for our services.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">2. How We Use Your Information</h3>
            <p className="text-slate-700 mb-4">
              We use your information to provide and improve our marketing services, communicate with you about 
              your account, process payments, and deliver the AI-powered marketing solutions you've subscribed to.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">3. Information Sharing</h3>
            <p className="text-slate-700 mb-4">
              We do not sell your personal information. We may share your information with service providers who 
              assist in delivering our services, such as hosting providers and payment processors.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">4. Data Security</h3>
            <p className="text-slate-700 mb-4">
              We implement reasonable security measures to protect your information from unauthorized access, 
              alteration, or destruction. However, no internet transmission is completely secure.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">5. Cookies and Tracking</h3>
            <p className="text-slate-700 mb-4">
              We use cookies and similar technologies to improve your experience on our website, analyze traffic, 
              and understand how visitors interact with our services.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">6. Your Rights</h3>
            <p className="text-slate-700 mb-4">
              You have the right to access, update, or delete your personal information. You may also opt out of 
              marketing communications at any time.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">7. Children's Privacy</h3>
            <p className="text-slate-700 mb-4">
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect 
              personal information from children.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">8. Changes to This Policy</h3>
            <p className="text-slate-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of significant changes by 
              posting the new policy on our website.
            </p>

            <h3 className="font-semibold text-lg mt-6 mb-3">9. Contact Us</h3>
            <p className="text-slate-700">
              If you have questions about this privacy policy, please contact us at rick@newtechadvertising.com 
              or call 641-420-8816.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}