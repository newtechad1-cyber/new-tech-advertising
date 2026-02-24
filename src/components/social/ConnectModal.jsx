import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const platformMeta = {
  facebook: { name: 'Facebook', emoji: '📘', note: 'Enter your Facebook Page ID and profile URL.' },
  instagram: { name: 'Instagram', emoji: '📷', note: 'Enter your Instagram Business account username.' },
  youtube: { name: 'YouTube', emoji: '▶️', note: 'Enter your YouTube Channel ID (found in YouTube Studio settings).' },
  google_my_business: { name: 'Google My Business', emoji: '🗺️', note: 'Enter your Business Profile ID or location URL.' },
  tiktok: { name: 'TikTok', emoji: '🎵', note: 'Enter your TikTok @username.' },
  linkedin: { name: 'LinkedIn', emoji: '💼', note: 'Enter your LinkedIn Company Page ID or vanity URL.' },
};

export default function ConnectModal({ account, open, onClose, onSaved }) {
  const [form, setForm] = useState({
    account_name: account?.account_name || '',
    platform_user_id: account?.platform_user_id || '',
    profile_url: account?.profile_url || '',
    profile_image_url: account?.profile_image_url || '',
  });
  const [saving, setSaving] = useState(false);

  if (!account) return null;
  const meta = platformMeta[account.platform];

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      status: 'connected',
      last_synced_at: new Date().toISOString(),
    };
    if (account.id) {
      await base44.entities.SocialAccount.update(account.id, data);
    } else {
      await base44.entities.SocialAccount.create({ platform: account.platform, ...data });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            Connect {meta.name}
          </DialogTitle>
          <DialogDescription>{meta.note}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Account / Page Name</Label>
            <Input
              placeholder={`e.g. My Business on ${meta.name}`}
              value={form.account_name}
              onChange={e => setForm({ ...form, account_name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Platform User / Page ID</Label>
            <Input
              placeholder="Unique ID from the platform"
              value={form.platform_user_id}
              onChange={e => setForm({ ...form, platform_user_id: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Profile URL</Label>
            <Input
              placeholder="https://..."
              value={form.profile_url}
              onChange={e => setForm({ ...form, profile_url: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Profile Image URL <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              placeholder="https://..."
              value={form.profile_image_url}
              onChange={e => setForm({ ...form, profile_image_url: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={saving || !form.account_name || !form.platform_user_id}
          >
            {saving ? 'Saving...' : 'Save Connection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}