import React, { useState } from 'react';
import { Grid, List, X } from 'lucide-react';
import { CQApprovalBadge, CQAssetBadge } from './CQUtils';
import ContentQueueDrawer from './ContentQueueDrawer';

const MEDIA_TYPES = ['All', 'Image', 'Video', 'Reel / Short', 'Carousel'];

export default function CQAssetsTab({ items, campaigns, clients, onRefresh, onAssign }) {
  const [viewMode, setViewMode] = useState('grid');
  const [clientF, setClientF] = useState('All');
  const [typeF, setTypeF] = useState('All');
  const [drawer, setDrawer] = useState(null);
  const [preview, setPreview] = useState(null);

  const mediaItems = items.filter(i =>
    (i.image_url || i.video_url || i.thumbnail_url) &&
    i.queue_status !== 'Archived' &&
    (clientF === 'All' || i.client_id === clientF) &&
    (typeF === 'All' || i.content_type === typeF)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={clientF} onChange={e => setClientF(e.target.value)} className={SEL}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
        <select value={typeF} onChange={e => setTypeF(e.target.value)} className={SEL}>
          {MEDIA_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {mediaItems.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-600 text-sm">No media assets found. Add content with images or videos to see them here.</p>
        </div>
      )}

      {viewMode === 'grid' && mediaItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {mediaItems.map(i => (
            <div key={i.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors cursor-pointer" onClick={() => setDrawer(i)}>
              {i.image_url || i.thumbnail_url ? (
                <img src={i.image_url || i.thumbnail_url} className="w-full h-36 object-cover" onError={e => e.target.src = ''} />
              ) : (
                <div className="w-full h-36 bg-slate-800 flex items-center justify-center text-3xl">🎬</div>
              )}
              <div className="p-2.5">
                <p className="text-xs font-medium text-white truncate">{i.content_title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{i.business_name || 'NTA'}</p>
                <div className="mt-1.5"><CQAssetBadge status={i.asset_status} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && mediaItems.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {mediaItems.map(i => (
              <div key={i.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-800/30 cursor-pointer" onClick={() => setDrawer(i)}>
                {i.image_url || i.thumbnail_url ? (
                  <img src={i.image_url || i.thumbnail_url} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🎬</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{i.content_title}</p>
                  <p className="text-xs text-slate-500">{i.business_name || 'NTA'} · {i.content_type}</p>
                </div>
                <CQAssetBadge status={i.asset_status} />
                <CQApprovalBadge status={i.approval_status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {drawer && (
        <ContentQueueDrawer item={drawer} campaigns={campaigns} clients={clients}
          onClose={() => setDrawer(null)}
          onUpdated={(updated) => { setDrawer(updated); onRefresh(); }}
          onAssign={(items) => { setDrawer(null); onAssign(items); }} />
      )}
    </div>
  );
}

const SEL = 'bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';