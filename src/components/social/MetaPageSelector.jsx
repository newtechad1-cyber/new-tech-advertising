import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function MetaPageSelector({ open, accountId, pages, onClose, onSelected }) {
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async () => {
    if (!selectedPageId) return;
    setSaving(true);
    setError('');
    const res = await base44.functions.invoke('selectMetaPage', { accountId, pageId: selectedPageId });
    setSaving(false);
    if (res.data?.success) {
      onSelected(res.data);
    } else {
      setError(res.data?.error || 'Failed to select page');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Facebook Page</DialogTitle>
          <DialogDescription>Choose which page to use for auto-posting.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setSelectedPageId(page.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                selectedPageId === page.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="font-medium text-slate-800">{page.name}</p>
                {page.category && <p className="text-xs text-slate-500">{page.category}</p>}
              </div>
              {selectedPageId === page.id && <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button className="flex-1" onClick={handleSelect} disabled={!selectedPageId || saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Connect This Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}