import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, ChevronRight, CheckCircle2, XCircle, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const PRIORITY_COLOR = { P0: 'bg-red-600 text-white', P1: 'bg-orange-500 text-white', P2: 'bg-blue-500 text-white' };
const TEST_GROUPS = ['Authentication','Lead Capture','Lead to Deal','Proposal Workflow','Deal Closed Won','Deal Closed Lost','Direct Signup','Reseller Signup','Subscription Billing','Invoice and Payment','Onboarding','Campaign Creation','Content Generation','Content Approval','SEO','Website Project','ADA Audit','Reviews','Support','Analytics','Agent Failure','System Health','Data Isolation','Role Access'];

function TestCaseModal({ tc, onClose, onSave }) {
  const isNew = !tc?.id;
  const [form, setForm] = useState(tc || { test_id: '', name: '', test_group: 'Authentication', priority: 'P1', role: 'admin', status: 'active', is_active: true, trigger: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isNew ? 'New Test Case' : `Edit ${tc.test_id}`}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Test ID</label><Input value={form.test_id} onChange={e => set('test_id', e.target.value)} placeholder="AUTH-001" /></div>
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Priority</label>
            <Select value={form.priority} onValueChange={v => set('priority', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['P0','P1','P2'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Name</label><Input value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Group</label>
            <Select value={form.test_group} onValueChange={v => set('test_group', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TEST_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Role</label><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="admin, client, public..." /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Start Page</label><Input value={form.start_page || ''} onChange={e => set('start_page', e.target.value)} placeholder="/client/billing" /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Trigger</label><textarea value={form.trigger} onChange={e => set('trigger', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Expected Records Created (JSON array)</label><textarea value={form.expected_records_created_json || ''} onChange={e => set('expected_records_created_json', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[50px] resize-none font-mono focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder='["ClientCompanies","ClientSettings"]' /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Expected Records Updated (JSON array)</label><textarea value={form.expected_records_updated_json || ''} onChange={e => set('expected_records_updated_json', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[50px] resize-none font-mono focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder='["ClientCompanies.status = active"]' /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Validation Pages (JSON array)</label><textarea value={form.validation_pages_json || ''} onChange={e => set('validation_pages_json', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[50px] resize-none font-mono focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder='["/admin/billing — company visible"]' /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Owner</label><Input value={form.owner || ''} onChange={e => set('owner', e.target.value)} /></div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Notes</label><textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[50px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="flex items-center gap-2">
          <button onClick={() => set('is_active', !form.is_active)} className="text-gray-400 hover:text-gray-700">
            {form.is_active ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6" />}
          </button>
          <span className="text-sm text-gray-600">{form.is_active ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Test Case</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminQATests() {
  const qc = useQueryClient();
  const [group, setGroup] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [modal, setModal] = useState(null);

  const { data: tests = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });

  const saveMutation = useMutation({
    mutationFn: (form) => form.id ? base44.entities.QATestCases.update(form.id, form) : base44.entities.QATestCases.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['QATestCases'] }); setModal(null); },
  });

  const filtered = useMemo(() => tests.filter(t => {
    if (!showInactive && !t.is_active) return false;
    if (group !== 'all' && t.test_group !== group) return false;
    if (priority !== 'all' && t.priority !== priority) return false;
    if (search && !`${t.test_id} ${t.name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tests, group, priority, search, showInactive]);

  const grouped = useMemo(() => filtered.reduce((acc, t) => {
    if (!acc[t.test_group]) acc[t.test_group] = [];
    acc[t.test_group].push(t);
    return acc;
  }, {}), [filtered]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQATests" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
            <p className="text-sm text-gray-400">{tests.filter(t => t.is_active).length} active · {tests.length} total</p>
          </div>
          <Button onClick={() => setModal({})} className="gap-2"><Plus className="w-4 h-4" /> New Test Case</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-8 text-sm" />
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-48 h-8 text-sm"><SelectValue placeholder="All Groups" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Groups</SelectItem>{TEST_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{['P0','P1','P2'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <button onClick={() => setShowInactive(v => !v)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${showInactive ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-500'}`}>
            Show Inactive
          </button>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} tests</span>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([grp, grpTests]) => (
            <div key={grp} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-2.5 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">{grp}</h2>
                <span className="text-xs text-gray-400">{grpTests.length} tests</span>
              </div>
              <div className="divide-y divide-gray-50">
                {grpTests.map(t => (
                  <div key={t.id} className="px-4 py-3 flex items-center gap-3 hover:bg-blue-50/20 cursor-pointer" onClick={() => setModal(t)}>
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded shrink-0 ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                    <span className="text-xs text-gray-400 font-mono w-20 shrink-0">{t.test_id}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{t.name}</p>
                      <p className="text-xs text-gray-400 truncate">{t.trigger}</p>
                    </div>
                    <span className="text-xs text-gray-400 hidden md:block shrink-0">{t.role}</span>
                    {!t.is_active && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">inactive</span>}
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-16 text-gray-400">No test cases match filters</div>
          )}
        </div>
      </div>

      {modal !== null && (
        <Dialog open onOpenChange={() => setModal(null)}>
          <TestCaseModal tc={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={form => saveMutation.mutate(form)} />
        </Dialog>
      )}
    </div>
  );
}