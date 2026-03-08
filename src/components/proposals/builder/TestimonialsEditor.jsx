import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export default function TestimonialsEditor({ value, onChange }) {
  const items = value || [];

  const add = () => onChange([...items, { name: '', company: '', role: '', quote: '' }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) =>
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                value={item.name}
                onChange={e => update(i, 'name', e.target.value)}
                placeholder="Client name"
                className="text-sm"
              />
              <Input
                value={item.company}
                onChange={e => update(i, 'company', e.target.value)}
                placeholder="Business name"
                className="text-sm"
              />
              <Input
                value={item.role}
                onChange={e => update(i, 'role', e.target.value)}
                placeholder="Role / Industry"
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
          <Textarea
            value={item.quote}
            onChange={e => update(i, 'quote', e.target.value)}
            placeholder="What they said about working with NTA..."
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" />Add Testimonial
      </Button>
    </div>
  );
}