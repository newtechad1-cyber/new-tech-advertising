import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Plus, X } from 'lucide-react';

export default function GlobalSettings() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({
    business_name: '',
    site_url: '',
    phone: '',
    cta: '',
    brand_voice: '',
    service_areas: [],
    offers: []
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newArea, setNewArea] = useState('');
  const [newOffer, setNewOffer] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const records = await base44.entities.Settings.list();
      if (records.length > 0) {
        setRecord(records[0]);
        setForm({
          business_name: records[0].business_name || '',
          site_url: records[0].site_url || '',
          phone: records[0].phone || '',
          cta: records[0].cta || '',
          brand_voice: records[0].brand_voice || '',
          service_areas: records[0].service_areas || [],
          offers: records[0].offers || []
        });
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.business_name || !form.site_url) {
      toast.error('Business name and site URL are required');
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      // Enforce single-record: re-fetch to get latest ID before saving
      const latest = await base44.entities.Settings.list();
      if (latest.length > 0) {
        await base44.entities.Settings.update(latest[0].id, form);
        setRecord(latest[0]);
        // Delete any duplicate records beyond the first
        for (let i = 1; i < latest.length; i++) {
          await base44.entities.Settings.delete(latest[i].id);
        }
      } else {
        const created = await base44.entities.Settings.create(form);
        setRecord(created);
      }
      setSaved(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('[GlobalSettings] Save failed:', err);
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field, value, setter) => {
    if (!value.trim()) return;
    setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const removeItem = (field, index) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Global Business Settings</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-slate-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Settings saved successfully! AI automations will use these values.
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Business Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Business Name <span className="text-red-500">*</span></Label>
            <Input value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} placeholder="e.g. Acme Digital Marketing" />
          </div>
          <div className="space-y-1">
            <Label>Site URL <span className="text-red-500">*</span></Label>
            <Input value={form.site_url} onChange={e => setForm({ ...form, site_url: e.target.value })} placeholder="https://example.com" />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" />
          </div>
          <div className="space-y-1">
            <Label>Call to Action</Label>
            <Input value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} placeholder="e.g. Get a Free Audit" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Brand Voice</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={form.brand_voice}
            onChange={e => setForm({ ...form, brand_voice: e.target.value })}
            placeholder="Describe your brand's tone, style, and communication guidelines for AI content generation..."
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Service Areas</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={newArea} onChange={e => setNewArea(e.target.value)} placeholder="Add a city or region" onKeyDown={e => e.key === 'Enter' && addItem('service_areas', newArea, setNewArea)} />
            <Button variant="outline" size="icon" onClick={() => addItem('service_areas', newArea, setNewArea)}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.service_areas.map((area, i) => (
              <span key={i} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                {area}
                <button onClick={() => removeItem('service_areas', i)}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Offers & Promotions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={newOffer} onChange={e => setNewOffer(e.target.value)} placeholder="e.g. Free website audit" onKeyDown={e => e.key === 'Enter' && addItem('offers', newOffer, setNewOffer)} />
            <Button variant="outline" size="icon" onClick={() => addItem('offers', newOffer, setNewOffer)}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-2">
            {form.offers.map((offer, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                {offer}
                <button onClick={() => removeItem('offers', i)}><X className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}