import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Link, MousePointer, Users, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ResellerSignupLinks() {
  const queryClient = useQueryClient();
  const [reseller, setReseller] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ label: '', plan_name: '', stripe_price_id: '', expires_at: '' });

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const accounts = await base44.entities.ResellerAccounts.filter({ contact_email: u.email });
      if (accounts.length > 0) setReseller(accounts[0]);
    };
    load();
  }, []);

  const { data: links = [] } = useQuery({
    queryKey: ['signup_links', reseller?.id],
    queryFn: () => base44.entities.ResellerSignupLinks.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const createLink = useMutation({
    mutationFn: async (data) => {
      const { data: { code } } = await base44.functions.invoke('resellerSignup', { action: 'generate_code' });
      return base44.entities.ResellerSignupLinks.create({
        ...data,
        reseller_id: reseller.id,
        link_code: code,
        clicks: 0,
        conversions: 0,
        active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signup_links', reseller?.id] });
      setShowCreate(false);
      setForm({ label: '', plan_name: '', stripe_price_id: '', expires_at: '' });
    }
  });

  const toggleLink = useMutation({
    mutationFn: ({ id, active }) => base44.entities.ResellerSignupLinks.update(id, { active: !active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['signup_links', reseller?.id] })
  });

  const copyLink = (code) => {
    const url = `${window.location.origin}/signup?ref=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getLinkUrl = (code) => `${window.location.origin}/signup?ref=${code}`;

  if (!reseller) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Signup Links</h1>
          <p className="text-xs text-slate-500">{reseller.reseller_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('ResellerDashboard')}>
            ← Dashboard
          </Button>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" />New Link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Signup Link</DialogTitle></DialogHeader>
              <form onSubmit={e => { e.preventDefault(); createLink.mutate(form); }} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Label *</label>
                  <Input required placeholder="e.g. Instagram Ad — March" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Plan Name</label>
                  <Input placeholder="SEO Pro" value={form.plan_name} onChange={e => setForm({ ...form, plan_name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Stripe Price ID</label>
                  <Input placeholder="price_..." value={form.stripe_price_id} onChange={e => setForm({ ...form, stripe_price_id: e.target.value })} />
                  <p className="text-xs text-slate-500 mt-1">If set, clients will be directed to Stripe checkout on signup.</p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Expires On (optional)</label>
                  <Input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button type="submit" disabled={createLink.isPending}>{createLink.isPending ? 'Creating...' : 'Create Link'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Link className="w-5 h-5 text-blue-500" /><div><p className="text-xs text-slate-500">Total Links</p><p className="text-2xl font-bold">{links.length}</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><MousePointer className="w-5 h-5 text-purple-500" /><div><p className="text-xs text-slate-500">Total Clicks</p><p className="text-2xl font-bold">{links.reduce((s, l) => s + (l.clicks || 0), 0)}</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-5 h-5 text-green-500" /><div><p className="text-xs text-slate-500">Total Signups</p><p className="text-2xl font-bold">{links.reduce((s, l) => s + (l.conversions || 0), 0)}</p></div></CardContent></Card>
        </div>

        {/* Links List */}
        {links.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Link className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No signup links yet. Create your first link to start tracking client signups.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {links.map(link => {
              const convRate = link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : '0.0';
              const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
              return (
                <Card key={link.id} className={!link.active ? 'opacity-60' : ''}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900">{link.label}</p>
                          {link.plan_name && <Badge variant="outline" className="text-xs">{link.plan_name}</Badge>}
                          {isExpired && <Badge className="bg-red-100 text-red-700 text-xs">Expired</Badge>}
                          {!link.active && <Badge className="bg-slate-100 text-slate-600 text-xs">Inactive</Badge>}
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg">
                          <code className="text-xs text-slate-600 flex-1 truncate">{getLinkUrl(link.link_code)}</code>
                          <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => copyLink(link.link_code)}>
                            {copied === link.link_code ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-center shrink-0">
                        <div><p className="text-lg font-bold">{link.clicks || 0}</p><p className="text-xs text-slate-500">clicks</p></div>
                        <div><p className="text-lg font-bold text-green-700">{link.conversions || 0}</p><p className="text-xs text-slate-500">signups</p></div>
                        <div><p className="text-lg font-bold text-blue-700">{convRate}%</p><p className="text-xs text-slate-500">CVR</p></div>
                        <Button size="sm" variant="outline" onClick={() => toggleLink.mutate({ id: link.id, active: link.active })}>
                          {link.active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                    {link.expires_at && (
                      <p className="text-xs text-slate-400 mt-2">Expires: {link.expires_at}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}