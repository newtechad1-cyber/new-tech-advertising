import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Play } from 'lucide-react';

const INDUSTRIES = ['general', 'hvac', 'restaurant', 'plumbing', 'contractor', 'retail', 'medical'];
const DEFAULT_STEPS = JSON.stringify(['DemoProblem', 'DemoPlatform', 'DemoFeatures', 'DemoExamples', 'DemoPricing', 'DemoRoi', 'DemoNext']);

export default function AdminDemoMachinePaths() {
  const [paths, setPaths] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', industry: 'general', audience_type: 'small_business_owner', description: '', step_sequence: DEFAULT_STEPS, active: true });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { base44.entities.DemoPaths.list('-created_date').then(setPaths); }, []);

  const handleSave = async () => {
    setSaving(true);
    const r = await base44.entities.DemoPaths.create(form);
    setPaths(p => [r, ...p]);
    setSaving(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminDemoMachine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1"><h1 className="text-2xl font-bold">Demo Paths</h1></div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> New Path</Button>
        </div>

        <div className="space-y-3">
          {paths.map(p => (
            <Card key={p.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    {p.description && <p className="text-slate-400 text-sm mt-1">{p.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">{p.industry}</Badge>
                      <Badge className="bg-slate-200 text-slate-600 text-xs">{p.audience_type?.replace(/_/g,' ')}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!p.active && <Badge className="bg-slate-200 text-slate-500">Inactive</Badge>}
                    <Link to={createPageUrl('DemoStart')} target="_blank">
                      <Button size="sm" variant="ghost" className="text-blue-400"><Play className="w-3 h-3 mr-1" /> Preview</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {paths.length === 0 && <div className="text-center py-16 text-slate-500">No demo paths yet. The default path is built into the demo pages.</div>}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Demo Path</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Path Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. HVAC Owner Path" /></div>
            <div><Label>Industry</Label>
              <Select value={form.industry} onValueChange={v => set('industry', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Audience Type</Label>
              <Select value={form.audience_type} onValueChange={v => set('audience_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small_business_owner">Small Business Owner</SelectItem>
                  <SelectItem value="marketing_manager">Marketing Manager</SelectItem>
                  <SelectItem value="agency_partner">Agency Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} /></div>
            <div><Label>Step Sequence (JSON array of page names)</Label><Textarea value={form.step_sequence} onChange={e => set('step_sequence', e.target.value)} rows={3} className="font-mono text-xs" /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Saving...' : 'Save Path'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}