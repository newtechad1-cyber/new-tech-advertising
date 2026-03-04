import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle } from 'lucide-react';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const INDUSTRIES = [
  'HVAC / Heating & Cooling','Plumbing','Electrical','Roofing','Landscaping / Lawn Care',
  'Auto Repair / Dealership','Restaurant / Food Service','Retail Store','Medical / Dental / Health',
  'Legal Services','Real Estate','Salon / Spa / Beauty','Fitness / Gym','Construction / Contractor',
  'Nonprofit','Other'
];

export default function TrialSignupModal({ open, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', industry: '',
    location_city: '', location_state: '', involvement_preference: 'undecided'
  });

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('createTrialAccount', form);
      const { slug } = res.data;
      onClose();
      navigate(`/TrialSlug?slug=${slug}`);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.name && form.email && form.industry;
  const isStep2Valid = form.location_city && form.location_state;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Start Your 7-Day Free Trial
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">No credit card required. Your account will be ready within 1 business day.</p>
        </DialogHeader>

        <div className="flex gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Business Name *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Johnson HVAC & Plumbing" className="mt-1" />
            </div>
            <div>
              <Label>Your Email *</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@yourbusiness.com" className="mt-1" />
            </div>
            <div>
              <Label>Phone (optional)</Label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="641-555-0100" className="mt-1" />
            </div>
            <div>
              <Label>Industry *</Label>
              <Select value={form.industry} onValueChange={v => set('industry', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select your industry" /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
            >
              Continue →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input value={form.location_city} onChange={e => set('location_city', e.target.value)} placeholder="Mason City" className="mt-1" />
              </div>
              <div>
                <Label>State *</Label>
                <Select value={form.location_state} onValueChange={v => set('location_state', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>How involved do you want to be?</Label>
              <Select value={form.involvement_preference} onValueChange={v => set('involvement_preference', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hands_on">Hands-On — I want to use the tools myself</SelectItem>
                  <SelectItem value="hands_off">Hands-Off — NTA creates content, I approve it</SelectItem>
                  <SelectItem value="undecided">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5"
                disabled={!isStep2Valid || loading}
                onClick={handleSubmit}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating your account...</> : 'Start My Free Trial →'}
              </Button>
            </div>
            <p className="text-xs text-center text-slate-400">No credit card. No auto-billing. Cancel anytime.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}