import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '@/components/agency/AgencyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Building2, Search, Globe, MapPin, Plus, Pencil, Archive, RotateCcw, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EMPTY_CLIENT = {
  business_name: '', website: '', primary_contact: '', email: '', phone: '',
  city: '', state: 'IA', core_services: '', status: 'active_client', archived: false,
};

const normalizeName = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
const isProtectedClient = (client) => {
  const name = normalizeName(client.business_name);
  return name === 'nta' || name.startsWith('new tech advertising') || name.startsWith('johnson heating') || name.startsWith('monson plumbing');
};

export default function AgencyClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('active');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CLIENT);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['agency-clients'],
    queryFn: () => base44.entities.Clients.list('-created_date', 500),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['agency-clients'] });

  const saveMutation = useMutation({
    mutationFn: async () => editing?.id
      ? base44.entities.Clients.update(editing.id, form)
      : base44.entities.Clients.create(form),
    onSuccess: () => {
      refresh();
      setEditing(null);
      setForm(EMPTY_CLIENT);
      toast({ title: editing?.id ? 'Client updated' : 'Client created' });
    },
    onError: (error) => toast({ title: 'Could not save client', description: error.message, variant: 'destructive' }),
  });

  const openNew = () => {
    setEditing({});
    setForm(EMPTY_CLIENT);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({ ...EMPTY_CLIENT, ...client });
  };

  const setArchived = async (client, archived) => {
    const action = archived ? 'archive' : 'restore';
    if (!window.confirm(`${action === 'archive' ? 'Archive' : 'Restore'} "${client.business_name}"?`)) return;
    await base44.entities.Clients.update(client.id, { archived });
    refresh();
    toast({ title: archived ? 'Client archived' : 'Client restored' });
  };

  const deletePermanently = async (client) => {
    if (isProtectedClient(client)) {
      toast({ title: 'Protected live account', description: 'NTA, Johnson Heating, and Monson Plumbing cannot be removed by cleanup controls.' });
      return;
    }
    if (!client.archived) {
      toast({ title: 'Archive this client first', description: 'Permanent deletion is only available for archived records.' });
      return;
    }
    const confirmation = window.prompt(`Permanent deletion cannot be undone. Type the client name exactly:\n\n${client.business_name}`);
    if (confirmation !== client.business_name) {
      if (confirmation !== null) toast({ title: 'Name did not match. Nothing was deleted.' });
      return;
    }
    await base44.entities.Clients.delete(client.id);
    refresh();
    toast({ title: 'Client permanently deleted' });
  };

  const archiveNonLiveClients = async () => {
    const extras = clients.filter(client => !client.archived && !isProtectedClient(client));
    if (!extras.length) {
      toast({ title: 'Client list is already clean', description: 'Only the three protected live accounts are active.' });
      return;
    }
    const names = extras.map(client => client.business_name).join('\n• ');
    const confirmation = window.prompt(
      `This will archive ${extras.length} non-live client record${extras.length === 1 ? '' : 's'}:\n\n• ${names}\n\n` +
      'NTA, Johnson Heating, and Monson Plumbing are protected. Type ARCHIVE SAMPLE CLIENTS to continue.'
    );
    if (confirmation !== 'ARCHIVE SAMPLE CLIENTS') {
      if (confirmation !== null) toast({ title: 'Nothing changed', description: 'The confirmation phrase did not match.' });
      return;
    }
    await Promise.all(extras.map(client => base44.entities.Clients.update(client.id, { archived: true })));
    refresh();
    toast({ title: `${extras.length} non-live client record${extras.length === 1 ? '' : 's'} archived` });
  };

  const filtered = clients.filter(client => {
    if (view === 'active' && client.archived) return false;
    if (view === 'archived' && !client.archived) return false;
    const q = search.toLowerCase();
    return !q || [client.business_name, client.primary_contact, client.email, client.website, client.city]
      .some(value => (value || '').toLowerCase().includes(q));
  });

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-sm text-slate-500 mt-1">Edit, archive, restore, or remove client records.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={archiveNonLiveClients} className="gap-2 border-amber-800 text-amber-300">
              <Archive className="w-4 h-4" /> Archive Sample Clients
            </Button>
            <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Client</Button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="pl-9 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {['active', 'archived', 'all'].map(option => (
              <button key={option} onClick={() => setView(option)} className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize ${view === option ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-slate-500">Loading clients…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-slate-900 border border-dashed border-slate-700 rounded-xl">
            <Building2 className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No {view === 'all' ? '' : view} clients found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(client => (
              <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-white truncate">{client.business_name}</h2>
                    <p className="text-xs text-slate-500 mt-1">{client.primary_contact || 'No primary contact'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isProtectedClient(client) && <Badge className="bg-blue-950 text-blue-300">Protected live</Badge>}
                    <Badge className={client.archived ? 'bg-slate-700 text-slate-300' : 'bg-emerald-900 text-emerald-300'}>{client.archived ? 'Archived' : 'Active'}</Badge>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 min-h-12">
                  {client.website && <p className="flex gap-2"><Globe className="w-3.5 h-3.5" /> {client.website.replace(/^https?:\/\//, '')}</p>}
                  {(client.city || client.state) && <p className="flex gap-2"><MapPin className="w-3.5 h-3.5" /> {[client.city, client.state].filter(Boolean).join(', ')}</p>}
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                  <Link to={`/agency/clients/${client.id}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </Link>
                  <button onClick={() => openEdit(client)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button disabled={isProtectedClient(client)} title={isProtectedClient(client) ? 'Protected live account' : undefined} onClick={() => setArchived(client, !client.archived)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-amber-400 text-xs font-semibold">
                    {client.archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />} {client.archived ? 'Restore' : 'Archive'}
                  </button>
                  {client.archived && (
                    <button onClick={() => deletePermanently(client)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 text-xs font-semibold">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={editing !== null} onOpenChange={open => !open && setEditing(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle>{editing?.id ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <Field label="Business name *"><Input required value={form.business_name} onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Primary contact"><Input value={form.primary_contact} onChange={e => setForm(p => ({ ...p, primary_contact: e.target.value }))} /></Field>
                <Field label="Phone"><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></Field>
              </div>
              <Field label="Email"><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>
              <Field label="Website"><Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></Field>
                <Field label="State"><Input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} /></Field>
              </div>
              <Field label="Services"><Input value={form.core_services} onChange={e => setForm(p => ({ ...p, core_services: e.target.value }))} /></Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : 'Save Client'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AgencyLayout>
  );
}

function Field({ label, children }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
