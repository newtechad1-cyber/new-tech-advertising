import React from 'react';

export default function NTAVideoMessage() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
          A Message from New Tech Advertising
        </h2>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
          <iframe 
            src="https://app.heygen.com/embeds/6d74ae416e5c43328e0856079bdd2a41" 
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; fullscreen" 
            title="A Message from New Tech Advertising"
          />
        </div>
      </div>
    </section>
  );
}