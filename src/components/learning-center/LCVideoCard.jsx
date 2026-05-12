import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';

export default function LCVideoCard({ video }) {
  return (
    <Link to={`/learning-center/videos/${video.id}`} className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-[0_10px_40px_-15px_rgba(37,99,235,0.3)] h-full">
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 group-hover:bg-slate-700 transition-colors">
            <PlayCircle className="w-12 h-12 text-slate-600 group-hover:text-blue-500 transition-colors" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 group-hover:bg-blue-600/90 group-hover:scale-110 transition-all shadow-lg">
            <PlayCircle className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
          <Clock className="w-3 h-3 text-blue-400" /> {video.duration}
        </div>
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-blue-400/30 shadow-lg">
          {video.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{video.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 mt-auto">{video.description}</p>
      </div>
    </Link>
  );
}