import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Zap, Users, FileText, Briefcase, Globe,
  Share2, MonitorPlay, ShieldCheck, ChevronRight
} from 'lucide-react';
import ProspectPipeline from '../components/ops/ProspectPipeline';
import ProposalManager from '../components/ops/ProposalManager';
import WorkflowTracker from '../components/ops/WorkflowTracker';

const TABS = [
  {
    id: 'prospects',
    label: 'Prospects & CRM',
    icon: Users,
    color: 'bg-amber-600',
    description: 'Find & manage prospects through the sales pipeline'
  },
  {
    id: 'proposals',
    label: 'Proposals',
    icon: FileText,
    color: 'bg-blue-600',
    description: 'Generate & track proposals for all services'
  },
  {
    id: 'fulfillment',
    label: 'Service Fulfillment',
    icon: Briefcase,
    color: 'bg-green-600',
    description: 'Active workflows for every service type'
  },
];

export default function OperationsHub() {
  const [activeTab, setActiveTab] = useState('prospects');

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h1 className="text-xl font-bold">Operations Hub</h1>
                </div>
                <p className="text-slate-400 text-sm">Prospect → Onboard → Propose → Fulfill → Retain</p>
              </div>
            </div>

            {/* Pipeline flow */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              {[
                { label: 'Prospect', color: 'text-amber-400', icon: Users },
                { label: 'Proposal', color: 'text-blue-400', icon: FileText },
                { label: 'Onboard', color: 'text-purple-400', icon: ShieldCheck },
                { label: 'Deliver', color: 'text-green-400', icon: Briefcase },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <React.Fragment key={s.label}>
                    <span className={`flex items-center gap-1 font-medium ${s.color}`}>
                      <Icon className="w-3 h-3" />{s.label}
                    </span>
                    {i < 3 && <ChevronRight className="w-3 h-3" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Services legend bar */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="font-medium text-slate-400">Services:</span>
            {[
              { label: 'Website New/Rebuild', icon: Globe, color: 'text-orange-400' },
              { label: 'Social DIY & DFY', icon: Share2, color: 'text-pink-400' },
              { label: 'ADA Compliance', icon: ShieldCheck, color: 'text-blue-400' },
              { label: 'Streaming TV', icon: MonitorPlay, color: 'text-purple-400' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <span key={s.label} className={`flex items-center gap-1 ${s.color}`}>
                  <Icon className="w-3 h-3" />{s.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Tab nav */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl p-4 text-left transition-all border ${isActive ? 'bg-slate-800 border-slate-600 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className={`${tab.color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{tab.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug">{tab.description}</p>
                </button>
              );
            })}
          </div>

          {activeTab === 'prospects' && <ProspectPipeline />}
          {activeTab === 'proposals' && <ProposalManager />}
          {activeTab === 'fulfillment' && <WorkflowTracker />}
        </div>
      </div>
    </AdminGuard>
  );
}