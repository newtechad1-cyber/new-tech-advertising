import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, UserPlus, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [inviteEmail, setInviteEmail] = useState('');

  const { data: clients } = useQuery({ queryKey: ['admin-clients'], queryFn: () => base44.entities.Company.list() });
  const { data: leads } = useQuery({ queryKey: ['admin-leads'], queryFn: () => base44.entities.SalesLead.list() });
  const { data: deals } = useQuery({ queryKey: ['admin-deals'], queryFn: () => base44.entities.SalesDeal.list() });
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: () => base44.entities.User.list() });

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // Invite as standard user. Since default role on User entity is 'client', 
      // they will automatically be a client upon accepting the invite.
      await base44.users.inviteUser(inviteEmail, 'user');
      toast.success(`Invited ${inviteEmail} as a client.`);
      setInviteEmail('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-8 bg-slate-900 border border-slate-800 p-1 rounded-xl flex flex-wrap h-auto">
            <TabsTrigger value="clients" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Building2 className="w-4 h-4 mr-2"/> Clients</TabsTrigger>
            <TabsTrigger value="leads" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Target className="w-4 h-4 mr-2"/> Leads</TabsTrigger>
            <TabsTrigger value="deals" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"><FileText className="w-4 h-4 mr-2"/> Deals</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Users className="w-4 h-4 mr-2"/> Users & Invites</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl text-white font-semibold mb-4">Companies / Clients</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-800/50 text-slate-300">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Business Name</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-tr-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients?.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center">No clients found.</td></tr>
                    )}
                    {clients?.map(c => (
                      <tr key={c.id} className="border-b border-slate-800/50">
                        <td className="p-3 font-medium text-white">{c.business_name}</td>
                        <td className="p-3">{c.industry || '-'}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs">{c.status || 'Active'}</span></td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                <h2 className="text-xl text-white font-semibold mb-4">Invite Client</h2>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={inviteEmail} 
                      onChange={e=>setInviteEmail(e.target.value)} 
                      placeholder="client@business.com" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-lg">
                    <UserPlus className="w-5 h-5 mr-2" /> Send Invite
                  </Button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl text-white font-semibold mb-4">System Users</h2>
                <div className="space-y-3">
                  {users?.length === 0 && <p className="text-slate-400">No users found.</p>}
                  {users?.map(u => (
                    <div key={u.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{u.email}</div>
                        <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {u.role}
                          </span>
                          {u.company_name && <span>• {u.company_name}</span>}
                          {u.client_id && <span className="text-slate-500">• ID Linked</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">Edit User</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl text-white font-semibold mb-4">Sales Leads</h2>
              <p className="text-slate-400 mb-4">Total Leads: {leads?.length || 0}</p>
              <div className="space-y-2">
                {leads?.map(l => (
                  <div key={l.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-white font-medium">{l.business_name} <span className="text-slate-400 font-normal ml-2">({l.contact_name})</span></div>
                    <div className="text-sm text-slate-500">{l.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deals">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl text-white font-semibold mb-4">Sales Deals</h2>
              <p className="text-slate-400 mb-4">Total Deals: {deals?.length || 0}</p>
              <div className="space-y-2">
                {deals?.map(d => (
                  <div key={d.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="text-white font-medium">{d.deal_name}</div>
                    <div className="text-sm text-green-400">${d.value || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}