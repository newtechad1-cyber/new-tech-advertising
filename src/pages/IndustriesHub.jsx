import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Wrench, Briefcase, Heart } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';

export default function IndustriesHub() {
  const industries = [
    {
      icon: Building2,
      title: 'Small Local Businesses',
      description: 'Clear marketing and compliance steps for local service providers.',
      href: '/industries/small-local'
    },
    {
      icon: Wrench,
      title: 'Service Trades',
      description: 'HVAC, plumbing, electrical, and other service contractors.',
      href: '/industries/service-trades'
    },
    {
      icon: Briefcase,
      title: 'Professional Offices',
      description: 'Law, accounting, medical, and other professional services.',
      href: '/industries/professionals'
    },
    {
      icon: Heart,
      title: 'Nonprofits & Community',
      description: 'Budget-conscious accessibility and marketing solutions.',
      href: '/industries/nonprofits'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Industries We Help
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose your industry to see the best starting point.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <a href={industry.href} key={index} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl mb-2">{industry.title}</CardTitle>
                      <CardDescription className="text-base text-slate-600">
                        {industry.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}