import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaSuccess() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const leadId = urlParams.get('lead_id');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-slate-600">
              Thank you for choosing New Tech Advertising
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-left space-y-2 text-blue-800">
                  <li>✓ You'll receive a confirmation email within minutes</li>
                  <li>✓ Our team will reach out within 24 hours to schedule your onboarding</li>
                  <li>✓ We'll begin your ADA compliance audit immediately</li>
                  <li>✓ Most projects are completed within 2-3 weeks</li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-slate-700">
                  Complete your onboarding form now to help us get started faster
                </p>
                <Button
                  onClick={() => navigate(createPageUrl('AdaOnboarding') + '?lead_id=' + leadId)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg py-6"
                >
                  Complete Onboarding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Home'))}
                  className="w-full"
                >
                  Return to Homepage
                </Button>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-slate-600">
                  Questions? Contact Rick at{' '}
                  <a href="tel:641-420-8816" className="text-blue-600 hover:underline">
                    641-420-8816
                  </a>
                  {' '}or{' '}
                  <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 hover:underline">
                    rick@newtechadvertising.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}