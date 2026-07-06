/**
 * R0.6.2 — Canon Migration Admin Page
 * One-click migration of all seed data into the Publishing Engine.
 * Populates: PublishingArticle, CanonCollection, YouTubeKnowledge, JournalIssue
 * Route: /admin/canon-migration
 *
 * This page is run ONCE to seed the entities. After that,
 * the Publishing Engine is the source of truth.
 */
import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import NoIndexMeta from '@/components/auth/NoIndexMeta';
import { toast } from 'sonner';
import {
  Database, Play, CheckCircle2, AlertCircle, Loader2,
  FileText, BookOpen, Youtube, FolderOpen, ArrowRight,
  RefreshCw, Trash2, Shield
} from 'lucide-react';
import {
  ALL_SEED_ASSETS, SEED_COLLECTIONS, SEED_YOUTUBE_VIDEOS,
  SEED_ARTICLES, SEED_SERVICE_PAGES, SEED_INDUSTRY_PAGES, SEED_GEO_PAGES,
  DUPLICATE_GROUPS
} from '../data/canonSeed';

const STEPS = [
  { id: 'articles', label: 'Populate Publishing Engine', desc: `${ALL_SEED_ASSETS.length} assets (articles, services, industries, geos)`, icon: FileText, count: ALL_SEED_ASSETS.length },
  { id: 'collections', label: 'Populate Canon Collections', desc: `${SEED_COLLECTIONS.length} reader journeys`, icon: FolderOpen, count: SEED_COLLECTIONS.length },
  { id: 'videos', label: 'Populate YouTube Knowledge', desc: `${SEED_YOUTUBE_VIDEOS.length} videos`, icon: Youtube, count: SEED_YOUTUBE_VIDEOS.length },
  { id: 'journals', label: 'Create Journal Records', desc: 'Journal entries from articles', icon: BookOpen, count: SEED_ARTICLES.length },
  { id: 'duplicates', label: 'Mark Duplicate Assets', desc: `${DUPLICATE_GROUPS.length} duplicate groups`, icon: Shield, count: DUPLICATE_GROUPS.length },
];

function StatusBadge({ status }) {
  if (status === 'done') return <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>;
  if (status === 'running') return <span className="flex items-center gap-1 text-blue-400 text-xs"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running</span>;
  if (status === 'error') return <span className="flex items-center gap-1 text-red-400 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Error</span>;
  return <span className="text-slate-500 text-xs">Pending</span>;
}

export default function AdminCanonMigration() {
  const [stepStatus, setStepStatus] = useState({});
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState({ articles: 0, collections: 0, videos: 0, journals: 0 });

  const log = useCallback((msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const setStep = useCallback((id, status) => {
    setStepStatus(prev => ({ ...prev, [id]: status }));
  }, []);

  // Step 1: Populate Publishing Engine with all assets
  async function migrateArticles() {
    setStep('articles', 'running');
    log('Starting Publishing Engine population...');
    let created = 0;
    let skipped = 0;

    // Check for existing records to avoid duplicates
    const existing = await base44.entities.PublishingArticle.list('-created_date', 500).catch(() => []);
    const existingCanonIds = new Set(existing.map(e => e.canon_id).filter(Boolean));

    for (const asset of ALL_SEED_ASSETS) {
      if (existingCanonIds.has(asset.canon_id)) {
        skipped++;
        continue;
      }
      try {
        await base44.entities.PublishingArticle.create(asset);
        created++;
      } catch (err) {
        log(`  ⚠ Failed: ${asset.canon_id} ${asset.title} — ${err.message}`);
      }
    }
    log(`  ✓ Created ${created} assets, skipped ${skipped} existing`);
    setCounts(prev => ({ ...prev, articles: created }));
    setStep('articles', 'done');
  }

  // Step 2: Populate Canon Collections
  async function migrateCollections() {
    setStep('collections', 'running');
    log('Populating Canon Collections...');
    let created = 0;
    let skipped = 0;

    const existing = await base44.entities.CanonCollection.list('display_order', 100).catch(() => []);
    const existingSlugs = new Set(existing.map(c => c.slug));

    for (const col of SEED_COLLECTIONS) {
      if (existingSlugs.has(col.slug)) {
        skipped++;
        continue;
      }
      try {
        await base44.entities.CanonCollection.create({
          ...col,
          entry_count: (col.entry_canon_ids || []).length,
          created_date: new Date().toISOString().split('T')[0],
        });
        created++;
      } catch (err) {
        log(`  ⚠ Failed: ${col.slug} — ${err.message}`);
      }
    }
    log(`  ✓ Created ${created} collections, skipped ${skipped} existing`);
    setCounts(prev => ({ ...prev, collections: created }));
    setStep('collections', 'done');
  }

  // Step 3: Populate YouTube Knowledge Engine
  async function migrateVideos() {
    setStep('videos', 'running');
    log('Populating YouTube Knowledge Engine...');
    let created = 0;
    let skipped = 0;

    const existing = await base44.entities.YouTubeKnowledge.list('-created_date', 200).catch(() => []);
    const existingIds = new Set(existing.map(v => v.youtube_video_id).filter(Boolean));

    for (const vid of SEED_YOUTUBE_VIDEOS) {
      if (existingIds.has(vid.youtube_video_id)) {
        skipped++;
        continue;
      }
      try {
        await base44.entities.YouTubeKnowledge.create({
          ...vid,
          created_date: new Date().toISOString().split('T')[0],
        });
        created++;
      } catch (err) {
        log(`  ⚠ Failed: ${vid.video_title} — ${err.message}`);
      }
    }
    log(`  ✓ Created ${created} YouTube records, skipped ${skipped} existing`);
    setCounts(prev => ({ ...prev, videos: created }));
    setStep('videos', 'done');
  }

  // Step 4: Create Journal Records from articles
  async function migrateJournals() {
    setStep('journals', 'running');
    log('Creating Journal records from articles...');
    let created = 0;
    let skipped = 0;

    const existing = await base44.entities.JournalIssue.list('-date', 200).catch(() => []);
    const existingTitles = new Set(existing.map(j => j.title));

    for (let i = 0; i < SEED_ARTICLES.length; i++) {
      const a = SEED_ARTICLES[i];
      if (existingTitles.has(a.title)) {
        skipped++;
        continue;
      }
      try {
        await base44.entities.JournalIssue.create({
          issue_number: i + 1,
          volume: 1,
          title: a.title,
          slug: a.slug,
          date: a.published_date || '2026-01-01',
          status: 'Published',
          summary: a.summary,
          category: a.primary_theme === 'Client Success' ? 'Client Stories'
            : a.primary_theme === 'Founder Wisdom' ? 'Founder Reflections'
            : a.primary_theme === 'AI & Technology' ? 'AI & Technology'
            : a.primary_theme === 'Business Growth' ? 'Business Growth'
            : 'Building NTA',
          tags: a.tags || [],
          related_service_slugs: a.related_services || [],
          author: 'Rick Hesse',
          featured: a.featured || false,
          canon_entry_id: a.canon_id,
          created_date: new Date().toISOString().split('T')[0],
        });
        created++;
      } catch (err) {
        log(`  ⚠ Failed: ${a.title} — ${err.message}`);
      }
    }
    log(`  ✓ Created ${created} journal records, skipped ${skipped} existing`);
    setCounts(prev => ({ ...prev, journals: created }));
    setStep('journals', 'done');
  }

  // Step 5: Mark duplicate assets
  async function markDuplicates() {
    setStep('duplicates', 'running');
    log('Marking duplicate assets...');

    const allArticles = await base44.entities.PublishingArticle.list('-created_date', 500).catch(() => []);
    let updated = 0;

    for (const group of DUPLICATE_GROUPS) {
      for (const sec of group.secondaries) {
        const match = allArticles.find(a => a.canon_id === sec.id);
        if (match) {
          try {
            await base44.entities.PublishingArticle.update(match.id, {
              canonical_status: sec.action === 'redirect' ? 'redirect' : 'secondary',
              canonical_target: group.canonical,
              workflow_notes: `Duplicate of ${group.canonical_title} (${group.canonical}). Reason: ${group.reason}`,
            });
            updated++;
            log(`  → Marked ${sec.id} (${sec.title}) as ${sec.action} → ${group.canonical}`);
          } catch (err) {
            log(`  ⚠ Failed to update ${sec.id}: ${err.message}`);
          }
        }
      }
    }
    log(`  ✓ Updated ${updated} duplicate records`);
    setStep('duplicates', 'done');
  }

  // Run all steps
  async function runMigration() {
    setRunning(true);
    setLogs([]);
    setStepStatus({});
    log('═══ Canon Migration Started ═══');

    try {
      await migrateArticles();
      await migrateCollections();
      await migrateVideos();
      await migrateJournals();
      await markDuplicates();
      log('═══ Migration Complete ═══');
      toast.success('Canon migration complete!');
    } catch (err) {
      log(`✗ Migration failed: ${err.message}`);
      toast.error('Migration failed — check logs');
    } finally {
      setRunning(false);
    }
  }

  return (
    <AdminGuard>
      <NoIndexMeta />
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-400" />
              <div>
                <h1 className="text-lg font-black">Canon Migration</h1>
                <p className="text-xs text-slate-500">R0.6.2 — Populate the Knowledge System</p>
              </div>
            </div>
            <button
              onClick={runMigration}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg text-sm font-bold transition-colors"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {running ? 'Running...' : 'Run Full Migration'}
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* Steps */}
          <div className="grid gap-3">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <step.icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{step.label}</p>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
                <span className="text-xs text-slate-600 font-mono">{step.count}</span>
                <StatusBadge status={stepStatus[step.id]} />
              </div>
            ))}
          </div>

          {/* Summary */}
          {Object.keys(counts).some(k => counts[k] > 0) && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Assets Created', value: counts.articles, color: 'cyan' },
                { label: 'Collections', value: counts.collections, color: 'purple' },
                { label: 'Videos', value: counts.videos, color: 'red' },
                { label: 'Journals', value: counts.journals, color: 'amber' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Migration Log</h3>
              <div className="font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                {logs.map((line, i) => (
                  <div key={i} className={`${line.includes('✓') ? 'text-green-400' : line.includes('⚠') ? 'text-amber-400' : line.includes('✗') ? 'text-red-400' : line.includes('═══') ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
