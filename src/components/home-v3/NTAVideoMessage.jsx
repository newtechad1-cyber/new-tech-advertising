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
            src="https://www.youtube.com/embed/fb6dOHawJ04" 
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            title="A Message from New Tech Advertising"
          />
        </div>
      </div>
    </section>
  );
}