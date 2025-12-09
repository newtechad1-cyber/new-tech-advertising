import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Target, PieChart, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiAdvertising() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    document.title = 'AI Advertising Services | Google Ads & Facebook Ads | Iowa & Minnesota';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-powered advertising management for Iowa and Minnesota businesses. Precision targeting, budget optimization, and 72% lower cost per lead. Serving Mason City, Rochester, Des Moines, Minneapolis.');
    }
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Precision Advertising for Mason City Businesses <br/>Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Machine Learning</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10">
                Stop wasting budget on the wrong people. Our AI manages your ads across Google, Facebook, and Instagram to maximize ROI for your Iowa or Minnesota business automatically.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-white text-purple-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl font-bold">
                  Start Your Campaign
                </Button>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[21/9] max-w-3xl mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1000&auto=format&fit=crop" 
                  alt="AI advertising dashboard showing Google and Facebook ad performance for Minnesota business campaigns" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <Target className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Micro-Targeting</h3>
                <p className="text-slate-600 text-sm">AI identifies patterns in your best customers and finds more people just like them.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <DollarSign className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Budget Optimization</h3>
                <p className="text-slate-600 text-sm">Real-time bidding adjustments ensure you never overpay for a lead.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Cross-Platform</h3>
                <p className="text-slate-600 text-sm">Seamlessly sync campaigns across Social Media, Search, and Display networks.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <PieChart className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Live Analytics</h3>
                <p className="text-slate-600 text-sm">Transparent dashboards showing exactly where every penny goes and what it returns.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">How AI Maximizes Your Budget</h2>
                <p className="text-slate-600 text-lg mb-6">
                  Traditional advertising involves a lot of guesswork. Our AI platform replaces guessing with data-driven precision.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Predictive Bidding</h4>
                      <p className="text-slate-600">Our algorithms analyze historical data to predict the best time and price to bid for a click, ensuring you get the most quality leads for the lowest cost.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Dynamic Creative Optimization</h4>
                      <p className="text-slate-600">The system automatically tests hundreds of headlines and image combinations to find the winning ad for each specific viewer.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Geo-Fencing Iowa & MN</h4>
                      <p className="text-slate-600">We can draw a virtual perimeter around your service area—whether it's Mason City, Clear Lake, or the Twin Cities—showing ads only to people physically located near you.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
                  <h3 className="text-xl font-bold mb-6">Campaign Performance Example</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div>
                        <p className="text-sm text-slate-500">Cost Per Lead (Before AI)</p>
                        <p className="font-bold text-slate-900">$45.00</p>
                      </div>
                      <span className="text-red-500 text-sm font-medium">High</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-slate-200"></div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div>
                        <p className="text-sm text-slate-500">Cost Per Lead (With AI)</p>
                        <p className="font-bold text-slate-900">$12.50</p>
                      </div>
                      <span className="text-green-500 text-sm font-medium">-72% Cost</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 italic">
                      *Average results based on local service business campaigns in the Midwest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Ready to Scale?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Most small businesses waste 40% of their ad spend on inefficient targeting. We fix that instantly.
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Get A Free Audit
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}