import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomeGapAuditCTA() {
  return (
    <section className="bg-blue-600 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-blue-200 font-bold text-sm uppercase tracking-widest mb-3">Free · No Obligation</p>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Find Out What's Costing You Leads
        </h2>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          A free Gap Audit shows you exactly what's broken on your website, where you're missing in local search, and what it's costing your business. Takes 2 minutes to request.
        </p>
        <Link
          to="/gap-audit"
          className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-black px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          Get My Free Gap Audit <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-blue-200 text-sm mt-4">No sales pitch. Just a real look at what's holding your business back.</p>
      </div>
    </section>
  );
}