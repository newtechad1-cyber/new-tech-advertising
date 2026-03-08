import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Shield, User, Briefcase, Eye } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ROLE_BADGE = {
  admin: 'bg-violet-900/40 text-violet-300 border-violet-700',
  client: 'bg-blue-900/40 text-blue-300 border-blue-700',
  staff: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  user: 'bg-slate-700 text-slate-300',
};

const ROLE_ICON = {
  admin: Shield,
  client: User,
  staff: Briefcase,
  user: User,
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date', 200),
  });

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    client: users.filter(u => u.role === 'client').length,
    staff: users.filter(u => u.role === 'staff').length,
    user: users.filter(u => !u.role || u.role === 'user').length,
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                <div>
                  <h1 className="text-xl font-bold">User Management</h1>
                  <p className="text-slate-400 text-sm">All platform users and their roles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700" onClick={() => {
                  const email = prompt('Enter user email to invite:');
                  if (email) base44.users.inviteUser(email, 'user').then(() => alert('Invite sent!')).catch(e => alert(e.message));
                }}>
                  + Invite User
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
            {/* Role filter pills */}
            <div className="flex flex-wrap gap-2">
              {['all', 'admin', 'client', 'staff', 'user'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === r ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Users table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">Loading users...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No users found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase">
                      <th className="text-left px-5 py-3">User</th>
                      <th className="text-left px-5 py-3">Email</th>
                      <th className="text-left px-5 py-3">Role</th>
                      <th className="text-left px-5 py-3">Joined</th>
                      <th className="text-left px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filtered.map(u => {
                      const RoleIcon = ROLE_ICON[u.role] || User;
                      return (
                        <tr key={u.id} className="hover:bg-slate-750">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {u.full_name?.charAt(0) || u.email?.charAt(0) || '?'}
                              </div>
                              <span className="text-white font-medium">{u.full_name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-400">{u.email}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <RoleIcon className="w-3.5 h-3.5 text-slate-500" />
                              <Badge className={`text-xs border ${ROLE_BADGE[u.role] || ROLE_BADGE.user}`}>
                                {u.role || 'user'}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-500 text-xs">
                            {u.created_date ? new Date(u.created_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-5 py-3">
                            {u.role === 'client' && (
                              <button
                                onClick={() => window.open(createPageUrl('ClientDashboard'), '_blank')}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> Preview Portal
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <p className="text-xs text-slate-500">
              To change a user's role, go to your Base44 dashboard → Users → edit the user record and set their role field.
            </p>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}