import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

const ICONS = ['✅', '🎯', '📺', '🌐', '📱', '📊', '🎬', '📧', '🔍', '📍', '💡', '🛡️', '🚀', '⭐', '🏆'];

export default function DeliverablesEditor({ value, onChange }) {
  const items = value || [];

  const add = () => onChange([...items, { icon: '✅', title: '', description: '' }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) =>
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 items-start">
          <select
            value={item.icon}
            onChange={e => update(i, 'icon', e.target.value)}
            className="border border-slate-200 rounded px-1 py-2 text-base bg-white shrink-0 w-14"
          >
            {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              value={item.title}
              onChange={e => update(i, 'title', e.target.value)}
              placeholder="Deliverable title (e.g., Streaming TV Ad Setup)"
              className="text-sm"
            />
            <Input
              value={item.description}
              onChange={e => update(i, 'description', e.target.value)}
              placeholder="Short description"
              className="text-sm"
            />
          </div>
          <Button
            variant="ghost" size="sm"
            className="text-red-400 hover:text-red-600 h-8 w-8 p-0 shrink-0"
            onClick={() => remove(i)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" />Add Deliverable
      </Button>
    </div>
  );
}