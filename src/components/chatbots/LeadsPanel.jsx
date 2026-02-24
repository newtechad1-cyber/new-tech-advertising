import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, Building2, RefreshCw } from 'lucide-react';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
};

export default function LeadsPanel({ chatbot }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.ChatbotLead.filter({ chatbot_id: chatbot.id });
    setLeads(all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [chatbot.id]);

  const updateStatus = async (leadId, status) => {
    await base44.entities.ChatbotLead.update(leadId, { status });
    setLeads(l => l.map(x => x.id === leadId ? { ...x, status } : x));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{leads.length} leads captured</p>
        <Button size="sm" variant="outline" onClick={load} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">No leads captured yet for this chatbot.</div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="border rounded-xl p-4 bg-white space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{lead.name || 'Unknown'}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-slate-600 hover:underline">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    )}
                    {lead.business_name && (
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Building2 className="w-3 h-3" /> {lead.business_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lead.crm_synced && <Badge variant="outline" className="text-xs text-green-600 border-green-300">CRM Synced</Badge>}
                  <Select value={lead.status} onValueChange={v => updateStatus(lead.id, v)}>
                    <SelectTrigger className="h-7 text-xs w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {lead.conversation_summary && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded p-2 border-l-2 border-slate-300">
                  {lead.conversation_summary}
                </p>
              )}
              <p className="text-xs text-slate-400">{new Date(lead.created_date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}