import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Users, Target, Zap, Heart } from 'lucide-react';

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Empowering Small Businesses with <span className="text-blue-600">AI Technology</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                We believe that advanced marketing technology shouldn't be reserved for big corporations. Our mission is to level the playing field.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                At New Tech Advertising, we are driven by a single purpose: to help local businesses in Mason City, IA, and throughout Minnesota thrive in the digital age without breaking the bank.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We witnessed too many great small businesses struggling because they couldn't afford high-end agencies or didn't have the time to master complex marketing tools. We decided to change that by combining human creativity with the efficiency of Artificial Intelligence.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The result? Enterprise-level marketing results at a price point that makes sense for Main Street.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-80 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-slate-400">The principles that guide everything we do.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800 p-8 rounded-xl">
                <Target className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Results First</h3>
                <p className="text-slate-300">We don't care about vanity metrics. We care about leads, calls, and sales for your business.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-xl">
                <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-slate-300">We constantly update our AI tools to ensure you stay ahead of the competition.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-xl">
                <Heart className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Transparency</h3>
                <p className="text-slate-300">No hidden fees. No long-term contracts. Just honest work and clear reporting.</p>
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