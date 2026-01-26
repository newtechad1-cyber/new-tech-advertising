import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle } from 'lucide-react';

export default function IndustriesSmallLocal() {
  return (
    <div className="bg-white">
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
            ADA + Marketing for Small Local Businesses
          </h1>
          
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Common Goals:</h2>
            <ul className="space-y-3 text-slate-700 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Stay compliant with ADA website accessibility requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Get more visibility in your local community</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Reach customers where they're actually looking (streaming TV, social media)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Keep marketing simple and manageable</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">What We Recommend:</h3>
            <p className="text-slate-600 mb-6">
              Start with local visibility to get customers through the door, then ensure your website is ADA-compliant to protect your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('StreamingTV')} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                  Start Here
                </Button>
              </Link>
              <Link to={createPageUrl('AdaAccessibility')} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Free ADA Scan
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