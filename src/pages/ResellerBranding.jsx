import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

export default function ResellerBranding() {
  const queryClient = useQueryClient();
  const [reseller, setReseller] = useState(null);
  const [form, setForm] = useState({
    brand_name: '', logo_url: '', primary_color: '#1a56db', secondary_color: '', accent_color: '',
    support_email: '', support_phone: '', portal_tagline: '', hide_powered_by: false, custom_css: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      const accounts = await base44.entities.ResellerAccounts.filter({ contact_email: u.email });
      if (accounts.length > 0) setReseller(accounts[0]);
    };
    load();
  }, []);

  const { data: branding = null } = useQuery({
    queryKey: ['branding', reseller?.id],
    queryFn: async () => {
      const b = await base44.entities.WhiteLabelBranding.filter({ reseller_id: reseller.id, active: true });
      return b[0] || null;
    },
    enabled: !!reseller?.id,
    onSuccess: (b) => {
      if (b) setForm({ ...form, ...b });
    }
  });

  useEffect(() => {
    if (branding) setForm(f => ({ ...f, ...branding }));
  }, [branding]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (branding?.id) {
        return base44.entities.WhiteLabelBranding.update(branding.id, data);
      } else {
        return base44.entities.WhiteLabelBranding.create({ ...data, reseller_id: reseller.id, active: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', reseller?.id] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (!reseller) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">White Label Branding</h1>
          <p className="text-xs text-slate-500">{reseller.reseller_name}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('ResellerDashboard')}>
          ← Dashboard
        </Button>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        {!reseller.white_label_enabled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 font-semibold">White label branding is not active on your account.</p>
            <p className="text-xs text-yellow-700 mt-1">Contact us to enable white label for your reseller account.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Identity */}
          <Card>
            <CardHeader><CardTitle>Brand Identity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Brand Name *</label>
                <Input
                  required
                  placeholder="Your Agency Name"
                  value={form.brand_name}
                  onChange={e => setForm({ ...form, brand_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Logo URL</label>
                <Input
                  placeholder="https://yoursite.com/logo.png"
                  value={form.logo_url}
                  onChange={e => setForm({ ...form, logo_url: e.target.value })}
                />
                {form.logo_url && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg inline-block">
                    <img src={form.logo_url} alt="Logo Preview" className="h-10 object-contain" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Portal Tagline</label>
                <Input
                  placeholder="Your marketing growth partner"
                  value={form.portal_tagline}
                  onChange={e => setForm({ ...form, portal_tagline: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader><CardTitle>Brand Colors</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.primary_color || '#1a56db'}
                      onChange={e => setForm({ ...form, primary_color: e.target.value })}
                      className="h-10 w-12 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={form.primary_color}
                      onChange={e => setForm({ ...form, primary_color: e.target.value })}
                      placeholder="#1a56db"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.secondary_color || '#6b7280'}
                      onChange={e => setForm({ ...form, secondary_color: e.target.value })}
                      className="h-10 w-12 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      value={form.secondary_color}
                      onChange={e => setForm({ ...form, secondary_color: e.target.value })}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader><CardTitle>Support Contact</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Support Email</label>
                <Input
                  type="email"
                  placeholder="support@youragency.com"
                  value={form.support_email}
                  onChange={e => setForm({ ...form, support_email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Support Phone</label>
                <Input
                  placeholder="(555) 123-4567"
                  value={form.support_phone}
                  onChange={e => setForm({ ...form, support_phone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader><CardTitle>Options</CardTitle></CardHeader>
            <CardContent>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hide_powered_by}
                  onChange={e => setForm({ ...form, hide_powered_by: e.target.checked })}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Hide "Powered by NTA" label</p>
                  <p className="text-xs text-slate-500">Requires white label plan to be active</p>
                </div>
              </label>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Branding'}
            </Button>
            {saved && <Badge className="bg-green-100 text-green-800">✓ Saved</Badge>}
          </div>
        </form>
      </div>
    </div>
  );
}