import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, RefreshCw, CheckCircle2, Clock, AlertCircle, Unlink, Link2 } from 'lucide-react';

const CONNECTOR_ID = "6a5803ed18a980baf5370db9";

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  sent: 'bg-blue-900/40 text-blue-400',
  viewed: 'bg-purple-900/40 text-purple-400',
  paid: 'bg-emerald-900/40 text-emerald-400',
  partial: 'bg-amber-900/40 text-amber-400',
  overdue: 'bg-red-900/40 text-red-400',
};

export default function FreshBooksInvoicing() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [form, setForm] = useState({
    clientid: '',
    task_ids: [],
    due_date: '',
    notes: '',
  });

  const fetchData = async () => {
    setErrorMsg(null);
    try {
      const [invRes, cliRes] = await Promise.all([
        base44.functions.invoke('freshbooksInvoices', { _method: 'GET' }),
        base44.functions.invoke('freshbooksClients', { _method: 'GET' }),
      ]);
      setInvoices(invRes.data?.invoices || []);
      setClients(cliRes.data?.clients || []);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        // Load completed marketing tasks
        const taskList = await base44.entities.NTATask.filter({ status: 'done' }, '-updated_date', 100);
        setTasks(taskList);
        await fetchData();
      }
      setLoading(false);
    });
  }, []);

  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        fetchData();
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    setConnected(false);
    setInvoices([]);
    setClients([]);
  };

  const toggleTaskSelection = (taskId) => {
    setForm(prev => ({
      ...prev,
      task_ids: prev.task_ids.includes(taskId)
        ? prev.task_ids.filter(id => id !== taskId)
        : [...prev.task_ids, taskId]
    }));
  };

  const handleGenerateInvoice = async () => {
    if (!form.clientid) { setErrorMsg('Please select a client.'); return; }
    if (form.task_ids.length === 0) { setErrorMsg('Select at least one completed task.'); return; }
    setErrorMsg(null);
    setGenerating(true);
    try {
      const selectedTasks = tasks.filter(t => form.task_ids.includes(t.id));
      const lines = selectedTasks.map(t => ({
        type: { code: 0 },
        description: t.title + (t.description ? ` — ${t.description}` : ''),
        qty: "1",
        unit_cost: { amount: "0", code: "USD" },
      }));

      const invoicePayload = {
        _method: 'POST',
        customerid: parseInt(form.clientid),
        due_offset_days: 14,
        notes: form.notes || `Invoice for completed marketing tasks: ${selectedTasks.map(t => t.title).join(', ')}`,
        lines,
      };
      if (form.due_date) invoicePayload.due_date = form.due_date;

      await base44.functions.invoke('freshbooksInvoices', invoicePayload);
      setSuccessMsg('Invoice created successfully in FreshBooks!');
      setShowForm(false);
      setForm({ clientid: '', task_ids: [], due_date: '', notes: '' });
      await fetchData();
    } catch (e) {
      setErrorMsg('Failed to create invoice: ' + (e?.message || 'Unknown error'));
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Please log in to access FreshBooks Invoicing.</p>
          <Button onClick={() => base44.auth.redirectToLogin()}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FreshBooks Invoicing</h1>
            <p className="text-sm text-slate-400">Generate invoices for completed marketing tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Badge className="bg-emerald-900/40 text-emerald-400 border-emerald-700 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </Badge>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400 text-xs" onClick={handleDisconnect}>
                <Unlink className="w-3 h-3 mr-1" /> Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConnect}>
              <Link2 className="w-4 h-4 mr-2" /> Connect FreshBooks
            </Button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700 rounded-xl px-4 py-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
          <button className="ml-auto text-emerald-600 hover:text-emerald-400" onClick={() => setSuccessMsg(null)}>✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
          <button className="ml-auto text-red-600 hover:text-red-400" onClick={() => setErrorMsg(null)}>✕</button>
        </div>
      )}

      {!connected ? (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-300">Connect Your FreshBooks Account</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Link your FreshBooks account to generate invoices directly from completed marketing tasks in the NTA platform.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConnect}>
            <Link2 className="w-4 h-4 mr-2" /> Connect FreshBooks
          </Button>
        </div>
      ) : (
        <>
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-200">Invoices ({invoices.length})</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white" onClick={fetchData}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setShowForm(!showForm); setErrorMsg(null); }}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> New Invoice from Tasks
              </Button>
            </div>
          </div>

          {/* Invoice Form */}
          {showForm && (
            <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 space-y-5">
              <h3 className="font-semibold text-white">Create Invoice from Completed Tasks</h3>

              {/* Client select */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">FreshBooks Client *</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  value={form.clientid}
                  onChange={e => setForm(f => ({ ...f, clientid: e.target.value }))}
                >
                  <option value="">— Select a client —</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.organization || `${c.fname || ''} ${c.lname || ''}`.trim() || `Client #${c.id}`}</option>
                  ))}
                </select>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Due Date (optional)</label>
                <input
                  type="date"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full"
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes (optional)</label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Invoice notes or payment instructions…"
                />
              </div>

              {/* Task selection */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Completed Tasks to Invoice * ({form.task_ids.length} selected)</label>
                {tasks.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No completed tasks found.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {tasks.map(task => (
                      <label key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.task_ids.includes(task.id) ? 'bg-blue-900/20 border-blue-600/40' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                        <input
                          type="checkbox"
                          checked={form.task_ids.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className="accent-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{task.title}</p>
                          {task.description && <p className="text-xs text-slate-400 truncate">{task.description}</p>}
                        </div>
                        <Badge className="text-xs bg-emerald-900/30 text-emerald-400 border-emerald-800 shrink-0">Done</Badge>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1" onClick={handleGenerateInvoice} disabled={generating}>
                  {generating ? 'Generating…' : 'Generate Invoice in FreshBooks'}
                </Button>
                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Invoice List */}
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No invoices found. Create your first invoice from completed marketing tasks.</p>
              </div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Invoice #{inv.invoice_number || inv.id}</p>
                      <p className="text-xs text-slate-400">{inv.organization || inv.fname || 'Client'} · Due: {inv.due_date || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">${parseFloat(inv.amount?.amount || 0).toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[inv.v3_status] || STATUS_COLORS.draft}`}>
                      {inv.v3_status || 'draft'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}