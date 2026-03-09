import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, Ban, SkipForward, ChevronRight, RefreshCw, Download, Filter } from 'lucide-react';

const STATUS_CONFIG = {
  pass:      { label: 'Pass',      icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-200' },
  fail:      { label: 'Fail',      icon: XCircle,      color: 'bg-red-100 text-red-800 border-red-200' },
  untested:  { label: 'Untested',  icon: Clock,        color: 'bg-gray-100 text-gray-600 border-gray-200' },
  blocked:   { label: 'Blocked',   icon: Ban,          color: 'bg-orange-100 text-orange-800 border-orange-200' },
  skipped:   { label: 'Skipped',   icon: SkipForward,  color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const PRIORITY_COLOR = { P0: 'bg-red-600 text-white', P1: 'bg-orange-500 text-white', P2: 'bg-blue-500 text-white' };

const TEST_GROUPS = [
  'Authentication','Lead Capture','Lead to Deal','Proposal Workflow','Deal Closed Won',
  'Deal Closed Lost','Direct Signup','Reseller Signup','Subscription Billing','Invoice and Payment',
  'Onboarding','Campaign Creation','Content Generation','Content Approval','SEO','Website Project',
  'ADA Audit','Reviews','Support','Analytics','Agent Failure','System Health','Data Isolation','Role Access',
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.untested;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function SummaryBar({ tests }) {
  const counts = tests.reduce((acc, t) => { acc[t.pass_fail_status] = (acc[t.pass_fail_status] || 0) + 1; return acc; }, {});
  const total = tests.length;
  const passRate = total ? Math.round(((counts.pass || 0) / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
      {[
        { label: 'Total', value: total, color: 'bg-slate-50 border-slate-200' },
        { label: 'Pass', value: counts.pass || 0, color: 'bg-green-50 border-green-200' },
        { label: 'Fail', value: counts.fail || 0, color: 'bg-red-50 border-red-200' },
        { label: 'Untested', value: counts.untested || 0, color: 'bg-gray-50 border-gray-200' },
        { label: 'Blocked', value: counts.blocked || 0, color: 'bg-orange-50 border-orange-200' },
        { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 80 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200' },
      ].map(s => (
        <div key={s.label} className={`border rounded-lg p-3 text-center ${s.color}`}>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function TestDetailModal({ test, onClose, onUpdate }) {
  const [status, setStatus] = useState(test.pass_fail_status);
  const [notes, setNotes] = useState(test.notes || '');
  const [failure, setFailure] = useState(test.failure_detail || '');
  const [owner, setOwner] = useState(test.owner || '');

  const handleSave = () => {
    onUpdate(test.id, {
      pass_fail_status: status,
      notes,
      failure_detail: failure,
      owner,
      date_tested: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${PRIORITY_COLOR[test.priority]}`}>{test.priority}</span>
          <span className="text-sm text-gray-400">{test.test_id}</span>
          <span>{test.test_name}</span>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div><span className="text-gray-400 text-xs uppercase tracking-wide">Group</span><p className="font-medium">{test.test_group}</p></div>
          <div><span className="text-gray-400 text-xs uppercase tracking-wide">Role</span><p className="font-medium">{test.role}</p></div>
          <div><span className="text-gray-400 text-xs uppercase tracking-wide">Start Page</span><p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">{test.start_page || '—'}</p></div>
          <div><span className="text-gray-400 text-xs uppercase tracking-wide">Automations</span><p className="font-mono text-xs">{test.automation_keys || '—'}</p></div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Trigger</p>
          <p>{test.trigger}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expected Records Created</p>
            <p className="text-xs">{test.expected_records_created || '—'}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expected Records Updated</p>
            <p className="text-xs">{test.expected_records_updated || '—'}</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Expected Notifications</p>
          <p className="text-xs">{test.expected_notifications || '—'}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Validation Pages</p>
          <p className="text-xs font-mono">{test.validation_pages || '—'}</p>
        </div>

        <hr />

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Status</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(STATUS_CONFIG).map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${status === s ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-current' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          {status === 'fail' && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Failure Detail</label>
              <Input value={failure} onChange={e => setFailure(e.target.value)} placeholder="What broke and where..." />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Owner</label>
            <Input value={owner} onChange={e => setOwner(e.target.value)} placeholder="Your name or email" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Additional context..." />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Result</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminTestMatrix() {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['TestMatrix'],
    queryFn: () => base44.entities.TestMatrix.list('-priority'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TestMatrix.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['TestMatrix'] }),
  });

  const filtered = useMemo(() => {
    return tests.filter(t => {
      if (selectedGroup !== 'all' && t.test_group !== selectedGroup) return false;
      if (selectedStatus !== 'all' && t.pass_fail_status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (search && !`${t.test_id} ${t.test_name} ${t.test_group}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tests, selectedGroup, selectedStatus, selectedPriority, search]);

  // Group by test_group for display
  const grouped = useMemo(() => {
    return filtered.reduce((acc, t) => {
      if (!acc[t.test_group]) acc[t.test_group] = [];
      acc[t.test_group].push(t);
      return acc;
    }, {});
  }, [filtered]);

  const handleUpdate = (id, data) => updateMutation.mutate({ id, data });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading test matrix...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NTA End-to-End Test Matrix</h1>
            <p className="text-sm text-gray-500 mt-0.5">Canonical QA validation — {tests.length} test cases across {TEST_GROUPS.length} groups</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200">
              P0: {tests.filter(t => t.priority === 'P0').length} must-pass
            </Badge>
          </div>
        </div>

        <SummaryBar tests={tests} />

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <Input placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} className="w-56 h-8 text-sm" />
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48 h-8 text-sm"><SelectValue placeholder="All Groups" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {TEST_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(STATUS_CONFIG).map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-28 h-8 text-sm"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="P0">P0</SelectItem>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
            </SelectContent>
          </Select>
          {(selectedGroup !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all' || search) && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-400"
              onClick={() => { setSelectedGroup('all'); setSelectedStatus('all'); setSelectedPriority('all'); setSearch(''); }}>
              Clear
            </Button>
          )}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} of {tests.length} tests</span>
        </div>

        {/* Test Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-gray-400">No tests match current filters</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([group, groupTests]) => {
              const groupPass = groupTests.filter(t => t.pass_fail_status === 'pass').length;
              const groupFail = groupTests.filter(t => t.pass_fail_status === 'fail').length;

              return (
                <div key={group} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-800">{group}</h2>
                      <span className="text-xs text-gray-400">{groupTests.length} tests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {groupFail > 0 && <span className="text-xs text-red-600 font-medium">{groupFail} failing</span>}
                      {groupPass > 0 && <span className="text-xs text-green-600 font-medium">{groupPass} passing</span>}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {groupTests.map(test => (
                      <div key={test.id}
                        className="px-4 py-3 hover:bg-blue-50/30 cursor-pointer transition-colors flex items-center gap-3"
                        onClick={() => setSelectedTest(test)}>
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${PRIORITY_COLOR[test.priority]} shrink-0`}>{test.priority}</span>
                        <span className="text-xs text-gray-400 font-mono w-20 shrink-0">{test.test_id}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{test.test_name}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{test.trigger}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 hidden md:block">{test.role}</span>
                        <StatusBadge status={test.pass_fail_status} />
                        {test.date_tested && <span className="text-xs text-gray-300 hidden lg:block shrink-0">{test.date_tested}</span>}
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <TestDetailModal
            test={selectedTest}
            onClose={() => setSelectedTest(null)}
            onUpdate={handleUpdate}
          />
        </Dialog>
      )}
    </div>
  );
}