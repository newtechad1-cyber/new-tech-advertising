import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search, Eye, CheckCircle, Clock, Users, TrendingUp,
  Phone, Mail, Globe, MapPin, Plus, Pencil, Trash2,
  Filter, ArrowUpDown, Loader2, Star, MessageSquare, X
} from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  proposal_sent: 'bg-purple-100 text-purple-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const LEAD_STATUSES = ['new', 'contacted', 'proposal_sent', 'won', 'lost'];

export default function ClientManagement() {
  const [activeTab, setActiveTab] = useState('leads');
  
  // Leads state
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', business_name: '', message: '', status: 'new' });

  // Clients state
  const [clients, setClients] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientSearch, setClientSearch] = useState('');

  useEffect(() => {
    loadLeads();
    loadClients();
  }, []);

  useEffect(() => {
    let filtered = [...leads];
    if (searchTerm) {
      filtered = filtered.filter(l =>
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter]);

  const loadLeads = async () => {
    setLeadsLoading(true);
    const data = await base44.entities.Lead.list('-created_date', 200);
    setLeads(data);
    setLeadsLoading(false);
  };

  const loadClients = async () => {
    setClientsLoading(true);
    const [users, clientProfiles] = await Promise.all([
      base44.entities.User.list(),
      base44.entities.ClientProfile.list()
    ]);
    setClients(users.filter(u => u.role !== 'admin'));
    setProfiles(clientProfiles);
    setClientsLoading(false);
  };

  const saveLead = async () => {
    if (editingLead) {
      await base44.entities.Lead.update(editingLead.id, leadForm);
      toast.success('Lead updated');
    } else {
      await base44.entities.Lead.create(leadForm);
      toast.success('Lead added');
    }
    setShowLeadForm(false);
    setEditingLead(null);
    setLeadForm({ name: '', email: '', phone: '', business_name: '', message: '', status: 'new' });
    loadLeads();
  };

  const deleteLead = async (id) => {
    await base44.entities.Lead.delete(id);
    toast.success('Lead deleted');
    if (selectedLead?.id === id) setSelectedLead(null);
    loadLeads();
  };

  const updateLeadStatus = async (lead, status) => {
    await base44.entities.Lead.update(lead.id, { status });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
    if (selectedLead?.id === lead.id) setSelectedLead({ ...selectedLead, status });
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setLeadForm({ name: lead.name, email: lead.email, phone: lead.phone || '', business_name: lead.business_name, message: lead.message || '', status: lead.status });
    setShowLeadForm(true);
  };

  const getProfile = (email) => profiles.find(p => p.created_by === email);
  const filteredClients = clients.filter(c =>
    c.full_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    won: leads.filter(l => l.status === 'won').length,
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="leads" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-300">
            <TrendingUp className="w-4 h-4 mr-2" /> Leads CRM
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300">
            <Users className="w-4 h-4 mr-2" /> Active Clients
          </TabsTrigger>
        </TabsList>

        {/* ── LEADS TAB ── */}
        <TabsContent value="leads" className="space-y-4 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Leads', value: stats.total, color: 'text-white' },
              { label: 'New', value: stats.new, color: 'text-blue-400' },
              { label: 'Contacted', value: stats.contacted, color: 'text-yellow-400' },
              { label: 'Won', value: stats.won, color: 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-800 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters + Add */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search leads..." className="pl-9 bg-slate-800 border-slate-700 text-white w-56" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {LEAD_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => { setEditingLead(null); setLeadForm({ name: '', email: '', phone: '', business_name: '', message: '', status: 'new' }); setShowLeadForm(true); }} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" /> Add Lead
            </Button>
          </div>

          {/* Lead list + detail panel */}
          <div className="flex gap-4">
            {/* List */}
            <div className={`space-y-2 ${selectedLead ? 'w-1/2' : 'w-full'}`}>
              {leadsLoading ? (
                <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No leads found. Add your first lead!</div>
              ) : filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                  className={`bg-slate-800 border rounded-xl p-4 cursor-pointer hover:border-amber-500 transition-all ${selectedLead?.id === lead.id ? 'border-amber-500' : 'border-slate-700'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{lead.business_name}</p>
                      <p className="text-slate-400 text-sm truncate">{lead.name} · {lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge className={STATUS_COLORS[lead.status] || 'bg-slate-700 text-slate-300'}>
                        {lead.status?.replace('_', ' ')}
                      </Badge>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={e => { e.stopPropagation(); openEdit(lead); }}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-400" onClick={e => { e.stopPropagation(); deleteLead(lead.id); }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {lead.phone && <p className="text-slate-500 text-xs mt-1">{lead.phone}</p>}
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            {selectedLead && (
              <div className="w-1/2 bg-slate-800 border border-amber-500 rounded-xl p-5 space-y-4 self-start sticky top-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedLead.business_name}</h3>
                    <p className="text-slate-400 text-sm">{selectedLead.name}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedLead(null)} className="text-slate-400 h-7 w-7">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  {selectedLead.email && <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500" /> {selectedLead.email}</div>}
                  {selectedLead.phone && <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" /> {selectedLead.phone}</div>}
                  {selectedLead.message && <div className="flex items-start gap-2 text-slate-300"><MessageSquare className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" /> <span>{selectedLead.message}</span></div>}
                  <div className="text-slate-500 text-xs">Added: {new Date(selectedLead.created_date).toLocaleDateString()}</div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {LEAD_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => updateLeadStatus(selectedLead, s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedLead.status === s ? STATUS_COLORS[s] + ' border-transparent' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => openEdit(selectedLead)}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit Lead
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── CLIENTS TAB ── */}
        <TabsContent value="clients" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search clients..." className="pl-9 bg-slate-800 border-slate-700 text-white w-64" />
            </div>
            <span className="text-slate-400 text-sm">{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</span>
          </div>

          {clientsLoading ? (
            <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p>No active clients yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map(client => {
                const profile = getProfile(client.email);
                return (
                  <div key={client.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                    <div>
                      <p className="font-bold text-white">{client.full_name || 'No name'}</p>
                      <p className="text-slate-400 text-xs break-all">{client.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile?.onboarding_completed ? (
                        <Badge className="bg-green-900 text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Onboarded</Badge>
                      ) : (
                        <Badge className="bg-yellow-900 text-yellow-400"><Clock className="w-3 h-3 mr-1" /> Onboarding</Badge>
                      )}
                    </div>
                    {profile?.business_name && (
                      <p className="text-sm text-slate-300 font-medium">{profile.business_name}</p>
                    )}
                    {profile?.industry && <p className="text-slate-500 text-xs">{profile.industry}</p>}
                    <p className="text-slate-600 text-xs">Joined: {new Date(client.created_date).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Lead Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Contact Name *</label>
                <Input value={leadForm.name} onChange={e => setLeadForm(f => ({...f, name: e.target.value}))} placeholder="John Smith" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Business Name *</label>
                <Input value={leadForm.business_name} onChange={e => setLeadForm(f => ({...f, business_name: e.target.value}))} placeholder="Acme Co." className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Email *</label>
                <Input value={leadForm.email} onChange={e => setLeadForm(f => ({...f, email: e.target.value}))} placeholder="john@acme.com" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Phone</label>
                <Input value={leadForm.phone} onChange={e => setLeadForm(f => ({...f, phone: e.target.value}))} placeholder="555-000-1234" className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Status</label>
              <Select value={leadForm.status} onValueChange={v => setLeadForm(f => ({...f, status: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Notes / Message</label>
              <textarea
                value={leadForm.message}
                onChange={e => setLeadForm(f => ({...f, message: e.target.value}))}
                placeholder="Notes about this lead..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={saveLead} className="bg-amber-600 hover:bg-amber-700 flex-1">{editingLead ? 'Update' : 'Add'} Lead</Button>
              <Button variant="ghost" onClick={() => setShowLeadForm(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}