import React from 'react';
import { Link } from 'react-router-dom';

export default function ThreeWaysWeHelp() {
  return (
    <section className="bg-slate-950 py-24 px-6 relative border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#E8613A] text-sm font-bold uppercase tracking-widest mb-3">
            WHAT DO YOU NEED?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Built for the Way You Run Your Business
          </h2>
          <div className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            <p className="mb-4">
              No two local businesses operate the same way. That's why we don't do cookie-cutter software. We design custom systems tailored to your exact operational needs.
            </p>
            <p>
              Want to lock down your front-end Customer Management & Tracking? We can build that. Need to optimize your Back Office Systems to eliminate chaos? We do that too. Pick your priority, or let us build a unified system that handles both seamlessly.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6">
              📣
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Get More Customers</h3>
            <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
              AI-powered marketing that gets your business found online, builds trust with local customers, and turns searches into calls.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Local SEO', 'AI Search Visibility', 'Website Rebuilds', 'Streaming TV', 'Social Content', 'Follow-Up Automation'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
            <Link to="/local-lead-systems" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors inline-flex items-center gap-2 mt-auto">
              Explore Marketing Solutions →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#10B981]" />
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-2xl mb-6">
              💻
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Run Your Business Smarter</h3>
            <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
              Custom business software that replaces QuickBooks, spreadsheets, and manual dispatch. Built specifically for service businesses.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Dispatch & Scheduling', 'Invoicing', 'Expense Tracking', 'Customer Management', 'Inventory', 'Mobile Field View'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
            <Link to="/back-office-solutions" className="text-[#10B981] font-semibold hover:text-emerald-400 transition-colors inline-flex items-center gap-2 mt-auto">
              See Back-Office Solutions →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F59E0B]" />
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-2xl mb-6">
              🍽️
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Restaurant Solutions</h3>
            <p className="text-slate-400 mb-6 flex-grow leading-relaxed">
              Online ordering, menu management, and back-of-house systems that help restaurants fill more seats and run smoother operations.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Online Ordering', 'Menu Management', 'Table Reservations', 'Kitchen Display', 'Review Management', 'Local Visibility'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
            <Link to="/restaurants" className="text-[#F59E0B] font-semibold hover:text-amber-400 transition-colors inline-flex items-center gap-2 mt-auto">
              See Restaurant Solutions →
            </Link>
          </div>
        </div>

        <div className="text-center text-slate-400 mt-12">
          Most clients start with one and add more as they grow.{' '}
          <span className="text-white font-bold">There's no lock-in — we build around you.</span>
        </div>
      </div>
    </section>
  );
}