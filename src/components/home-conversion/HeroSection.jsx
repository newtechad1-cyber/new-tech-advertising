import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const growthSteps = [
  {
    title: 'Build a Strong Foundation',
    description: 'Strengthen your website, message, and essential systems before spending more on promotion.'
  },
  {
    title: 'Help More Customers Find You',
    description: 'Improve visibility so the right local customers can discover and understand your business.'
  },
  {
    title: 'Build Trust and Relationships',
    description: 'Use helpful content, reputation, and consistent follow-up to turn attention into confidence.'
  },
  {
    title: 'Save Time with Practical AI',
    description: 'Automate repetitive work and improve follow-up without losing the human judgment that makes your business valuable.'
  }
];

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://media.base44.com/images/public/691f41a18de4a7f498c8f884/edfc63215_Minimalisticrobotdeskworkspace.png")' }}
      >
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none blur-3xl z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            We help local businesses get found online, build trust, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">grow consistently</span> month after month.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed space-y-5"
          >
            <p>
              As Your Digital Growth Guide™, we bring your marketing, customer relationships, business knowledge, AI, and day-to-day operations together into one practical growth system.
            </p>
            <p>
              We start by strengthening your foundation. Then we help more people find your business. Next we build trust through helpful content and a strong reputation. As your business grows, we use practical AI and automation to save time, improve follow-up, and keep your growth moving forward.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14"
        >
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">A clear path forward</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">How We Help You Grow</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {growthSteps.map((step, index) => (
              <div key={step.title} className="bg-slate-900/75 border border-slate-700/80 rounded-2xl p-6 text-left backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold">
                    {index + 1}
                  </span>
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0 px-8">
            <Link to="/growth-conversation">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Your Growth Conversation
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-slate-950/40 border-slate-600 text-white hover:bg-slate-800 hover:text-white px-8">
            <Link to="/operating-system">
              See How the System Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        <p className="mt-6 text-center text-sm text-slate-400">
          No one-size-fits-all package. We help you identify what needs attention first and build in the right order.
        </p>
      </div>
    </section>
  );
}
