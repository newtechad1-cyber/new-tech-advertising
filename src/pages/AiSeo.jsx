import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Search, BarChart2, Globe, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiSeo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    document.title = 'Local SEO Services Iowa & Minnesota | AI-Powered SEO | New Tech Advertising';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Dominate local search in Iowa and Minnesota with AI-powered SEO. Get found by customers in Mason City, Des Moines, Rochester, and across the Midwest. Automated content, smart keywords, review management.');
    }
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-green-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-block p-3 bg-green-100 rounded-full mb-6">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Dominate Local Search in Iowa & Minnesota with <br/><span className="text-green-600">AI-Powered SEO</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                Get found by customers exactly when they are looking for your services in Mason City and beyond. Our AI analyzes thousands of ranking factors to push you to the top.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-xl">
                Boost My Rankings
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-green-100 p-3 rounded-lg h-fit">
                    <Globe className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Smart Keyword Targeting</h3>
                    <p className="text-slate-600">We don't guess. Our AI identifies "high intent" keywords that your competitors are missing, bringing you ready-to-buy customers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg h-fit">
                    <BarChart2 className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Automated Content Strategy</h3>
                    <p className="text-slate-600">Search engines love fresh content. Our system generates authoritative blog posts and location pages automatically to build your relevance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg h-fit">
                    <ArrowUpCircle className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Review Management</h3>
                    <p className="text-slate-600">Social proof boosts SEO. We help generate and manage 5-star reviews to signal trust to Google.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">The AI Advantage</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Keyword Research Speed</span>
                      <span className="text-green-400">100x Faster</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Content Production Cost</span>
                      <span className="text-green-400">90% Lower</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-[10%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Ranking Updates</span>
                      <span className="text-green-400">Daily</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
                    alt="AI SEO Analytics" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}