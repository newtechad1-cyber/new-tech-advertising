import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';

export default function LCVideoCard({ video }) {
  return (
    <Link to={`/learning-center/videos/${video.id}`} className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-[0_10px_40px_-15px_rgba(37,99,235,0.3)] h-full">
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {(video.status === 'planned' || video.status === 'placeholder' || video.status === 'needs_video') && (
          <div className="absolute inset-0 bg-slate-900/60 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="bg-slate-900/90 border border-slate-700/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-200">Coming Soon</span>
            </div>
          </div>
        )}
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 group-hover:from-slate-800 group-hover:via-blue-900 group-hover:to-slate-800 transition-colors relative overflow-hidden p-6 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
            <h4 className="text-white font-black text-xl md:text-2xl mb-3 relative z-10 drop-shadow-lg leading-tight px-4">{video.title}</h4>
            <div className="w-16 h-1.5 bg-blue-500 rounded-full mb-4 relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 group-hover:bg-blue-600/90 group-hover:scale-110 transition-all shadow-lg">
            <PlayCircle className="w-6 h-6 text-white ml-1" />
          </div>
        </div>

        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-blue-400/30 shadow-lg">
          {video.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">{video.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mt-auto">{video.description}</p>
      </div>
    </Link>
  );
}