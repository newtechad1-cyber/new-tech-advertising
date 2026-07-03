/**
 * E-004 Sales Intelligence Workspace — Release 0.4
 * 
 * The intelligence-powered sales preparation workspace.
 * When a SalesLead is opened, this page automatically retrieves
 * ALL relevant knowledge from the Knowledge Search API.
 * 
 * Route: /admin/sales-intelligence/:leadId?
 * 
 * Everything comes from searchKnowledge(). No duplicate content.
 * Everything linked through the Knowledge Navigator.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Search, Brain, FileText, BookOpen, Target, Users,
  MessageSquare, Lightbulb, TrendingUp, Shield, Heart,
  ChevronRight, ChevronDown, Loader2, RefreshCw, ExternalLink,
  ArrowRight, Phone, Mail, Globe, MapPin, Building2,
  Zap, Star, Clock, CheckCircle2, AlertCircle, Network,
  Briefcase, Video, PenSquare, Bot
} from 'lucide-react';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const INTEL_SECTIONS = [
  { key: 'gap_audit_recommendations', label: 'Previous Audits', icon: Target, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  { key: 'discovery_questions', label: 'Discovery Calls', icon: Phone, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { key: 'case_studies', label: 'Related Case Studies', icon: Briefcase, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { key: 'blog_articles', label: 'Relevant Blog Articles', icon: FileText, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { key: 'learning_center', label: 'AI Learning Center', icon: BookOpen, color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
  { key: 'k_series', label: 'Industry Research', icon: Search, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { key: 'prompt_templates', label: 'Sales Prompts & Objections', icon: MessageSquare, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  { key: 'sops', label: 'SOPs & Workflows', icon: Zap, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  { key: 'founder_wisdom', label: 'Founder Stories', icon: Heart, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  { key: 'related_via_graph', label: 'Connected Knowledge', icon: Network, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { key: 'videos', label: 'Videos', icon: Video, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' }
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function SalesIntelligenceWorkspace() {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(leadId || null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Load leads list
  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await base44.entities.SalesLead.list({
          limit: 50,
          sort: { created_date: -1 }
        });
        setLeads(data || []);
        if (leadId) {
          const found = (data || []).find(l => (l.id || l._id) === leadId);
          if (found) setLead(found);
        }
      } catch (e) {
        console.error('Failed to load leads:', e);
      } finally {
        setLoadingLeads(false);
      }
    }
    loadLeads();
  }, [leadId]);

  // When a lead is selected, search knowledge
  const searchForLead = useCallback(async (selectedLead) => {
    if (!selectedLead) return;
    setLoading(true);
    setLead(selectedLead);

    try {
      const query = [
        selectedLead.industry,
        selectedLead.business_name,
        selectedLead.city,
        selectedLead.state
      ].filter(Boolean).join(' ');

      const context = `Preparing for sales conversation with ${selectedLead.business_name || 'prospect'}. ` +
        `Industry: ${selectedLead.industry || 'unknown'}. ` +
        `Location: ${[selectedLead.city, selectedLead.state].filter(Boolean).join(', ') || 'unknown'}.`;

      const results = await base44.functions.searchKnowledge({
        query: query || 'sales preparation',
        context,
        max_results: 8,
        include_relationships: true
      });

      setSearchResults(results?.results || {});

      // Auto-expand sections with results
      const expanded = {};
      for (const section of INTEL_SECTIONS) {
        if (results?.results?.[section.key]?.length > 0) {
          expanded[section.key] = true;
        }
      }
      setExpandedSections(expanded);

    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lead) searchForLead(lead);
  }, [selectedLeadId]);

  // Manual search
  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await base44.functions.searchKnowledge({
        query: searchQuery,
        context: lead ? `For lead: ${lead.business_name}` : '',
        max_results: 8,
        include_relationships: true
      });
      setSearchResults(results?.results || {});
      const expanded = {};
      for (const section of INTEL_SECTIONS) {
        if (results?.results?.[section.key]?.length > 0) {
          expanded[section.key] = true;
        }
      }
      setExpandedSections(expanded);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalResults = searchResults
    ? Object.values(searchResults).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0E17]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sales Intelligence Workspace</h1>
                <p className="text-sm text-white/50">E-004 — Knowledge-powered sales preparation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/knowledge-navigator" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 hover:text-white transition-colors">
                <Network className="w-4 h-4" />
                Knowledge Navigator
              </Link>
              <Link to="/admin/executive" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* ─── LEFT: Lead Selector ─── */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden sticky top-24">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Sales Leads</h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {loadingLeads ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
                  </div>
                ) : leads.length === 0 ? (
                  <div className="p-6 text-center text-white/40 text-sm">
                    No leads found
                  </div>
                ) : (
                  leads.map(l => {
                    const lid = l.id || l._id;
                    const isActive = lid === (selectedLeadId || leadId);
                    return (
                      <button
                        key={lid}
                        onClick={() => { setSelectedLeadId(lid); searchForLead(l); }}
                        className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                          isActive ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{l.business_name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Unknown'}</div>
                        <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                          {l.industry && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{l.industry}</span>}
                          {l.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.city}</span>}
                        </div>
                        {l.priority && (
                          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
                            l.priority === 'hot' ? 'bg-red-500/20 text-red-400' :
                            l.priority === 'warm' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {l.priority}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ─── CENTER + RIGHT: Intelligence Panel ─── */}
          <div className="flex-1 min-w-0">
            {/* Lead Header + Search */}
            {lead && (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{lead.business_name || 'Unknown Business'}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                      {lead.contact_name && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{lead.contact_name}</span>}
                      {lead.industry && <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{lead.industry}</span>}
                      {lead.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{[lead.city, lead.state].filter(Boolean).join(', ')}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{lead.email}</span>}
                      {lead.website && <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-400"><Globe className="w-4 h-4" />{lead.website}</a>}
                    </div>
                  </div>
                  <button
                    onClick={() => searchForLead(lead)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh Intelligence
                  </button>
                </div>
                {totalResults > 0 && (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {totalResults} knowledge assets found across {Object.values(searchResults || {}).filter(a => Array.isArray(a) && a.length > 0).length} categories
                  </div>
                )}
              </div>
            )}

            {/* Manual Search */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search all knowledge... (e.g., trust signals, HVAC, SEO, sales objections)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <button
                  onClick={handleManualSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  Search Knowledge
                </button>
              </div>
            </div>

            {/* No selection state */}
            {!lead && !searchResults && (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-12 text-center">
                <Brain className="w-12 h-12 text-cyan-400/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white/70 mb-2">Select a Lead or Search</h3>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Choose a lead from the sidebar to automatically retrieve all relevant knowledge,
                  or use the search bar to query the entire NTA knowledge network.
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                <p className="text-sm text-white/50">Searching knowledge graph and all domains...</p>
              </div>
            )}

            {/* Results */}
            {!loading && searchResults && (
              <div className="space-y-3">
                {INTEL_SECTIONS.map(section => {
                  const items = searchResults[section.key] || [];
                  if (items.length === 0) return null;
                  const Icon = section.icon;
                  const isExpanded = expandedSections[section.key];

                  return (
                    <div key={section.key} className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.key)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${section.color}`} />
                          </div>
                          <span className="font-medium text-sm">{section.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                            {items.length}
                          </span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/30" />}
                      </button>

                      {isExpanded && (
                        <div className="border-t border-white/5">
                          {items.map((item, idx) => (
                            <div key={idx} className="p-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{item.title}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      item.found_via === 'graph' ? 'bg-teal-500/20 text-teal-400' :
                                      item.found_via === 'ai_match' ? 'bg-violet-500/20 text-violet-400' :
                                      'bg-white/10 text-white/50'
                                    }`}>
                                      {item.found_via === 'graph' ? 'VIA GRAPH' : item.found_via === 'ai_match' ? 'AI MATCH' : 'KEYWORD'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-white/40 line-clamp-2">{item.summary}</p>
                                  {item.relationship_path && (
                                    <p className="text-xs text-teal-400/60 mt-1 flex items-center gap-1">
                                      <Network className="w-3 h-3" />{item.relationship_path}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className={`text-xs font-mono ${
                                    item.relevance_score >= 80 ? 'text-emerald-400' :
                                    item.relevance_score >= 60 ? 'text-amber-400' :
                                    'text-white/40'
                                  }`}>
                                    {item.relevance_score}%
                                  </div>
                                  <span className="text-xs text-white/20 px-2 py-0.5 rounded border border-white/10">
                                    {item.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {totalResults === 0 && (
                  <div className="bg-[#111827] border border-white/10 rounded-xl p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-400/30 mx-auto mb-3" />
                    <p className="text-sm text-white/50">No knowledge found for this search. Try different terms or check if knowledge has been captured for this industry.</p>
                  </div>
                )}
              </div>
            )}

            {/* AI Suggestions Footer */}
            {!loading && searchResults && totalResults > 0 && (
              <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">Intelligence Summary</span>
                </div>
                <p className="text-xs text-white/50">
                  {totalResults} relevant knowledge assets retrieved across {Object.values(searchResults).filter(a => Array.isArray(a) && a.length > 0).length} categories.
                  {searchResults.related_via_graph?.length > 0 && ` ${searchResults.related_via_graph.length} assets found through the Knowledge Relationship graph.`}
                  {' '}All results powered by K-003 Knowledge Search API.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
