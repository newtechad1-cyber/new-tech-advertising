import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { ExternalLink } from 'lucide-react';

export default function OurWork() {
  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => base44.entities.PortfolioItem.list()
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-[153px] pb-20">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Real websites we've built and optimized for local businesses just like yours.
          </p>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {isLoading ? (
            <div className="text-center text-gray-500 py-16">Loading...</div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="text-xl">Portfolio coming soon — check back shortly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  {item.screenshot_url && (
                    <div className="overflow-hidden h-52">
                      <img
                        src={item.screenshot_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex-shrink-0 mt-1"
                        title="Visit website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {item.industry && (
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                        {item.industry}
                      </span>
                    )}
                    {item.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    )}
                    <a
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      View Live Site →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}