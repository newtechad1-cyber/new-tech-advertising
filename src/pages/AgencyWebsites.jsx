import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Globe, ExternalLink, Plus, ArrowRight } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

export default function AgencyWebsites() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Clients.filter({ archived: false }).then(c => {
      setClients(c);
      setLoading(false);
    });
  }, []);

  const withSites = clients.filter(c => c.website);
  const withoutSites = clients.filter(c => !c.website && c.status === 'active_client');

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Websites</h1>
            <p className="text-slate-500 text-sm mt-0.5">{withSites.length} clients with websites on file</p>
          </div>
          <Link to="/agency/clients" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Client
          </Link>
        </div>

        {/* Demo site quick link */}
        <div className="bg-blue-900/40 border border-blue-800/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white text-sm">Johnson Heating & AC — Demo Site</p>
            <p className="text-blue-300 text-xs mt-0.5">Full HVAC demo with 5 service pages, 4 location pages, and a blog</p>
          </div>
          <Link to="/johnson" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg transition-colors">
            View Site <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Client websites */}
        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <>
            {withSites.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Client Websites</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                  {withSites.map(c => (
                    <div key={c.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{c.business_name}</p>
                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-0.5">
                          {c.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/clients/${c.id}`} className="text-xs text-slate-500 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          View Client <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {withoutSites.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Active Clients Without Website on File</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                  {withoutSites.map(c => (
                    <div key={c.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{c.business_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">No website on file</p>
                      </div>
                      <Link to={`/clients/${c.id}`} className="text-xs text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1.5 rounded-lg">
                        Add Website →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {withSites.length === 0 && withoutSites.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <Globe className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm mb-4">No clients added yet.</p>
                <Link to="/agency/clients" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-lg">
                  <Plus className="w-4 h-4" /> Add First Client
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </AgencyLayout>
  );
}