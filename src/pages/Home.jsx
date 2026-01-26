import React, { useEffect } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Home as HomeIcon, Tv, Share2, HelpCircle } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    document.title = 'New Tech Advertising | Clear Marketing & Compliance Solutions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Clear marketing and compliance solutions for local businesses — guided, not overwhelming.');
    }
  }, []);

  const services = [
    {
      icon: CheckCircle,
      title: 'ADA Website Accessibility',
      description: 'Free accessibility scan + clear next steps.',
      cta: 'Start Free ADA Scan',
      route: createPageUrl('AdaAccessibility')
    },
    {
      icon: HomeIcon,
      title: 'Website Rebuild (ADA-friendly)',
      description: 'A modern rebuild designed to be accessible and conversion-ready.',
      cta: 'Request a Rebuild Review',
      route: `${createPageUrl('AdaIntake')}?package=Rebuild`
    },
    {
      icon: Tv,
      title: 'Local Visibility (Streaming TV + Social)',
      description: 'Be seen and remembered across today\'s screens.',
      cta: 'Get Visibility Guidance',
      route: createPageUrl('StreamingTV')
    },
    {
      icon: Share2,
      title: 'Social Media Management (Hybrid)',
      description: 'Done-for-you content with optional DIY support.',
      cta: 'See Social Options',
      route: createPageUrl('SocialMediaManagement')
    }
  ];

  return (
    <div className="bg-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "New Tech Advertising",
          "description": "Clear marketing and compliance solutions for local businesses",
          "url": "https://newtechadvertising.com",
          "telephone": "641-420-8816",
          "email": "rick@newtechadvertising.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mason City",
            "addressRegion": "IA",
            "addressCountry": "US"
          },
          "areaServed": ["Iowa", "Minnesota", "Mason City", "Clear Lake", "Rochester", "Des Moines", "Minneapolis"],
          "priceRange": "$$",
          "paymentAccepted": "Credit Card, Cash",
          "openingHours": "Mo-Fr 09:00-17:00"
        })}
      </script>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Clear marketing and compliance solutions for local businesses — guided, not overwhelming.
            </h1>
          </div>
        </section>

        {/* Service Cards */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base text-slate-600">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={service.route}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          {service.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Not Sure Section */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Not sure where to start?
            </h2>
            <Link to={createPageUrl('Onboarding')}>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Tell us what you need
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
}