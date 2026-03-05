import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingStep1({ data, onChange }) {
  const f = (key) => ({
    value: data[key] || '',
    onChange: (e) => onChange({ ...data, [key]: e.target.value }),
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Business Name *</Label>
        <Input placeholder="e.g. Smith Plumbing Co." {...f('business_name')} className="mt-1" />
      </div>
      <div>
        <Label>Business Type *</Label>
        <Input placeholder="e.g. Plumbing, HVAC, Law Firm" {...f('business_type')} className="mt-1" />
      </div>
      <div>
        <Label>Website URL</Label>
        <Input placeholder="https://yourbusiness.com" {...f('website_url')} className="mt-1" />
      </div>
      <div>
        <Label>Phone</Label>
        <Input placeholder="(555) 000-0000" {...f('phone')} className="mt-1" />
      </div>
      <div>
        <Label>Email *</Label>
        <Input placeholder="contact@yourbusiness.com" type="email" {...f('email')} className="mt-1" />
      </div>
    </div>
  );
}