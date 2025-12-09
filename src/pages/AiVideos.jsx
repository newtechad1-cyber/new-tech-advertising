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

  React.useEffect(() => {
    document.title = 'AI Video Marketing | Professional Videos for Iowa & Minnesota Businesses';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-generated professional marketing videos for Mason City and Midwest businesses. Automated production, social-ready content, voice cloning, and AI avatars. 3x more engagement than image ads.');
    }
  }, []);

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
                High-Converting Videos for Mason City Businesses <span className="text-blue-400">Created by AI</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Video content is king. We use advanced AI to script, edit, and produce professional marketing videos for your business at scale.
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                Start Video Marketing
              </Button>
            </motion.div>
            <div className="relative rounded-2xl aspect-video overflow-hidden shadow-2xl border border-white/10">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/FRVnWkBvZCM" 
                title="AI Video Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why AI Video?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Traditional video production is slow and expensive. Our AI approach changes the game.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
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

            {/* Tech Deep Dive */}
            <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">State-of-the-Art Video Tech</h2>
                  <p className="text-slate-300 mb-6">
                    We use the same technology that Hollywood studios use, but scaled for Mason City business owners.
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-blue-400 mb-2">AI Avatars</h4>
                      <p className="text-sm text-slate-400">
                        Professional presenters that can speak 60+ languages perfectly, available 24/7 to present your products.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-400 mb-2">Script-to-Scene</h4>
                      <p className="text-sm text-slate-400">
                        Our AI reads your website and automatically generates video scripts, selects relevant B-roll footage, and edits it to the beat of the music.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-400 mb-2">Voice Cloning</h4>
                      <p className="text-sm text-slate-400">
                        We can even clone your own voice so you can "narrate" videos without ever stepping into a recording booth.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
                      Create My First Video
                    </Button>
                  </div>
                </div>
                <div className="relative aspect-video bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
                  <Play className="w-20 h-20 text-blue-500 opacity-50" />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-green-400">RENDERING: Mason_City_Promo_v2.mp4</span>
                    </div>
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