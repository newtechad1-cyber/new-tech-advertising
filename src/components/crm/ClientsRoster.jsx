import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Search, CheckCircle, Clock, Users, Mail, Phone,
  Globe, UserPlus, Loader2, Send, UserCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ClientsRoster() {
  const [clients, setClients] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', body: '' });
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [users, profs] = await Promise.all([
      base44.entities.User.list(),
      base44.entities.ClientProfile.list()
    ]);
    setClients(users.filter(u => u.role !== 'admin'));
    setProfiles(profs);
    setLoading(false);
  };

  const getProfile = (email) => profiles.find(p => p.created_by === email);

  const filtered = clients.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    getProfile(c.email)?.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    await base44.users.inviteUser(inviteEmail, 'user');
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
    setInviting(false);
  };

  const sendDirectEmail = async () => {
    if (!emailForm.subject || !emailForm.body || !selected) return;
    setSendingEmail(selected.id);
    await base44.integrations.Core.SendEmail({
      to: selected.email,
      subject: emailForm.subject,
      body: emailForm.body
    });
    toast.success(`Email sent to ${selected.full_name || selected.email}`);
    setEmailForm({ subject: '', body: '' });
    setShowEmailForm(false);
    setSendingEmail(null);
  };

  const addToSubscribers = async (client) => {
    const existing = await base44.entities.Subscriber.filter({ email: client.email });
    if (existing.length > 0) { toast.info('Already on email list'); return; }
    const profile = getProfile(client.email);
    await base44.entities.Subscriber.create({
      email: client.email,
      first_name: client.full_name?.split(' ')[0] || '',
      last_name: client.full_name?.split(' ').slice(1).join(' ') || '',
      tags: ['client', profile?.industry].filter(Boolean),
      source: 'active_client',
      status: 'active'
    });
    toast.success(`${client.full_name || client.email} added to email list`);
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{clients.length}</p>
          <p className="text-slate-400 text-xs mt-1">Active Clients</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{clients.filter(c => getProfile(c.email)?.onboarding_completed).length}</p>
          <p className="text-slate-400 text-xs mt-1">Onboarded</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{clients.filter(c => !getProfile(c.email)?.onboarding_completed).length}</p>
          <p className="text-slate-400 text-xs mt-1">Onboarding</p>
        </div>
      </div>

      {/* Search + Invite */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="pl-9 bg-slate-800 border-slate-700 text-white" />
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="bg-green-700 hover:bg-green-600">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Client
        </Button>
      </div>

      {/* Client list + detail */}
      <div className="flex gap-4">
        <div className={`space-y-2 ${selected ? 'w-1/2' : 'w-full'}`}>
          {loading ? (
            <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p>No clients yet. Invite your first!</p>
            </div>
          ) : filtered.map(client => {
            const profile = getProfile(client.email);
            const isSelected = selected?.id === client.id;
            return (
              <div
                key={client.id}
                onClick={() => setSelected(isSelected ? null : client)}
                className={`bg-slate-800 border rounded-xl p-4 cursor-pointer hover:border-green-500 transition-all ${isSelected ? 'border-green-500 ring-1 ring-green-500/30' : 'border-slate-700'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white truncate">{client.full_name || 'No name'}</p>
                      {profile?.onboarding_completed
                        ? <Badge className="bg-green-900 text-green-400 text-xs"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
                        : <Badge className="bg-yellow-900 text-yellow-400 text-xs"><Clock className="w-3 h-3 mr-1" />Onboarding</Badge>
                      }
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{client.email}</p>
                    {profile?.business_name && <p className="text-slate-300 text-sm mt-1">{profile.business_name}</p>}
                    {profile?.industry && <p className="text-slate-500 text-xs">{profile.industry}</p>}
                  </div>
                  <p className="text-slate-600 text-xs">Since {new Date(client.created_date).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client detail panel */}
        {selected && (
          <div className="w-1/2 bg-slate-800 border border-green-500 rounded-xl p-5 space-y-4 self-start sticky top-4">
            <div>
              <p className="font-bold text-white text-lg">{selected.full_name || 'No name'}</p>
              <p className="text-slate-400 text-sm">{selected.email}</p>
              {getProfile(selected.email)?.business_name && (
                <p className="text-slate-300 text-sm mt-1 font-medium">{getProfile(selected.email).business_name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => setShowEmailForm(!showEmailForm)} className="bg-blue-700 hover:bg-blue-600 w-full justify-start">
                <Mail className="w-4 h-4 mr-2" /> Send Direct Email
              </Button>
              <Button size="sm" onClick={() => addToSubscribers(selected)} variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/20 w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" /> Add to Email List
              </Button>
            </div>

            {showEmailForm && (
              <div className="space-y-3">
                <Input value={emailForm.subject} onChange={e => setEmailForm(f => ({...f, subject: e.target.value}))} placeholder="Subject..." className="bg-slate-900 border-slate-700 text-white text-sm" />
                <textarea value={emailForm.body} onChange={e => setEmailForm(f => ({...f, body: e.target.value}))} placeholder="Message..." rows={4} className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
                <Button size="sm" onClick={sendDirectEmail} disabled={!!sendingEmail} className="bg-green-700 hover:bg-green-600 w-full">
                  <Send className="w-4 h-4 mr-2" /> Send Email
                </Button>
              </div>
            )}

            {getProfile(selected.email) && (
              <div className="border-t border-slate-700 pt-3 text-sm space-y-1">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Profile</p>
                {getProfile(selected.email)?.target_audience && <p className="text-slate-400 text-xs">Audience: {getProfile(selected.email).target_audience}</p>}
                {getProfile(selected.email)?.marketing_goals?.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Goals:</p>
                    <div className="flex flex-wrap gap-1">
                      {getProfile(selected.email).marketing_goals.map(g => <span key={g} className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{g}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button size="sm" variant="ghost" onClick={() => setSelected(null)} className="text-slate-500 w-full text-xs">Close</Button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader><DialogTitle>Invite a Client</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">They'll receive an email with login instructions to access their dashboard.</p>
          <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="client@business.com" className="bg-slate-800 border-slate-700 text-white" />
          <div className="flex gap-3">
            <Button onClick={handleInvite} disabled={inviting} className="bg-green-700 hover:bg-green-600 flex-1">
              {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Send Invite
            </Button>
            <Button variant="ghost" onClick={() => setShowInviteModal(false)} className="text-slate-400">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}