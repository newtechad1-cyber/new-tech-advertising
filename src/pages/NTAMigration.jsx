import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Database, CheckCircle2, AlertTriangle, Loader2, Eye, Zap } from 'lucide-react';

const ENTITY_TYPES = [
  { key: 'Lead', label: 'Leads', description: 'General website/CRM leads' },
  { key: 'SalesLead', label: 'Sales Leads', description: 'Cold outreach + sales pipeline leads' },
  { key: 'AdaLead', label: 'ADA Leads', description: 'ADA compliance intake forms' },
  { key: 'TrialAccount', label: 'Trial Accounts', description: 'DIY trial signups' },
];

export default function NTAMigration() {
  const [selected, setSelected] = useState(['Lead', 'SalesLead', 'AdaLead', 'TrialAccount']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('dry_run'); // 'dry_run' | 'live'

  const toggle = (key) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const run = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one entity type');
      return;
    }
    const isDry = mode === 'dry_run';
    if (!isDry && !window.confirm('This will write data to your database. Are you sure you want to run the live migration?')) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('ntaBackfillMigration', {
        dry_run: isDry,
        entity_types: selected,
      });
      setResult(res.data);
      toast.success(isDry ? 'Dry run complete' : 'Migration complete!');
    } catch (err) {
      toast.error(err.message || 'Migration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <Link to="/nta/command-center">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />Command Center
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl font-bold">NTA Data Migration</h1>
              </div>
              <p className="text-slate-400 text-sm">Backfill legacy records into the unified operating system</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

          {/* Warning banner */}
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium text-sm">One-time migration tool</p>
              <p className="text-yellow-400/80 text-sm mt-1">
                This backfills Lead, SalesLead, AdaLead, and TrialAccount records into Submission → Company → Opportunity → Activity.
                Existing records are <strong>not deleted or modified</strong>. Always run a dry run first.
              </p>
            </div>
          </div>

          {/* Entity selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Select Entity Types to Migrate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENTITY_TYPES.map(et => (
                <button
                  key={et.key}
                  onClick={() => toggle(et.key)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selected.includes(et.key)
                      ? 'bg-violet-900/40 border-violet-600'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selected.includes(et.key)
                      ? <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      : <div className="w-4 h-4 rounded-full border border-slate-600" />
                    }
                    <span className="font-medium text-sm">{et.label}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 ml-6">{et.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Mode selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Run Mode</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('dry_run')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  mode === 'dry_run' ? 'bg-blue-900/40 border-blue-600' : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-sm">Dry Run</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">Preview what would be created — no data written</p>
              </button>
              <button
                onClick={() => setMode('live')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  mode === 'live' ? 'bg-green-900/40 border-green-600' : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-sm">Live Migration</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">Write to database — idempotent, safe to re-run</p>
              </button>
            </div>
          </div>

          {/* Run button */}
          <Button
            onClick={run}
            disabled={loading || selected.length === 0}
            className={`w-full h-12 text-base font-semibold ${mode === 'live' ? 'bg-green-700 hover:bg-green-600' : 'bg-blue-700 hover:bg-blue-600'}`}
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Running...</>
              : <><Play className="w-5 h-5 mr-2" />{mode === 'dry_run' ? 'Run Dry Run' : 'Run Live Migration'}</>
            }
          </Button>

          {/* Result */}
          {result && (
            <div className={`rounded-xl border p-5 ${result.stats?.errors > 0 ? 'bg-red-900/20 border-red-700' : 'bg-green-900/20 border-green-700'}`}>
              <div className="flex items-center gap-2 mb-3">
                {result.stats?.errors > 0
                  ? <AlertTriangle className="w-5 h-5 text-red-400" />
                  : <CheckCircle2 className="w-5 h-5 text-green-400" />
                }
                <h3 className="font-semibold text-white">{result.dry_run ? 'Dry Run Results' : 'Migration Complete'}</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">{result.message}</p>
              {result.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Total Processed', result.stats.total],
                    ['Submissions', result.stats.submissions_created],
                    ['Companies Created', result.stats.companies_created],
                    ['Opportunities', result.stats.opportunities_created],
                    ['Skipped (Dupes)', result.stats.skipped],
                    ['Errors', result.stats.errors],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-slate-800 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-white">{val}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}
              {!result.dry_run && result.stats?.submissions_created > 0 && (
                <div className="mt-4 flex gap-3">
                  <Link to="/nta/submissions">
                    <Button size="sm" className="bg-violet-700 hover:bg-violet-600">View Submissions</Button>
                  </Link>
                  <Link to="/nta/companies">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">View Companies</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Architecture summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Unified Intake — How It Works</h2>
            <div className="space-y-2 text-sm text-slate-400">
              {[
                ['Live intercept', 'adaIntake, onLeadCreated, sendTrialToCRM now silently mirror to ntaUnifiedIntake on every new submission'],
                ['Company matching', 'Website → Email → Phone → Name dedup. Existing company enriched, new company created if no match'],
                ['Contact creation', 'Primary contact linked to company. Deduped by email/phone'],
                ['Opportunity', 'Created per submission type. Skips if same company has open opp within 7 days'],
                ['Activity log', 'Every submission, company creation, and webhook event logged to NTAActivity'],
                ['Tasks', 'High-intent types (ADA, rebuild, demo) get same-day follow-up. Others get next-day'],
                ['Webhooks', 'Both AGENT_WEBHOOK_URL and CRM_WEBHOOK_URL fired. Failures create urgent retry tasks'],
                ['Backfill', 'Run this page once to migrate all historical Lead/SalesLead/AdaLead/TrialAccount records'],
              ].map(([label, desc]) => (
                <div key={label} className="flex gap-2">
                  <Badge className="bg-violet-900 text-violet-300 border-0 text-xs shrink-0">{label}</Badge>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}