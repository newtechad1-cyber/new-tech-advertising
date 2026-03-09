import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Palette } from 'lucide-react';

export default function AdminVideoEngineBrands() {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', owner_type: 'nta', tagline: '', primary_color: '#0a0a0a', secondary_color: '#3b82f6', accent_color: '#f59e0b', active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.BrandProfiles.list('-created_date').then(setProfiles);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const record = await base44.entities.BrandProfiles.create(form);
    setProfiles(prev => [record, ...prev]);
    setSaving(false);
    setShowModal(false);
    setForm({ name: '', owner_type: 'nta', tagline: '', primary_color: '#0a0a0a', secondary_color: '#3b82f6', accent_color: '#f59e0b', active: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Brand Profiles</h1>
            <p className="text-slate-400 text-sm mt-0.5">Visual identity packages for NTA and client videos</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> New Profile</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profiles.map(p => (
            <Card key={p.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    {p.tagline && <div className="text-xs text-slate-400 mt-0.5">{p.tagline}</div>}
                  </div>
                  <Badge className={p.owner_type === 'nta' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>{p.owner_type}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  {[p.primary_color, p.secondary_color, p.accent_color].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
                {!p.active && <Badge className="mt-2 bg-slate-200 text-slate-500">Inactive</Badge>}
              </CardContent>
            </Card>
          ))}
          {profiles.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-500">
              <Palette className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No brand profiles yet. Create your first one.
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Brand Profile</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Profile Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. NTA Master Brand" /></div>
            <div>
              <Label>Owner Type</Label>
              <Select value={form.owner_type} onValueChange={v => set('owner_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="nta">NTA</SelectItem><SelectItem value="client">Client</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Tagline</Label><Input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="AI Marketing Built for Small Businesses" /></div>
            <div className="grid grid-cols-3 gap-3">
              {[['Primary Color', 'primary_color'], ['Secondary Color', 'secondary_color'], ['Accent Color', 'accent_color']].map(([label, key]) => (
                <div key={key}><Label className="text-xs">{label}</Label><Input type="color" value={form[key]} onChange={e => set(key, e.target.value)} className="h-10 cursor-pointer" /></div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}