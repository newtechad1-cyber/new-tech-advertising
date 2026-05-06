import React from 'react';
import { Play, Instagram } from 'lucide-react';

export default function RestaurantSocial({ config }) {
  const { socialVideos, primaryColor, name } = config;

  return (
    <section className="py-16 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Follow Along</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Food. Events. Behind the Scenes.</h2>
          <p className="text-slate-500 mt-2 text-sm">Short videos, promos, and real moments from {name}.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {socialVideos.map((v, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
              <img src={v.thumbnail} alt={v.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <p className="text-white text-xs font-semibold text-center px-3 hidden group-hover:block leading-tight">{v.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <a href="#" className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 font-bold px-5 py-3 rounded-xl transition-colors text-sm">
            <Instagram className="w-4 h-4 text-pink-500" /> Follow on Instagram
          </a>
          <a href="#" className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 font-bold px-5 py-3 rounded-xl transition-colors text-sm">
            <svg className="w-4 h-4 text-blue-600 fill-blue-600" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Follow on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}