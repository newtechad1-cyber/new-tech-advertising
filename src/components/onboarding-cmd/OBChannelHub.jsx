import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

const CHANNELS = [
  {
    id: 'facebook', name: 'Facebook', color: '#1877f2',
    icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    description: 'Page posting + ad account access',
    perms: 'pages_manage_posts, ads_management',
  },
  {
    id: 'instagram', name: 'Instagram', color: '#e1306c',
    icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    description: 'Business profile + content posting',
    perms: 'instagram_basic, instagram_content_publish',
  },
  {
    id: 'google_business', name: 'Google Business', color: '#4285f4',
    icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
    description: 'Review management + post publishing',
    perms: 'mybusiness.manage',
  },
  {
    id: 'youtube', name: 'YouTube', color: '#ff0000',
    icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    description: 'Channel management + video publishing',
    perms: 'youtube.upload, youtube.channel',
  },
  {
    id: 'tiktok', name: 'TikTok', color: '#69c9d0',
    icon: () => <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#69c9d0"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
    description: 'Creator account + video publishing',
    perms: 'video.upload, user.info.basic',
  },
];

export default function OBChannelHub({ connected, onConnect }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h3 className="text-white font-bold text-sm">Channel Connection Hub</h3>
        <p className="text-slate-500 text-xs mt-0.5">{connected.length}/{CHANNELS.length} platforms connected</p>
      </div>
      <div className="p-3 space-y-2">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const isConnected = connected.includes(ch.id);
          return (
            <div key={ch.id} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
              isConnected ? 'border-green-800/40 bg-green-950/15' : 'border-slate-700/50 bg-slate-800/30'
            }`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ch.color}18` }}>
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{ch.name}</p>
                <p className="text-slate-500 text-xs truncate">{ch.description}</p>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <button onClick={() => onConnect(ch.id, false)} className="text-slate-600 hover:text-slate-400 transition-colors">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button onClick={() => onConnect(ch.id, true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors text-white"
                  style={{ background: `${ch.color}30`, border: `1px solid ${ch.color}50` }}>
                  <ExternalLink className="w-3 h-3" /> Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}