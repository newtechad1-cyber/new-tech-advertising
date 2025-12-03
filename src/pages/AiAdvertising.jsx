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
                Precision Advertising <br/>Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Machine Learning</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10">
                Stop wasting budget on the wrong people. Our AI manages your ads across Google, Facebook, and Instagram to maximize ROI automatically.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-white text-purple-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl font-bold">
                Start Your Campaign
              </Button>
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