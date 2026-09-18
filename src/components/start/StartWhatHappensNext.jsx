import { Link } from 'react-router-dom';
import {
  Users, HeartHandshake, MessagesSquare, TrendingUp, Globe,
  Megaphone, Search, Star, Cpu, MonitorSmartphone, Boxes, HelpCircle,
} from 'lucide-react';

const STARTERS = [
  { icon: Users, label: 'Your team' },
  { icon: HeartHandshake, label: 'Customer experience' },
  { icon: MessagesSquare, label: 'Communication' },
  { icon: TrendingUp, label: 'Growth' },
  { icon: Globe, label: 'Website' },
  { icon: Megaphone, label: 'Marketing' },
  { icon: Search, label: 'Google visibility' },
  { icon: Star, label: 'Reviews' },
  { icon: Cpu, label: 'AI' },
  { icon: MonitorSmartphone, label: 'Existing technology' },
  { icon: Boxes, label: 'Business systems' },
  { icon: HelpCircle, label: "A problem you haven't quite figured out yet" },
];

export default function StartWhatHappensNext() {
  return (
    <>
      {/* Section 1: Start with what's already on your mind */}
      <section className="bg-slate-950 border-t border-slate-800/60 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Start With What's Already On Your Mind.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              You don't have to pick a service before you reach out. The conversation might begin with any of these—or something else entirely.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {STARTERS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-blue-500/40 transition-colors"
                >
                  <Icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm font-medium leading-snug">{s.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            You don't need to select a service before contacting NTA. Just start with what's on your mind.
          </p>
        </div>
      </section>

      {/* Section 2: We start by understanding the business */}
      <section className="bg-slate-900 border-y border-slate-800 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            We Start By Understanding the Business.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-5 max-w-2xl mx-auto">
            NTA looks beyond an individual marketing problem or technology. We listen to what the owner is seeing, what employees are learning, what customers are saying, and what the business already has in place.
          </p>
          <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
            When useful, that knowledge can begin forming a <strong className="text-white font-semibold">Digital Growth Roadmap™</strong> and eventually become part of a connected <strong className="text-white font-semibold">Digital Growth Office™</strong> where the owner, team and NTA can keep learning and improving together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/growth-roadmap-generator"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
            >
              Learn About the Growth Roadmap
            </Link>
            <Link
              to="/operating-system"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
            >
              Learn About the Digital Growth Office
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            <span className="font-semibold text-slate-300">People provide the knowledge. People make the decisions.</span> AI helps NTA organize conversations, remember important information, identify patterns, prepare useful follow-up, and bring important things back to your attention.
          </p>
        </div>
      </section>
    </>
  );
}