import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, Eye, CheckCircle, Clock, Users } from 'lucide-react';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const [users, clientProfiles] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.ClientProfile.list()
      ]);
      
      // Filter out admin users
      const regularClients = users.filter(u => u.role !== 'admin');
      setClients(regularClients);
      setProfiles(clientProfiles);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const getClientProfile = (userEmail) => {
    return profiles.find(p => p.created_by === userEmail);
  };

  const getPackageBadge = (userEmail) => {
    // Logic to determine package - placeholder for now
    return <Badge className="bg-blue-100 text-blue-800">$197 Collaborative</Badge>;
  };

  const handleViewAsClient = (userEmail) => {
    toast.info(`View as ${userEmail} - Feature coming soon`);
    // This would switch to client view in the actual implementation
  };

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading clients...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <div className="text-sm text-slate-600">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No clients found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => {
            const profile = getClientProfile(client.email);
            return (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{client.full_name || 'No name'}</CardTitle>
                      <p className="text-xs text-slate-500 break-all">{client.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {getPackageBadge(client.email)}
                      {profile?.onboarding_completed ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Onboarded
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Onboarding
                        </Badge>
                      )}
                    </div>
                    
                    {profile?.business_name && (
                      <div>
                        <p className="text-xs text-slate-500">Business:</p>
                        <p className="text-sm font-medium">{profile.business_name}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Joined:</p>
                      <p className="text-xs">{new Date(client.created_date).toLocaleDateString()}</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewAsClient(client.email)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View as Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}