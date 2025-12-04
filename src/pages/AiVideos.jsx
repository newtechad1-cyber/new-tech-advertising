import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Video, Share2, TrendingUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiVideos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                High-Converting Videos <span className="text-blue-400">Created by AI</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Video content is king. We use advanced AI to script, edit, and produce professional marketing videos for your business at scale.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                Start Video Marketing
              </Button>
            </motion.div>
            <div className="relative bg-slate-800 rounded-2xl aspect-video flex items-center justify-center overflow-hidden group cursor-pointer shadow-2xl border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1574717436558-4d96eb5a1756?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Video Production" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-slate-900 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why AI Video?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Traditional video production is slow and expensive. Our AI approach changes the game.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Video,
                  title: "Automated Production",
                  desc: "We turn text scripts into engaging videos with professional voiceovers and stock footage in minutes."
                },
                {
                  icon: Share2,
                  title: "Social Ready",
                  desc: "Content optimized for TikTok, Instagram Reels, and YouTube Shorts to maximize viral potential."
                },
                {
                  icon: TrendingUp,
                  title: "Engagement Boost",
                  desc: "Video ads get 3x more clicks than image ads. We keep your feed fresh with constant new content."
                }
              ].map((item, i) => (
                <div key={i} className="border border-slate-200 p-8 rounded-xl hover:shadow-lg transition-shadow">
                  <item.icon className="w-12 h-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
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