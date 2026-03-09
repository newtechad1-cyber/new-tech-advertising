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
import { ArrowLeft, Plus, FileText } from 'lucide-react';

const TEMPLATE_TYPES = ['sales_demo','feature_explainer','industry_promo','offer_ad','onboarding','case_study','support','social_post_video'];
const INDUSTRIES = ['HVAC','Restaurant','Plumbing','Contractor','Dental','Med Spa','Roofing','Retail','General','All'];

const TYPE_COLORS = {
  sales_demo: 'bg-blue-100 text-blue-700', feature_explainer: 'bg-purple-100 text-purple-700',
  industry_promo: 'bg-green-100 text-green-700', offer_ad: 'bg-orange-100 text-orange-700',
  onboarding: 'bg-cyan-100 text-cyan-700', case_study: 'bg-yellow-100 text-yellow-700',
  support: 'bg-slate-100 text-slate-600', social_post_video: 'bg-pink-100 text-pink-700',
};

export default function AdminVideoEngineTemplates() {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', template_type: 'feature_explainer', industry: 'General', goal: '', script_template: '', cta_template: '', default_duration: '2 minutes', default_orientation: 'landscape', active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.VideoTemplates.list('-created_date').then(setTemplates);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const record = await base44.entities.VideoTemplates.create(form);
    setTemplates(prev => [record, ...prev]);
    setSaving(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Video Templates</h1>
            <p className="text-slate-400 text-sm mt-0.5">Reusable script and scene templates for recurring video types</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> New Template</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {templates.map(t => (
            <Card key={t.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-white">{t.name}</div>
                  <Badge className={`text-xs ${TYPE_COLORS[t.template_type] || 'bg-slate-100 text-slate-600'}`}>{t.template_type?.replace(/_/g, ' ')}</Badge>
                </div>
                {t.goal && <p className="text-xs text-slate-400 mb-2">{t.goal}</p>}
                <div className="flex gap-2 flex-wrap text-xs text-slate-500">
                  {t.industry && <span>{t.industry}</span>}
                  {t.default_duration && <span>· {t.default_duration}</span>}
                  {t.default_orientation && <span>· {t.default_orientation}</span>}
                </div>
                {!t.active && <Badge className="mt-2 text-xs bg-slate-200 text-slate-500">Inactive</Badge>}
              </CardContent>
            </Card>
          ))}
          {templates.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No templates yet. Create your first one.
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Video Template</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2"><Label>Template Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.template_type} onValueChange={v => set('template_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TEMPLATE_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={v => set('industry', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Default Duration</Label><Input value={form.default_duration} onChange={e => set('default_duration', e.target.value)} /></div>
            <div>
              <Label>Default Orientation</Label>
              <Select value={form.default_orientation} onValueChange={v => set('default_orientation', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>Goal</Label><Input value={form.goal} onChange={e => set('goal', e.target.value)} /></div>
            <div className="col-span-2"><Label>Script Template</Label><Textarea value={form.script_template} onChange={e => set('script_template', e.target.value)} rows={4} placeholder="Paste script template here..." /></div>
            <div className="col-span-2"><Label>CTA Template</Label><Input value={form.cta_template} onChange={e => set('cta_template', e.target.value)} /></div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Saving...' : 'Save Template'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}