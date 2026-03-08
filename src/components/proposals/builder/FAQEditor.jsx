import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export default function FAQEditor({ value, onChange }) {
  const items = value || [];

  const add = () => onChange([...items, { question: '', answer: '' }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, val) =>
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">Q{i + 1}</span>
            <Input
              value={item.question}
              onChange={e => update(i, 'question', e.target.value)}
              placeholder="e.g., How long before I see results?"
              className="text-sm"
            />
            <Button
              variant="ghost" size="sm"
              className="text-red-400 hover:text-red-600 h-8 w-8 p-0 shrink-0"
              onClick={() => remove(i)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Textarea
            value={item.answer}
            onChange={e => update(i, 'answer', e.target.value)}
            placeholder="Answer..."
            rows={2}
            className="text-sm resize-none ml-6"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" />Add Question
      </Button>
    </div>
  );
}