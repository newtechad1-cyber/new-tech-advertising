/**
 * Knowledge Dependency Map — Release 0.4
 * 
 * Internal tool showing system dependencies.
 * Every system should know what it depends on and what depends on it.
 * 
 * Displays dependency warnings: if someone edits E-000,
 * show every downstream document affected.
 * 
 * Route: /admin/knowledge-dependencies
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ChevronRight, ChevronDown, ArrowDown,
  Shield, Network, Search, ExternalLink, Info, Zap,
  FileText, Brain, Target, BookOpen, TrendingUp, Star,
  Layers, GitBranch, AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────
// Dependency Tree — NTA Operating System
// ─────────────────────────────────────────────

const DEPENDENCY_TREE = [
  {
    id: 'E-000',
    name: 'NTA Operating System Constitution',
    series: 'E-Series',
    type: 'foundational',
    icon: Shield,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    description: 'Root document. All systems reference this.',
    route: null,
    dependsOn: [],
    children: ['K-000']
  },
  {
    id: 'K-000',
    name: 'Knowledge Map',
    series: 'K-Series',
    type: 'document',
    icon: FileText,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'Inventory of all knowledge assets.',
    route: null,
    dependsOn: ['E-000'],
    children: ['K-001']
  },
  {
    id: 'K-001',
    name: 'Knowledge Engine',
    series: 'K-Series',
    type: 'system',
    icon: Brain,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'KnowledgeCapture entity + organize function.',
    route: '/admin/knowledge-capture',
    dependsOn: ['K-000'],
    children: ['K-002']
  },
  {
    id: 'K-002',
    name: 'Knowledge Navigator',
    series: 'K-Series',
    type: 'system',
    icon: Network,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'KnowledgeRelationship entity + 3-panel workspace.',
    route: '/admin/knowledge-navigator',
    dependsOn: ['K-001'],
    children: ['K-003']
  },
  {
    id: 'K-003',
    name: 'Knowledge Search API',
    series: 'K-Series',
    type: 'function',
    icon: Search,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'searchKnowledge() — the Intelligence Layer core service.',
    route: null,
    dependsOn: ['K-002'],
    children: ['E-002', 'E-003', 'E-004', 'A-006']
  },
  {
    id: 'E-002',
    name: 'AI Visibility Audit',
    series: 'E-Series',
    type: 'system',
    icon: Target,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'GapAudit entity + scan function + PDF report.',
    route: null,
    dependsOn: ['K-003'],
    children: ['E-003']
  },
  {
    id: 'E-003',
    name: 'Discovery Call Workspace',
    series: 'E-Series',
    type: 'system',
    icon: BookOpen,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'DiscoveryCall entity + 3-panel cockpit.',
    route: '/admin/discovery-call',
    dependsOn: ['E-002', 'K-003'],
    children: ['E-004']
  },
  {
    id: 'E-004',
    name: 'Sales Intelligence Workspace',
    series: 'E-Series',
    type: 'system',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'Knowledge-powered sales preparation.',
    route: '/admin/sales-intelligence',
    dependsOn: ['E-003', 'K-003'],
    children: ['client_success']
  },
  {
    id: 'A-006',
    name: 'Knowledge Capture Automation',
    series: 'A-Series',
    type: 'automation',
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    description: 'Auto-capture from triggers → Knowledge Review Queue.',
    route: '/admin/knowledge-review',
    dependsOn: ['K-003', 'K-001'],
    children: ['knowledge_capture']
  },
  {
    id: 'M-001',
    name: 'Executive Dashboard',
    series: 'M-Series',
    type: 'system',
    icon: TrendingUp,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    description: 'CEO Cockpit + Intelligence section.',
    route: '/admin/executive',
    dependsOn: ['K-003', 'E-004', 'A-006'],
    children: []
  },
  {
    id: 'A-005',
    name: 'Viktor Social Publishing',
    series: 'A-Series',
    type: 'automation',
    icon: Star,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    description: 'Multi-platform social content publishing.',
    route: null,
    dependsOn: ['E-000'],
    children: []
  },
  {
    id: 'client_success',
    name: 'Client Success',
    series: 'Outcome',
    type: 'outcome',
    icon: Star,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'The result of the entire operating system.',
    route: null,
    dependsOn: ['E-004'],
    children: ['case_study']
  },
  {
    id: 'case_study',
    name: 'Case Study',
    series: 'Outcome',
    type: 'outcome',
    icon: FileText,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'Documented success → feeds back into knowledge.',
    route: null,
    dependsOn: ['client_success'],
    children: ['knowledge_capture']
  },
  {
    id: 'knowledge_capture',
    name: 'Knowledge Capture',
    series: 'Cycle',
    type: 'cycle',
    icon: Layers,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    description: 'New knowledge feeds back into the operating system.',
    route: '/admin/knowledge-capture',
    dependsOn: ['case_study', 'A-006'],
    children: ['continuous_improvement']
  },
  {
    id: 'continuous_improvement',
    name: 'Continuous Improvement',
    series: 'Cycle',
    type: 'cycle',
    icon: GitBranch,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    description: 'The cycle completes. Every improvement makes the next easier.',
    route: null,
    dependsOn: ['knowledge_capture'],
    children: []
  }
];

// ─────────────────────────────────────────────
// Helper: find all downstream dependencies
// ─────────────────────────────────────────────

function getDownstream(nodeId, tree) {
  const result = [];
  const visited = new Set();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    const node = tree.find(n => n.id === current);
    if (!node) continue;

    for (const childId of node.children) {
      if (!visited.has(childId)) {
        visited.add(childId);
        result.push(childId);
        queue.push(childId);
      }
    }
  }

  return result;
}

function getUpstream(nodeId, tree) {
  const result = [];
  const visited = new Set();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    const node = tree.find(n => n.id === current);
    if (!node) continue;

    for (const depId of node.dependsOn) {
      if (!visited.has(depId)) {
        visited.add(depId);
        result.push(depId);
        queue.push(depId);
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function KnowledgeDependencyMap() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const downstream = useMemo(() =>
    selectedNode ? getDownstream(selectedNode, DEPENDENCY_TREE) : [],
    [selectedNode]
  );

  const upstream = useMemo(() =>
    selectedNode ? getUpstream(selectedNode, DEPENDENCY_TREE) : [],
    [selectedNode]
  );

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return DEPENDENCY_TREE;
    const q = searchQuery.toLowerCase();
    return DEPENDENCY_TREE.filter(n =>
      n.id.toLowerCase().includes(q) ||
      n.name.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedNodeData = DEPENDENCY_TREE.find(n => n.id === selectedNode);

  // Main chain for visualization
  const mainChain = ['E-000', 'K-000', 'K-001', 'K-002', 'K-003', 'E-002', 'E-003', 'E-004', 'client_success', 'case_study', 'knowledge_capture', 'continuous_improvement'];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0E17]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Knowledge Dependency Map</h1>
                <p className="text-sm text-white/50">Release 0.4 — Internal system dependency tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/knowledge-navigator" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 hover:text-white transition-colors">
                <Network className="w-4 h-4" />
                Navigator
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* ─── LEFT: Dependency Chain ─── */}
          <div className="w-96 flex-shrink-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Filter systems..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Chain */}
            <div className="space-y-1">
              {filteredTree.map((node, idx) => {
                const Icon = node.icon;
                const isSelected = selectedNode === node.id;
                const isDownstream = downstream.includes(node.id);
                const isUpstream = upstream.includes(node.id);
                const isInChain = mainChain.includes(node.id);

                return (
                  <div key={node.id}>
                    <button
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-violet-500/15 border-violet-500/40'
                          : isDownstream
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : isUpstream
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-[#111827] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${node.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${node.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white/40">{node.id}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              node.type === 'foundational' ? 'bg-violet-500/20 text-violet-400' :
                              node.type === 'system' ? 'bg-cyan-500/20 text-cyan-400' :
                              node.type === 'function' ? 'bg-emerald-500/20 text-emerald-400' :
                              node.type === 'automation' ? 'bg-amber-500/20 text-amber-400' :
                              node.type === 'outcome' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-teal-500/20 text-teal-400'
                            }`}>
                              {node.type}
                            </span>
                          </div>
                          <div className="text-sm font-medium mt-0.5">{node.name}</div>
                        </div>
                        {isDownstream && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      </div>
                    </button>

                    {/* Arrow connector for main chain */}
                    {isInChain && idx < filteredTree.length - 1 && mainChain.includes(filteredTree[idx + 1]?.id) && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className="w-4 h-4 text-white/15" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── RIGHT: Detail Panel ─── */}
          <div className="flex-1">
            {selectedNodeData ? (
              <div className="space-y-6">
                {/* Selected node header */}
                <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${selectedNodeData.bgColor} flex items-center justify-center`}>
                      {React.createElement(selectedNodeData.icon, { className: `w-6 h-6 ${selectedNodeData.color}` })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/40">{selectedNodeData.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50">{selectedNodeData.series}</span>
                      </div>
                      <h2 className="text-xl font-bold">{selectedNodeData.name}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/50">{selectedNodeData.description}</p>
                  {selectedNodeData.route && (
                    <Link to={selectedNodeData.route} className="inline-flex items-center gap-2 mt-3 text-sm text-cyan-400 hover:text-cyan-300">
                      <ExternalLink className="w-4 h-4" />
                      Open {selectedNodeData.name}
                    </Link>
                  )}
                </div>

                {/* Dependency Warning */}
                {downstream.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold text-amber-400">Dependency Warning</span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">
                      Editing <strong>{selectedNodeData.id}</strong> affects <strong>{downstream.length}</strong> downstream system{downstream.length > 1 ? 's' : ''}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {downstream.map(id => {
                        const node = DEPENDENCY_TREE.find(n => n.id === id);
                        return node ? (
                          <button
                            key={id}
                            onClick={() => setSelectedNode(id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 rounded-lg text-sm text-amber-400 hover:bg-amber-500/25 transition-colors"
                          >
                            {React.createElement(node.icon, { className: 'w-3.5 h-3.5' })}
                            {node.id}: {node.name}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Upstream Dependencies */}
                {upstream.length > 0 && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold text-cyan-400">Depends On</span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">
                      <strong>{selectedNodeData.id}</strong> requires these {upstream.length} upstream system{upstream.length > 1 ? 's' : ''}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {upstream.map(id => {
                        const node = DEPENDENCY_TREE.find(n => n.id === id);
                        return node ? (
                          <button
                            key={id}
                            onClick={() => setSelectedNode(id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                          >
                            {React.createElement(node.icon, { className: 'w-3.5 h-3.5' })}
                            {node.id}: {node.name}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Direct connections table */}
                <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Direct Connections</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider">Direction</th>
                        <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider">System</th>
                        <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedNodeData.dependsOn.map(depId => {
                        const dep = DEPENDENCY_TREE.find(n => n.id === depId);
                        return dep ? (
                          <tr key={depId} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-cyan-400">← Depends On</td>
                            <td className="px-4 py-3">
                              <button onClick={() => setSelectedNode(depId)} className="hover:text-cyan-400 transition-colors">
                                {dep.id}: {dep.name}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-white/40">{dep.type}</td>
                          </tr>
                        ) : null;
                      })}
                      {selectedNodeData.children.map(childId => {
                        const child = DEPENDENCY_TREE.find(n => n.id === childId);
                        return child ? (
                          <tr key={childId} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-amber-400">→ Required By</td>
                            <td className="px-4 py-3">
                              <button onClick={() => setSelectedNode(childId)} className="hover:text-amber-400 transition-colors">
                                {child.id}: {child.name}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-white/40">{child.type}</td>
                          </tr>
                        ) : null;
                      })}
                      {selectedNodeData.dependsOn.length === 0 && selectedNodeData.children.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-white/30">No direct connections</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-12 text-center">
                <GitBranch className="w-12 h-12 text-violet-400/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white/70 mb-2">Select a System</h3>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Click any system in the dependency chain to see what it depends on,
                  what depends on it, and the impact of changes.
                </p>
                <div className="mt-6 p-4 bg-white/5 rounded-lg max-w-sm mx-auto">
                  <p className="text-xs text-white/40">
                    <strong className="text-violet-400">Architecture Rule:</strong> No new knowledge silos.
                    Before creating anything, search existing knowledge, search relationships,
                    recommend reuse. Only create new assets if necessary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
