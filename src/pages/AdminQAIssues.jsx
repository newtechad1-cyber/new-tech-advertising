import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import QANav from '@/components/qa/QANav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, AlertTriangle, ChevronRight } from 'lucide-react';

const SEVERITY_COLOR = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high:     'bg-orange-100 text-orange-800 border-orange-300',
  medium:   'bg-yellow-100 text-yellow-800 border-yellow-300',
  low:      'bg-gray-100 text-gray-600 border-gray-200',
};
const STATUS_COLOR = {
  open:           'bg-red-50 text-red-700',
  in_progress:    'bg-blue-50 text-blue-700',
  resolved:       'bg-green-50 text-green-700',
  wont_fix:       'bg-gray-100 text-gray-500',
  retest_needed:  'bg-purple-50 text-purple-700',
};

const ISSUE_TYPES = ['automation_failure','data_isolation','ui_bug','api_error','data_integrity','access_control','performance','duplicate_prevention','other'];
const SEVERITIES = ['critical','high','medium','low'];
const PRIORITIES = ['blocker','P0','P1','P2'];
const STATUSES = ['open','in_progress','resolved','wont_fix','retest_needed'];

function IssueModal({ issue, testCases, runs, onClose, onSave }) {
  const isNew = !issue?.id;
  const [form, setForm] = useState(issue || {
    title: '', severity: 'medium', priority: 'P1', status: 'open', issue_type: 'other',
    opened_date: new Date().toISOString().split('T')[0], description: '',
    expected_behavior: '', actual_behavior: '', reproduction_steps: '', assigned_to: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{isNew ? 'New Issue' : `Edit Issue`}</DialogTitle></DialogHeader>
      <div className="space-y-3 text-sm">
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Title</label><Input value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Severity', key: 'severity', opts: SEVERITIES },
            { label: 'Priority', key: 'priority', opts: PRIORITIES },
            { label: 'Status', key: 'status', opts: STATUSES },
            { label: 'Issue Type', key: 'issue_type', opts: ISSUE_TYPES },
          ].map(({ label, key, opts }) => (
            <div key={key}><label className="text-xs text-gray-400 uppercase mb-1 block">{label}</label>
              <Select value={form[key]} onValueChange={v => set(key, v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Page Route</label><Input value={form.page_route || ''} onChange={e => set('page_route', e.target.value)} placeholder="/client/billing" /></div>
          <div><label className="text-gray-400 text-xs uppercase mb-1 block">Entity Name</label><Input value={form.entity_name || ''} onChange={e => set('entity_name', e.target.value)} placeholder="ClientSubscriptions" /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Linked Test Case</label>
          <Select value={form.linked_test_case_id || ''} onValueChange={v => set('linked_test_case_id', v)}>
            <SelectTrigger><SelectValue placeholder="Select test case (optional)..." /></SelectTrigger>
            <SelectContent><SelectItem value={null}>None</SelectItem>{testCases.map(tc => <SelectItem key={tc.id} value={tc.id}>{tc.test_id} — {tc.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Expected Behavior</label><textarea value={form.expected_behavior || ''} onChange={e => set('expected_behavior', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Actual Behavior</label><textarea value={form.actual_behavior || ''} onChange={e => set('actual_behavior', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        </div>
        <div><label className="text-xs text-gray-400 uppercase mb-1 block">Reproduction Steps</label><textarea value={form.reproduction_steps || ''} onChange={e => set('reproduction_steps', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Assigned To</label><Input value={form.assigned_to || ''} onChange={e => set('assigned_to', e.target.value)} /></div>
          {form.status === 'resolved' && (
            <div><label className="text-xs text-gray-400 uppercase mb-1 block">Resolved Date</label><Input type="date" value={form.resolved_date || ''} onChange={e => set('resolved_date', e.target.value)} /></div>
          )}
        </div>
        {form.status === 'resolved' && (
          <div><label className="text-xs text-gray-400 uppercase mb-1 block">Resolution Notes</label><textarea value={form.resolution_notes || ''} onChange={e => set('resolution_notes', e.target.value)} className="w-full border rounded px-3 py-2 text-sm min-h-[50px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" /></div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Issue</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminQAIssues() {
  const qc = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const { data: issues = [] } = useQuery({ queryKey: ['QAIssues'], queryFn: () => base44.entities.QAIssues.list('-opened_date') });
  const { data: testCases = [] } = useQuery({ queryKey: ['QATestCases'], queryFn: () => base44.entities.QATestCases.list() });
  const { data: runs = [] } = useQuery({ queryKey: ['QATestRuns'], queryFn: () => base44.entities.QATestRuns.list('-started_at') });

  const saveMutation = useMutation({
    mutationFn: form => form.id ? base44.entities.QAIssues.update(form.id, form) : base44.entities.QAIssues.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['QAIssues'] }); setModal(null); },
  });

  const tcMap = useMemo(() => Object.fromEntries(testCases.map(t => [t.id, t])), [testCases]);

  const filtered = useMemo(() => issues.filter(i => {
    if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (typeFilter !== 'all' && i.issue_type !== typeFilter) return false;
    if (search && !`${i.title} ${i.page_route || ''} ${i.entity_name || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [issues, severityFilter, statusFilter, typeFilter, search]);

  const openCritical = issues.filter(i => i.status === 'open' && i.severity === 'critical').length;
  const openBlockers = issues.filter(i => i.status === 'open' && i.priority === 'blocker').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <QANav current="AdminQAIssues" />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400">{issues.filter(i => i.status === 'open').length} open</span>
              {openCritical > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{openCritical} critical</span>}
              {openBlockers > 0 && <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded-full font-bold">{openBlockers} blockers</span>}
            </div>
          </div>
          <Button onClick={() => setModal({})} className="gap-2"><Plus className="w-4 h-4" /> New Issue</Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-8 text-sm" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Statuses</SelectItem>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Severity</SelectItem>{SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Types</SelectItem>{ISSUE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} issues</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No issues match filters</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(issue => {
                const tc = tcMap[issue.linked_test_case_id];
                return (
                  <div key={issue.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer" onClick={() => setModal(issue)}>
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${SEVERITY_COLOR[issue.severity]}`}>{issue.severity}</span>
                      {issue.priority === 'blocker' && <span className="text-xs px-1.5 py-0.5 rounded bg-red-700 text-white font-bold text-center">BLOCKER</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {issue.page_route && <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{issue.page_route}</span>}
                        {issue.entity_name && <span className="text-xs text-gray-400">{issue.entity_name}</span>}
                        {issue.issue_type && <span className="text-xs text-gray-400">{issue.issue_type}</span>}
                        {tc && <span className="text-xs text-gray-400">→ {tc.test_id}</span>}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[issue.status]}`}>{issue.status}</span>
                    <span className="text-xs text-gray-300 hidden md:block shrink-0">{issue.opened_date}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal !== null && (
        <Dialog open onOpenChange={() => setModal(null)}>
          <IssueModal issue={modal?.id ? modal : null} testCases={testCases} runs={runs} onClose={() => setModal(null)} onSave={form => saveMutation.mutate(form)} />
        </Dialog>
      )}
    </div>
  );
}