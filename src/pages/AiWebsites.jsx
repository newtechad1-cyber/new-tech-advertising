import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Gauge, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiWebsites() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Intelligent Websites That <br/><span className="text-blue-600">Actually Convert</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                Stop settling for digital brochures. Our AI-optimized websites are built to turn visitors into paying customers from day one.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                Get Your AI Website
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Layout className="w-16 h-16 text-blue-600 mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Dynamic Content Adaptation</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Our websites don't just sit there. They learn. Using AI analysis, we optimize headlines, images, and calls-to-action based on what works best for your specific audience.
              </p>
              <ul className="space-y-3">
                {[
                  "Auto-generating fresh content",
                  "A/B testing built-in",
                  "Personalized user experiences",
                  "Semantic structure for SEO"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-xl p-8 aspect-square flex items-center justify-center">
              {/* Visual placeholder */}
              <div className="text-slate-400 text-center">
                <Layout className="w-32 h-32 mx-auto mb-4 opacity-50" />
                <p>AI Page Structure Visualization</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <Smartphone className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Mobile Perfection</h3>
                <p className="text-slate-600">Responsive design that adapts flawlessly to every device screen size instantly.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <Gauge className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-slate-600">Optimized code and assets ensure your site loads in milliseconds, boosting SEO.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <MousePointerClick className="w-10 h-10 text-red-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Conversion Focused</h3>
                <p className="text-slate-600">Every pixel is placed with one goal: getting the customer to click "Buy" or "Call".</p>
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