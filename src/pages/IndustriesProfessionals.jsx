import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle } from 'lucide-react';

export default function IndustriesProfessionals() {
  return (
    <div className="bg-white">
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
            Marketing & Compliance for Professional Offices
          </h1>
          <p className="text-xl text-slate-600 text-center mb-8">
            Law Firms, Medical Practices, and Consultants
          </p>
          
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Priorities:</h2>
            <ul className="space-y-3 text-slate-700 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>ADA compliance to avoid accessibility lawsuits</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Professional online presence that builds credibility</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Attract more qualified clients in your service area</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Stay visible without constant manual effort</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">What We Recommend:</h3>
            <p className="text-slate-600 mb-6">
              Start with an ADA review to understand your compliance status, then expand visibility with local campaigns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('AdaAccessibility')} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                  Start with ADA Review
                </Button>
              </Link>
              <Link to={createPageUrl('StreamingTV')} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Local Visibility
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