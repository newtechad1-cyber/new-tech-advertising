import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, ArrowRight, Building2, MapPin, PieChart, Users, Globe } from 'lucide-react';

export default function CommunityPartnerSection() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold mb-6 shadow-sm">
            <Handshake className="w-4 h-4" />
            Community Partner Program
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Help Local Businesses Grow.<br/>
            <span className="text-blue-600">Create Sustainable Revenue.</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Partner with New Tech Advertising to help local businesses improve their visibility, reputation, and customer growth using affordable AI-powered marketing systems while generating recurring revenue for your organization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Who Should Apply?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Building2, text: "Chambers of Commerce" },
                { icon: MapPin, text: "Main Street Organizations" },
                { icon: PieChart, text: "Economic Development" },
                { icon: Users, text: "Merchant Associations" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">The Revenue Opportunity</h3>
              <p className="text-slate-400 mb-8">Generate sustainable non-dues revenue while helping local businesses succeed.</p>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 text-center">
                <div className="text-sm font-medium text-blue-400 mb-2">Average Goal</div>
                <div className="text-4xl font-black text-white mb-2">$1,300+</div>
                <div className="text-sm text-slate-400">Per Month in recurring revenue</div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm font-medium text-slate-300">
                  Approximately 25 participating businesses
                </div>
              </div>
              <div className="text-center">
                <Link 
                  to="/community-partner"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/25"
                >
                  Learn More & Apply
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}