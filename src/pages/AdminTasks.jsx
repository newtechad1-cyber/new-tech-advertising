import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, Plus, Calendar, AlertCircle, Search, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AddTaskModal from '@/components/pipeline/AddTaskModal';

const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SalesTasks.list('-created_date', 300);
    setTasks(data);
    setLoading(false);
  };

  const completeTask = async (task) => {
    await base44.entities.SalesTasks.update(task.id, { status: 'completed' });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
    toast.success('Task completed ✓');
  };

  const cancelTask = async (task) => {
    await base44.entities.SalesTasks.update(task.id, { status: 'cancelled' });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'cancelled' } : t));
    toast.success('Task cancelled');
  };

  const now = new Date();

  const isOverdue = (t) => t.status === 'pending' && t.due_date && new Date(t.due_date) < now;

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending' && !isOverdue(t);
    if (filter === 'overdue') return isOverdue(t);
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'all') return t.status !== 'cancelled';
    return true;
  }).filter(t =>
    !search || [t.task_title, t.company_name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const overdueCnt = tasks.filter(isOverdue).length;
  const pendingCnt = tasks.filter(t => t.status === 'pending').length;
  const todayCnt = tasks.filter(t => {
    if (t.status !== 'pending' || !t.due_date) return false;
    return new Date(t.due_date).toDateString() === now.toDateString();
  }).length;
  const completedCnt = tasks.filter(t => t.status === 'completed').length;

  const FILTERS = [
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: overdueCnt > 0 ? `Overdue (${overdueCnt})` : 'Overdue' },
    { value: 'completed', label: 'Completed' },
    { value: 'all', label: 'All' },
  ];

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Follow-Up Tasks</h1>
              <p className="text-sm text-slate-500">
                {pendingCnt} pending · <span className={overdueCnt > 0 ? 'text-red-600 font-semibold' : ''}>{overdueCnt} overdue</span> · {todayCnt} due today
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
              </Button>
              <Link to={createPageUrl('ProposalPipeline')}>
                <Button variant="outline" size="sm">Pipeline →</Button>
              </Link>
              <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4" />New Task
              </Button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Pending', value: pendingCnt, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Due Today', value: todayCnt, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Overdue', value: overdueCnt, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Completed', value: completedCnt, color: 'text-green-600', bg: 'bg-green-50' },
              ].map(s => (
                <Card key={s.label} className={`p-4 text-center ${s.bg} border-0`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Filters + Search */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex gap-1 bg-white border rounded-lg p-1 shadow-sm">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      filter === f.value
                        ? f.value === 'overdue' ? 'bg-red-600 text-white' : 'bg-violet-600 text-white'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks or company..." className="pl-9" />
              </div>
            </div>

            {/* Task list */}
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No tasks in this view</p>
                <p className="text-slate-400 text-sm mt-1">
                  {filter === 'overdue' ? 'No overdue tasks — great work!' : 'Create a task to get started'}
                </p>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />New Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(task => {
                  const overdueTask = isOverdue(task);
                  return (
                    <div
                      key={task.id}
                      className={`bg-white border rounded-xl p-4 flex items-start gap-4 transition-shadow hover:shadow-sm ${overdueTask ? 'border-red-200' : 'border-slate-200'}`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <button onClick={() => completeTask(task)} className="shrink-0 mt-0.5 hover:scale-110 transition-transform">
                          <Circle className="w-5 h-5 text-slate-300 hover:text-green-500" />
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.task_title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
                          {task.company_name && (
                            <span className="text-xs text-slate-500">🏢 {task.company_name}</span>
                          )}
                          {task.due_date && (
                            <span className={`text-xs flex items-center gap-1 ${overdueTask ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                              {overdueTask && <AlertCircle className="w-3 h-3" />}
                              <Calendar className="w-3 h-3" />
                              {format(new Date(task.due_date), 'MMM d, yyyy')}
                              {overdueTask && ' — OVERDUE'}
                            </span>
                          )}
                        </div>
                        {task.notes && <p className="text-xs text-slate-500 mt-1.5 truncate">{task.notes}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {task.proposal_id && (
                          <Link to={createPageUrl(`ProposalDetail?id=${task.proposal_id}`)}>
                            <Button size="sm" variant="outline" className="text-xs">Proposal →</Button>
                          </Link>
                        )}
                        {task.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => completeTask(task)}
                            >
                              Done ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => cancelTask(task)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {showAddModal && (
          <AddTaskModal
            onClose={() => setShowAddModal(false)}
            onSaved={() => { setShowAddModal(false); load(); }}
          />
        )}
      </AdminNav>
    </AdminGuard>
  );
}