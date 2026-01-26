import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import TestModeBanner from '../components/TestModeBanner';

export default function OnboardThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <TestModeBanner />
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-6">
        <Card className="max-w-2xl w-full p-12 text-center shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            You're all set — we received your info
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            Thank you for your interest. We've sent a confirmation to your email.
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 text-left">
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              <li>We'll review your onboarding details</li>
              <li>If we need anything, we'll email you</li>
              <li>You'll receive next steps within 1 business day</li>
            </ul>
          </div>

          <p className="text-slate-600 mb-6">
            Questions? Reply to your confirmation email or call <strong>641-420-8816</strong>
          </p>

          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Return to Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </section>

      <Footer />
    </div>
  );
}