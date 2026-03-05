import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function OnboardingStep2({ data, onChange }) {
  const f = (key) => ({
    value: data[key] || '',
    onChange: (e) => onChange({ ...data, [key]: e.target.value }),
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City *</Label>
          <Input placeholder="e.g. Columbus" {...f('city')} className="mt-1" />
        </div>
        <div>
          <Label>State *</Label>
          <select
            value={data.state || ''}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Select state…</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label>Service Area Description</Label>
        <Input placeholder="e.g. Greater Columbus area, within 30 miles" {...f('service_area')} className="mt-1" />
      </div>
    </div>
  );
}