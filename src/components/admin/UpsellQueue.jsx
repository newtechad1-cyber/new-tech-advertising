import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, DollarSign, Sparkles } from 'lucide-react';

export default function UpsellQueue() {
  const [upsells, setUpsells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUpsells();
  }, []);

  const loadUpsells = async () => {
    try {
      const all = await base44.entities.ContentSubmission.filter({});
      const withUpsells = all.filter(s => 
        s.upgrade_status && 
        s.upgrade_status !== 'none' && 
        s.upgrade_status !== 'declined'
      );
      setUpsells(withUpsells.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date)));
    } catch (error) {
      console.error('Error loading upsells:', error);
      toast.error('Failed to load upsell queue');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await base44.entities.ContentSubmission.update(id, {
        upgrade_status: 'completed'
      });
      toast.success('Upgrade marked complete');
      loadUpsells();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      client_requested: { label: 'Client Requested', color: 'bg-blue-100 text-blue-800', icon: Clock },
      admin_recommended: { label: 'Awaiting Approval', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Approved - In Progress', color: 'bg-green-100 text-green-800', icon: Sparkles },
      completed: { label: 'Completed', color: 'bg-slate-100 text-slate-800', icon: CheckCircle }
    };
    const config = configs[status] || configs.client_requested;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredUpsells = filter === 'all' 
    ? upsells 
    : upsells.filter(u => u.upgrade_status === filter);

  if (loading) return <div className="text-center py-8">Loading upsell queue...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Upsell Queue</h2>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'client_requested' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('client_requested')}
          >
            Client Requested
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
        </div>
      </div>

      {filteredUpsells.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No upsell requests</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredUpsells.map((upsell) => (
            <Card key={upsell.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-base">
                    {upsell.upgrade_type?.replace('_', ' ').toUpperCase() || 'Upgrade Request'}
                  </CardTitle>
                  {getStatusBadge(upsell.upgrade_status)}
                </div>
                <p className="text-xs text-slate-500">
                  {upsell.created_by} • {new Date(upsell.updated_date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Original Content:</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{upsell.post_text}</p>
                  </div>
                  
                  {upsell.admin_upgrade_reason && (
                    <div className="bg-purple-50 border border-purple-200 rounded p-3">
                      <p className="text-xs text-purple-700 font-semibold mb-1">Recommendation:</p>
                      <p className="text-sm text-purple-900">{upsell.admin_upgrade_reason}</p>
                    </div>
                  )}
                  
                  {upsell.upgrade_price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">${upsell.upgrade_price}</span>
                    </div>
                  )}
                  
                  {upsell.upgrade_status === 'approved' && (
                    <div className="border-t pt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkComplete(upsell.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Completed
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}