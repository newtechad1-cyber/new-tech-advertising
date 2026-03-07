import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tv, Target, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const PLATFORMS = ['Hulu', 'Roku', 'Paramount+', 'Peacock', 'Pluto TV', 'Amazon Fire TV', 'Tubi', 'ESPN+'];

const POINTS = [
  { icon: Tv, text: 'Your ad runs on the same screen as Netflix and Hulu' },
  { icon: Target, text: 'Targeted by zip code, household income, and behavior' },
  { icon: MapPin, text: 'Only runs in your service area — zero wasted impressions' },
];

export default function HomeStreamingTV() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">Streaming TV Advertising</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-5 leading-tight">
              Small businesses can now run TV ads
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Streaming TV advertising used to cost $50,000 and require a production crew. NTA handles the script, produces your video, and launches your campaign on 30+ platforms — at a fraction of broadcast cost.
            </p>

            <div className="space-y-4 mb-8">
              {POINTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={createPageUrl('StreamingTvAdvertising')}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-sky-600/20"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={createPageUrl('TvCommercialScriptGenerator')}
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-sky-500/50 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Get My Free TV Script <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: platform grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5 text-center">Your ads run on 30+ streaming platforms</p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {PLATFORMS.map(p => (
                <div key={p} className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
                  <p className="text-white text-xs font-semibold">{p}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-800 pt-5 space-y-2">
              {[
                'AI writes your commercial script',
                'We produce the video',
                'Launch in days — not months',
                'Track impressions and completions',
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}