import React from 'react';

export default function RSProblem() {
  return (
    <section className="bg-[#0B1120] py-24 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#F59E0B] text-sm font-bold uppercase tracking-widest mb-3">
            THE PROBLEM
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Third-Party Apps Are Eating Your Profits
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            DoorDash, Grubhub, and Uber Eats take 15-30% of every order. They own your customer data. And they put your competitors right next to you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="text-4xl mb-6">💸</div>
            <h3 className="text-xl font-bold text-white mb-4">Commission Fees</h3>
            <p className="text-slate-400 leading-relaxed">
              Giving away 15-30% per order to apps that don't care about your business. On a $500 night, that's $75-$150 gone.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="text-4xl mb-6">👻</div>
            <h3 className="text-xl font-bold text-white mb-4">You Don't Own Your Customers</h3>
            <p className="text-slate-400 leading-relaxed">
              Third-party apps keep the customer data. They ordered from DoorDash, not from you. No repeat business, no relationship.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="text-4xl mb-6">📉</div>
            <h3 className="text-xl font-bold text-white mb-4">Invisible Online</h3>
            <p className="text-slate-400 leading-relaxed">
              When someone searches 'best tacos near me,' do they find YOU or a delivery app listing? Most local restaurants are invisible in AI search results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}