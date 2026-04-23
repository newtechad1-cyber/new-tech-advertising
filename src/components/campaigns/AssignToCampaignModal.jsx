import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube', 'Google Business Profile', 'TikTok'];

export default function AssignToCampaignModal({ items, campaigns, clients, onClose, onSaved }) {
  const [campaignId, setCampaignId] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [createNew, setCreateNew] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    let targetCampaignId = campaignId;

    if (createNew && newCampName.trim()) {
      const firstItem = items[0];
      const camp = await base44.entities.Campaign.create({
        campaign_name: newCampName,
        client_id: firstItem?.client_id || '',
        business_name: firstItem?.business_name || '',
        campaign_type: 'Social Posting',
        status: 'Active',
      });
      targetCampaignId = camp.id;
    }

    await Promise.all(items.map(async (item) => {
      // Create CampaignPost from queue item
      await base44.entities.CampaignPost.create({
        campaign_id: targetCampaignId || null,
        client_id: item.client_id || '',
        business_name: item.business_name || '',
        title: item.content_title,
        post_type: mapPostType(item.content_type),
        platform: item.platform_recommended || platform,
        content_caption: item.caption || item.hook || '',
        video_script: item.script || '',
        media_url: item.image_url || item.video_url || '',
        thumbnail_url: item.thumbnail_url || '',
        publishing_status: 'Draft',
        approval_status: 'Not Needed',
        notes: item.notes || '',
      });
      // Update queue item status
      await base44.entities.ContentQueueItem.update(item.id, {
        queue_status: 'Assigned to Campaign',
        campaign_id: targetCampaignId || item.campaign_id || '',
        asset_status: 'Approved Asset',
      });
    }));

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Assign to Campaign</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''} will be sent to Campaign Management as new posts.</p>

          <div className="flex items-center gap-3">
            <button onClick={() => setCreateNew(false)} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${!createNew ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              Existing Campaign
            </button>
            <button onClick={() => setCreateNew(true)} className={`text-sm px-3 py-1.5 rounded-lg font-medium ${createNew ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              New Campaign
            </button>
          </div>

          {!createNew ? (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Campaign</label>
              <select value={campaignId} onChange={e => setCampaignId(e.target.value)} className={INPUT}>
                <option value="">— No Campaign (Draft Posts) —</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name} ({c.business_name || 'NTA'})</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">New Campaign Name</label>
              <input value={newCampName} onChange={e => setNewCampName(e.target.value)} placeholder="Campaign name..." className={INPUT} />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Default Platform (if not set per item)</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className={INPUT}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving || (createNew && !newCampName.trim())} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Sending...' : 'Send to Campaign Management'}
          </button>
        </div>
      </div>
    </div>
  );
}

function mapPostType(ct) {
  const map = {
    'Video': 'Video Post', 'Reel / Short': 'Reel / Short', 'Carousel': 'Carousel',
    'Image': 'Image Post', 'Testimonial': 'Testimonial', 'Educational': 'Educational',
    'Offer': 'Offer Post',
  };
  return map[ct] || 'Text Post';
}

const INPUT = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500';