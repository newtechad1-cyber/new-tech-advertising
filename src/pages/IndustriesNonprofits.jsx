import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle } from 'lucide-react';

export default function IndustriesNonprofits() {
  return (
    <div className="bg-white">
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
            Accessibility & Marketing for Nonprofits
          </h1>
          <p className="text-xl text-slate-600 text-center mb-8">
            Mission-Driven Organizations Serving the Community
          </p>
          
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What Matters Most:</h2>
            <ul className="space-y-3 text-slate-700 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>ADA compliance — especially important for nonprofits receiving federal funding</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Accessible website for all community members</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Reach donors, volunteers, and those you serve</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Budget-friendly solutions that respect your mission</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Recommendation:</h3>
            <p className="text-slate-600 mb-6">
              We offer special nonprofit pricing for ADA compliance and marketing services. Let's discuss your needs and budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`${createPageUrl('AdaAccessibility')}?nonprofit=true`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                  Nonprofit ADA Options
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}