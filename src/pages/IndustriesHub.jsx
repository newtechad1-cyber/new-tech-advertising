import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Wrench, Briefcase, Heart } from 'lucide-react';

export default function IndustriesHub() {
  const industries = [
    {
      icon: Building2,
      title: 'Small Local Businesses',
      description: 'Retail, restaurants, and local service providers',
      route: '/industries/small-local'
    },
    {
      icon: Wrench,
      title: 'Service Trades',
      description: 'HVAC, plumbing, electrical, and contractors',
      route: '/industries/service-trades'
    },
    {
      icon: Briefcase,
      title: 'Professional Offices',
      description: 'Law firms, medical practices, and consultants',
      route: '/industries/professionals'
    },
    {
      icon: Heart,
      title: 'Nonprofits & Community',
      description: 'Mission-driven organizations serving the community',
      route: '/industries/nonprofits'
    }
  ];

  return (
    <div className="bg-white">
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Industries We Help
            </h1>
            <p className="text-xl text-slate-600">
              Choose your industry to see relevant examples and the best starting point.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
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
                    <Link to={industry.route}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}