import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { CheckCircle } from 'lucide-react';

export default function PortalMessages() {
  const { user, client, loading: authLoading } = usePortalClient();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(null);

  useEffect(() => {
    if (!client?.id) return;
    base44.entities.ClientPortalNote.filter({ client_id: client.id, visibility: 'Client Visible' }).then(n => {
      setNotes(n.sort((a,b) => (b.created_date||'').localeCompare(a.created_date||'')));
      setLoading(false);
    });
  }, [client?.id]);

  const acknowledge = async (note) => {
    setAcknowledging(note.id);
    const updated = await base44.entities.ClientPortalNote.update(note.id, { acknowledged_by_client: true, acknowledged_at: new Date().toISOString() });
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, acknowledged_by_client: true } : n));
    setAcknowledging(null);
  };

  if (authLoading || loading) return <Loader />;

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Updates and notes from the New Tech Advertising team.</p>
        </div>

        {notes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-semibold text-slate-700">No messages yet</p>
            <p className="text-sm text-slate-400 mt-1">Your team will post updates here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${note.acknowledged_by_client ? 'border-slate-200 opacity-75' : 'border-blue-200 shadow-sm'}`}>
                <div className={`px-5 py-4 border-b border-slate-100 ${!note.acknowledged_by_client ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{note.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        From New Tech Advertising · {note.created_date ? new Date(note.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    {!note.acknowledged_by_client && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">New</span>
                    )}
                    {note.acknowledged_by_client && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.message_body}</p>
                </div>
                {!note.acknowledged_by_client && (
                  <div className="px-5 pb-5">
                    <button onClick={() => acknowledge(note)} disabled={acknowledging === note.id}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                      <CheckCircle className="w-4 h-4" /> {acknowledging === note.id ? 'Marking...' : 'Got it'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

function Loader() { return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>; }