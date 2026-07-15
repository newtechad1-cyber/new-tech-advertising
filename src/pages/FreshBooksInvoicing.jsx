import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, RefreshCw, CheckCircle2, Clock, AlertCircle, Unlink, Link2, Eye, X, ArrowRight } from 'lucide-react';

const CONNECTOR_ID = "6a5803ed18a980baf5370db9";

export default function FreshBooksInvoicing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Connection Status
  const [status, setStatus] = useState({
    connected: false,
    business_name: '',
    last_sync: '',
    error: null
  });

  // Data
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [audits, setAudits] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [form, setForm] = useState({
    clientid: '',
    due_date: '',
    notes: '',
    selected_tasks: [],
    selected_audits: [],
    selected_subscriptions: [],
    manual_lines: []
  });

  const fetchStatus = async () => {
    try {
      const res = await base44.functions.invoke('freshbooksStatus', {});
      setStatus({
        connected: res.data?.connected || false,
        business_name: res.data?.business_name || '',
        last_sync: res.data?.last_sync || '',
        error: res.data?.error || null
      });
      return res.data?.connected;
    } catch (e) {
      setStatus(prev => ({ ...prev, connected: false, error: e.message }));
      return false;
    }
  };

  const fetchData = async () => {
    setErrorMsg(null);
    try {
      const isConnected = await fetchStatus();
      if (!isConnected) return;

      const cliRes = await base44.functions.invoke('freshbooksClients', { _method: 'GET' });
      setClients(cliRes.data?.clients || []);

      const [taskList, auditList, subList] = await Promise.all([
        base44.entities.NTATask.filter({ status: 'done', billing_status: { $ne: 'billed' } }, '-updated_date', 100),
        base44.entities.GapAudit.filter({ status: 'completed', billing_status: { $ne: 'billed' } }, '-created_date', 100),
        base44.entities.ClientSubscriptions.filter({ billing_status: { $ne: 'billed' } }, '-created_date', 100)
      ]);
      setTasks(taskList);
      setAudits(auditList);
      setSubscriptions(subList);

    } catch (e) {
      setErrorMsg('Failed to load data: ' + e.message);
    }
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        await fetchData();
      }
      setLoading(false);
    });
  }, []);

  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank', 'width=600,height=700');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        fetchData();
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    await fetchStatus();
  };

  const toggleSelection = (listKey, id) => {
    setForm(prev => ({
      ...prev,
      [listKey]: prev[listKey].includes(id)
        ? prev[listKey].filter(i => i !== id)
        : [...prev[listKey], id]
    }));
  };

  const addManualLine = () => {
    setForm(prev => ({
      ...prev,
      manual_lines: [...prev.manual_lines, { name: '', description: '', qty: 1, rate: 0, taxName1: '', taxAmount1: 0 }]
    }));
  };

  const updateManualLine = (index, field, value) => {
    const newLines = [...form.manual_lines];
    newLines[index][field] = value;
    setForm(prev => ({ ...prev, manual_lines: newLines }));
  };

  const removeManualLine = (index) => {
    const newLines = [...form.manual_lines];
    newLines.splice(index, 1);
    setForm(prev => ({ ...prev, manual_lines: newLines }));
  };

  const getGeneratedLines = () => {
    const lines = [];

    tasks.filter(t => form.selected_tasks.includes(t.id)).forEach(t => {
      lines.push({
        type: { code: 0 },
        name: "Marketing Task",
        description: t.title + (t.description ? ` - ${t.description}` : ''),
        qty: "1",
        unit_cost: { amount: "0.00", code: "USD" },
        _source: { type: 'NTATask', id: t.id }
      });
    });

    audits.filter(a => form.selected_audits.includes(a.id)).forEach(a => {
      lines.push({
        type: { code: 0 },
        name: "Gap Audit",
        description: `Website Gap Audit for ${a.business_name || a.website_url}`,
        qty: "1",
        unit_cost: { amount: "199.00", code: "USD" },
        _source: { type: 'GapAudit', id: a.id }
      });
    });

    subscriptions.filter(s => form.selected_subscriptions.includes(s.id)).forEach(s => {
      lines.push({
        type: { code: 0 },
        name: "Recurring Service",
        description: `${s.plan_name || 'Service Plan'} (${s.billing_interval})`,
        qty: "1",
        unit_cost: { amount: (s.amount || 0).toFixed(2), code: "USD" },
        _source: { type: 'ClientSubscriptions', id: s.id }
      });
    });

    form.manual_lines.forEach(m => {
      if (!m.name) return;
      const line = {
        type: { code: 0 },
        name: m.name,
        description: m.description,
        qty: String(m.qty || 1),
        unit_cost: { amount: Number(m.rate || 0).toFixed(2), code: "USD" }
      };
      if (m.taxName1 && m.taxAmount1) {
        line.taxName1 = m.taxName1;
        line.taxAmount1 = String(m.taxAmount1);
      }
      lines.push(line);
    });

    return lines;
  };

  const calculateTotal = (lines) => {
    return lines.reduce((acc, l) => {
      const lineTotal = Number(l.qty) * Number(l.unit_cost.amount);
      let tax = 0;
      if (l.taxAmount1) tax = lineTotal * (Number(l.taxAmount1) / 100);
      return acc + lineTotal + tax;
    }, 0);
  };

  const handlePreview = () => {
    if (!form.clientid) { setErrorMsg('Please select a client.'); return; }
    const lines = getGeneratedLines();
    if (lines.length === 0) { setErrorMsg('Select at least one item to invoice or add a manual line.'); return; }
    setErrorMsg(null);
    setPreviewMode(true);
  };

  const handleCreateDraft = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      const lines = getGeneratedLines();
      
      const invoicePayload = {
        _method: 'POST',
        customerid: parseInt(form.clientid),
        create_date: new Date().toISOString().split('T')[0],
        status: 1, // 1 = draft in FreshBooks usually
        due_offset_days: 14,
        notes: form.notes,
        lines: lines.map(({ _source, ...l }) => l),
      };
      if (form.due_date) invoicePayload.due_date = form.due_date;

      const invRes = await base44.functions.invoke('freshbooksInvoices', invoicePayload);
      const invoiceData = invRes.data?.invoice || invRes.data;
      
      if (!invoiceData || !invoiceData.id) {
         throw new Error("Did not receive a valid invoice ID from FreshBooks");
      }

      const fbId = String(invoiceData.id);
      const fbNumber = String(invoiceData.invoice_number || fbId);
      const billedDate = new Date().toISOString();

      // Mark source items as billed
      for (const line of lines) {
        if (!line._source) continue;
        const { type, id } = line._source;
        await base44.entities[type].update(id, {
          billing_status: 'billed',
          freshbooks_invoice_id: fbId,
          freshbooks_invoice_number: fbNumber,
          billed_date: billedDate
        });
      }

      setSuccessMsg(`Draft Invoice #${fbNumber} created successfully in FreshBooks!`);
      setPreviewMode(false);
      setShowForm(false);
      setForm({ clientid: '', selected_tasks: [], selected_audits: [], selected_subscriptions: [], manual_lines: [], due_date: '', notes: '' });
      await fetchData();
    } catch (e) {
      setErrorMsg('Failed to create draft invoice: ' + (e?.message || 'Unknown error'));
    }
    setGenerating(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin" /></div>;
  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Button onClick={() => base44.auth.redirectToLogin()}>Log In</Button></div>;

  const linesToPreview = previewMode ? getGeneratedLines() : [];
  const previewClient = clients.find(c => String(c.id) === String(form.clientid));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">FreshBooks Invoicing</h1>
          <p className="text-sm text-slate-400">Generate draft invoices from platform activity</p>
        </div>
      </div>

      {/* Integration Status Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Integration Status</h2>
            {status.connected ? (
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <p>Connected Business: <span className="text-white font-medium">{status.business_name || 'Unknown'}</span></p>
                <p className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active</p>
                {status.last_sync && <p>Last Sync: {new Date(status.last_sync).toLocaleString()}</p>}
                {status.error && <p className="text-red-400">Last Error: {status.error}</p>}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">Not connected to FreshBooks</p>
            )}
          </div>
          <div>
            {status.connected ? (
               <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleDisconnect}>
                 Disconnect
               </Button>
            ) : (
               <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConnect}>
                 <Link2 className="w-4 h-4 mr-2" /> Connect FreshBooks
               </Button>
            )}
          </div>
        </div>
      </div>

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

      {status.connected && !showForm && !previewMode && (
         <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
         </div>
      )}

      {/* Builder Form */}
      {status.connected && showForm && !previewMode && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
             <h3 className="font-semibold text-lg text-white">Invoice Builder</h3>
             <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">FreshBooks Client *</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={form.clientid}
                  onChange={e => setForm(f => ({ ...f, clientid: e.target.value }))}
                >
                  <option value="">— Select a client —</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.organization || `${c.fname || ''} ${c.lname || ''}`.trim()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date (optional)</label>
                <input
                  type="date"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white [color-scheme:dark]"
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes (optional)</label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Will appear on the invoice..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-medium text-slate-400">Billable Items</label>
              
              {/* Unbilled Tasks */}
              <div className="border border-slate-800 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-300 mb-2 sticky top-0 bg-slate-900 z-10 py-1">Completed Tasks ({tasks.length})</div>
                {tasks.length === 0 ? <p className="text-xs text-slate-500">No unbilled completed tasks.</p> : tasks.map(t => (
                  <label key={t.id} className="flex items-start gap-2 cursor-pointer group">
                    <input type="checkbox" checked={form.selected_tasks.includes(t.id)} onChange={() => toggleSelection('selected_tasks', t.id)} className="mt-1 accent-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 truncate group-hover:text-blue-300 transition-colors">{t.title}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Unbilled Audits */}
              <div className="border border-slate-800 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-300 mb-2 sticky top-0 bg-slate-900 z-10 py-1">Completed Gap Audits ({audits.length})</div>
                {audits.length === 0 ? <p className="text-xs text-slate-500">No unbilled audits.</p> : audits.map(a => (
                  <label key={a.id} className="flex items-start gap-2 cursor-pointer group">
                    <input type="checkbox" checked={form.selected_audits.includes(a.id)} onChange={() => toggleSelection('selected_audits', a.id)} className="mt-1 accent-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-200 truncate group-hover:text-blue-300 transition-colors">{a.business_name || a.website_url}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Unbilled Subscriptions */}
              <div className="border border-slate-800 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-300 mb-2 sticky top-0 bg-slate-900 z-10 py-1">Recurring Services ({subscriptions.length})</div>
                {subscriptions.length === 0 ? <p className="text-xs text-slate-500">No unbilled recurring services.</p> : subscriptions.map(s => (
                  <label key={s.id} className="flex items-start gap-2 cursor-pointer group">
                    <input type="checkbox" checked={form.selected_subscriptions.includes(s.id)} onChange={() => toggleSelection('selected_subscriptions', s.id)} className="mt-1 accent-blue-500" />
                    <div className="min-w-0 flex-1 flex justify-between">
                      <p className="text-xs text-slate-200 truncate group-hover:text-blue-300 transition-colors">{s.plan_name || 'Service Plan'}</p>
                      <p className="text-xs text-slate-400">${s.amount}</p>
                    </div>
                  </label>
                ))}
              </div>

            </div>
          </div>

          {/* Manual Lines */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-slate-300">Additional / Fixed-Price Items</h4>
              <Button size="sm" variant="outline" className="border-slate-700 text-xs text-slate-300 hover:bg-slate-800" onClick={addManualLine}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Line
              </Button>
            </div>
            <div className="space-y-3">
              {form.manual_lines.map((line, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 items-start bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <input placeholder="Name (e.g. Consulting)" value={line.name} onChange={e => updateManualLine(idx, 'name', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white flex-1 min-w-[150px]" />
                  <input placeholder="Description" value={line.description} onChange={e => updateManualLine(idx, 'description', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white flex-1 min-w-[200px]" />
                  <input type="number" placeholder="Qty" value={line.qty} onChange={e => updateManualLine(idx, 'qty', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-20" />
                  <input type="number" placeholder="Rate ($)" value={line.rate} onChange={e => updateManualLine(idx, 'rate', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-24" />
                  <input placeholder="Tax Name" value={line.taxName1} onChange={e => updateManualLine(idx, 'taxName1', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-24" />
                  <input type="number" placeholder="Tax %" value={line.taxAmount1} onChange={e => updateManualLine(idx, 'taxAmount1', e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-16" />
                  <button onClick={() => removeManualLine(idx)} className="p-1 text-slate-500 hover:text-red-400 mt-0.5"><X className="w-4 h-4" /></button>
                </div>
              ))}
              {form.manual_lines.length === 0 && <p className="text-xs text-slate-500 italic">No manual line items.</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" onClick={handlePreview}>
                Preview Invoice <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </div>
        </div>
      )}

      {/* Invoice Preview */}
      {previewMode && (
         <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl">
           <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Invoice Preview</h3>
              <Button variant="ghost" size="icon" onClick={() => setPreviewMode(false)} className="text-slate-500 hover:text-slate-800 hover:bg-slate-200"><X className="w-5 h-5" /></Button>
           </div>
           <div className="p-8">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Invoice</h2>
                    <p className="text-sm text-slate-500 mt-1">DRAFT</p>
                 </div>
                 <div className="text-right text-sm">
                    <p className="font-semibold text-slate-800">{status.business_name}</p>
                    <p className="text-slate-500 mt-4">Billed to:</p>
                    <p className="font-semibold text-slate-800">{previewClient?.organization || `${previewClient?.fname || ''} ${previewClient?.lname || ''}`.trim()}</p>
                 </div>
              </div>

              <table className="w-full text-sm mb-8">
                 <thead>
                    <tr className="border-b-2 border-slate-200">
                       <th className="text-left py-3 font-semibold text-slate-700 w-1/2">Item</th>
                       <th className="text-right py-3 font-semibold text-slate-700">Rate</th>
                       <th className="text-center py-3 font-semibold text-slate-700">Qty</th>
                       <th className="text-right py-3 font-semibold text-slate-700">Line Total</th>
                    </tr>
                 </thead>
                 <tbody>
                    {linesToPreview.map((l, i) => {
                       const lt = Number(l.qty) * Number(l.unit_cost.amount);
                       const taxStr = l.taxAmount1 ? ` (+${l.taxAmount1}% ${l.taxName1})` : '';
                       return (
                       <tr key={i} className="border-b border-slate-100">
                          <td className="py-4">
                             <p className="font-medium text-slate-800">{l.name}</p>
                             <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-sm">{l.description}</p>
                          </td>
                          <td className="py-4 text-right align-top">${Number(l.unit_cost.amount).toFixed(2)}</td>
                          <td className="py-4 text-center align-top">{l.qty}</td>
                          <td className="py-4 text-right align-top font-medium">${lt.toFixed(2)}<br/><span className="text-[10px] text-slate-400 font-normal">{taxStr}</span></td>
                       </tr>
                       );
                    })}
                 </tbody>
              </table>

              <div className="flex justify-end">
                 <div className="w-64 space-y-3 text-sm">
                    <div className="flex justify-between text-slate-500">
                       <span>Total</span>
                       <span className="font-bold text-slate-900 text-lg">${calculateTotal(linesToPreview).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              {form.notes && (
                 <div className="mt-12 pt-6 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{form.notes}</p>
                 </div>
              )}
           </div>

           <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
              <p className="text-xs text-slate-500">Invoice will be created as a Draft in FreshBooks. It will not be sent automatically.</p>
              <div className="flex gap-2">
                 <Button variant="outline" className="bg-white" onClick={() => setPreviewMode(false)}>Edit</Button>
                 <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateDraft} disabled={generating}>
                    {generating ? 'Saving...' : 'Create Draft in FreshBooks'}
                 </Button>
              </div>
           </div>
         </div>
      )}

    </div>
  );
}