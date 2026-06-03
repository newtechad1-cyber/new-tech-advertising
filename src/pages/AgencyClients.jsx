import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Building2, Search, ExternalLink, Mail, Globe, MapPin, Briefcase, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AgencyClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', website: '', industry: '' });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['agency-client-manager'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getClientCompanies', {});
      return res.data.companies || [];
    }
  });

  const saveClientMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Company.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agency-client-manager']);
      toast({ title: 'Client onboarded successfully' });
      setIsModalOpen(false);
      setNewClient({ name: '', website: '', industry: '' });
    }
  });

  const handleSaveClient = (e) => {
    e.preventDefault();
    saveClientMutation.mutate(newClient);
  };

  const filtered = clients.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading clients...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">Client Manager</h1>
          <p className="text-muted-foreground">Centralized view of all active accounts and their operating statuses.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-80 shadow-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, website, or industry..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(client => (
          <Card key={client.id} className="hover:shadow-lg transition-all flex flex-col group border-slate-200 overflow-hidden">
            <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={client.archived ? "secondary" : "default"} className={!client.archived ? "bg-green-600 hover:bg-green-700 shadow-sm" : ""}>
                  {client.archived ? "Archived" : "Active"}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1" title={client.name}>
                {client.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-5">
              <div className="space-y-3 text-sm text-slate-600 mb-6 flex-1">
                {client.website ? (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noreferrer" className="hover:underline text-primary truncate">
                      {client.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-400">
                    <Globe className="w-4 h-4 shrink-0" /> No website listed
                  </div>
                )}
                
                {client.industry && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{client.industry}</span>
                  </div>
                )}
                
                {client.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{client.city}{client.state && `, ${client.state}`}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border-slate-200" 
                  onClick={() => toast({ title: "Client email copied to clipboard" })}
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1 shadow-sm" 
                  onClick={() => window.open(`/client-dashboard?viewAs=${client.id}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> View As
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No clients found</h3>
            <p>Try adjusting your search filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Onboard New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveClient} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input type="url" value={newClient.website} onChange={e => setNewClient({...newClient, website: e.target.value})} placeholder="https://acme.com" />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={newClient.industry} onChange={e => setNewClient({...newClient, industry: e.target.value})} placeholder="e.g. Real Estate, Healthcare" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveClientMutation.isPending}>
                {saveClientMutation.isPending ? 'Saving...' : 'Create Client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}