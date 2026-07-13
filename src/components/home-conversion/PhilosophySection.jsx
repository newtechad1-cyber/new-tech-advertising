import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function PhilosophySection() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header and Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            THE NTA DIFFERENCE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Work With Someone, Not Just Something</h2>
          
          <div className="space-y-6 text-lg text-slate-300 text-left md:text-center leading-relaxed">
            <p>Technology is changing faster than most business owners can keep up.</p>
            <p>New tools appear every day. Companies make bigger promises. Business owners are left wondering what actually matters, what they should trust, and where their money should go.</p>
            <p>I do not expect you to become an AI or marketing expert.</p>
            <p>My role is to help you understand what matters, ignore what does not, and make better decisions using tools I have spent years learning to work with.</p>
            <p>I am not interested in selling you another unexplained marketing package.</p>
            <p className="text-white font-medium">I am interested in building a relationship based on trust, learning, honest communication, and measurable progress.</p>
          </div>
        </div>

        {/* Founder Quote Centerpiece */}
        <div className="mb-20">
          <blockquote className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute -top-4 -left-4 text-blue-500/10 text-9xl font-serif">"</div>
            <p className="text-2xl md:text-3xl text-blue-50 font-medium italic leading-relaxed mb-6 relative z-10">
              "If you can offer me enough trust to begin, I will work to earn enough trust to continue."
            </p>
            <cite className="block not-italic relative z-10">
              <span className="block font-bold text-white text-lg">Rick Hesse</span>
              <span className="block text-slate-400">Founder, New Tech Advertising</span>
            </cite>
          </blockquote>
        </div>

        {/* Three Principles */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500/30 transition-colors shadow-lg shadow-slate-950/50">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">1. Understand Before You Spend</h3>
            <p className="text-slate-400 leading-relaxed">
              You should know what is being built, why it matters, and how it supports your business before you are asked to invest more money.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500/30 transition-colors shadow-lg shadow-slate-950/50">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">2. Build Trust Through Progress</h3>
            <p className="text-slate-400 leading-relaxed">
              Trust should not be demanded. It should be earned through listening, honest communication, useful work, and visible progress.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500/30 transition-colors shadow-lg shadow-slate-950/50">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">3. Use AI With Human Judgment</h3>
            <p className="text-slate-400 leading-relaxed">
              AI brings technical knowledge, speed, and capability. Experience, wisdom, priorities, relationships, and final judgment remain human responsibilities.
            </p>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xl text-slate-300 leading-relaxed font-medium">
            I’m not looking for clients who need convincing. I’m looking for business owners who are curious enough to learn, humble enough to grow, and willing to build something worthwhile together.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/why-nta" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-center"
          >
            Explore Why NTA Exists
          </Link>
          <Link 
            to="/growth-conversation" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full font-semibold transition-all text-center"
          >
            Start a Growth Conversation
          </Link>
        </div>

      </div>
    </section>
  );
}