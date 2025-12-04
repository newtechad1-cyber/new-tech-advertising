import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Share2, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SocialMediaManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Social Media <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">On Autopilot</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Consistent, high-quality content posted to all your channels automatically. Engage your audience without lifting a finger.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-xl">
                Automate My Socials
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
                alt="Social Media Management AI Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <Share2 className="w-12 h-12 text-pink-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Channel Posting</h3>
                <p className="text-slate-600">One click publishes your content to Facebook, Instagram, LinkedIn, Twitter, and TikTok simultaneously.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <MessageCircle className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Engagement</h3>
                <p className="text-slate-600">Our AI monitors comments and messages, drafting suggested replies to keep your community active.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <TrendingUp className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Growth Analytics</h3>
                <p className="text-slate-600">Understand exactly what content drives followers and sales with our simplified weekly reports.</p>
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