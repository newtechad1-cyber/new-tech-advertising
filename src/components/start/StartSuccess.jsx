import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StartSuccess({ trialId }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </motion.div>
      
      <h2 className="text-3xl font-black text-white mb-4">Welcome to NTA! 🎉</h2>
      <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
        Your account is being set up. Here's what happens next:
      </p>

      {/* Timeline Stepper */}
      <div className="max-w-xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 text-left">
        <div className="relative space-y-6">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-800"></div>

          <div className="relative flex gap-4">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center relative z-10 shrink-0 outline outline-4 outline-slate-900">
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <p className="font-bold text-white mb-1">You signed up</p>
              <p className="text-sm text-slate-400">We got your info and we're building your profile</p>
            </div>
          </div>

          <div className="relative flex gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center relative z-10 shrink-0 outline outline-4 outline-slate-900 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div>
              <p className="font-bold text-white mb-1">We review your business</p>
              <p className="text-sm text-slate-400">We'll customize your dashboard based on your industry and goals</p>
            </div>
          </div>

          <div className="relative flex gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 relative z-10 shrink-0 outline outline-4 outline-slate-900"></div>
            <div>
              <p className="font-bold text-slate-500 mb-1">You're live</p>
              <p className="text-sm text-slate-600">Your marketing system is ready to use</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
        {/* Left Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 text-left flex flex-col h-full">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">Get Set Up With Rick</h3>
          <p className="text-slate-400 text-sm mb-6 flex-grow">
            15-minute call to walk through your new system, answer questions, and make sure everything fits your business.
          </p>
          <div className="mt-auto">
            <a 
              href="https://calendar.app.google/p6ieYanvwhixXxZ67" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors mb-2"
            >
              Book Kickoff Call →
            </a>
            <p className="text-center text-slate-500 text-xs">Recommended — gets you live faster</p>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6 text-left flex flex-col h-full">
          <div className="text-3xl mb-4">💻</div>
          <h3 className="text-xl font-bold text-white mb-2">Jump Into the Platform</h3>
          <p className="text-slate-400 text-sm mb-6 flex-grow">
            Log in and start exploring. Your dashboard, content tools, and campaign builder are ready.
          </p>
          <div className="mt-auto">
            <Link 
              to="/Login" 
              className="block w-full text-center bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors mb-2"
            >
              Go to Dashboard →
            </Link>
            <p className="text-center text-slate-500 text-xs">We'll email your login details shortly</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm">
        Questions anytime? Call or text Rick: <a href="tel:6414208816" className="text-blue-400 hover:text-blue-300">641-420-8816</a>
      </p>
    </div>
  );
}