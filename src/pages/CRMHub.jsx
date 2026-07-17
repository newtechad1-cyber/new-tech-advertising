import { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, Users, Mail, UserCheck, Route, Repeat2,
  ArrowLeft, Zap, ChevronRight, WandSparkles
} from 'lucide-react';

import LeadPipeline from '../components/crm/LeadPipeline';
import LeadDetailPanel from '../components/crm/LeadDetailPanel';
import ClientsRoster from '../components/crm/ClientsRoster';
import EmailCampaigns from '../components/crm/EmailCampaigns';
import SubscribersManager from '../components/crm/SubscribersManager';
import OnlineSalesJourney from '../components/crm/OnlineSalesJourney';
import IntroductionCampaigns from '../components/crm/IntroductionCampaigns';
import ProspectingWizard from '../components/crm/ProspectingWizard';

const TABS = [
  {
    id: 'wizard',
    label: 'Start Here',
    icon: WandSparkles,
    color: 'bg-violet-600',
    activeColor: 'text-violet-300',
    description: 'Guided prospect-to-first-touch setup'
  },
  {
    id: 'journey',
    label: 'Online Sales Journey',
    icon: Route,
    color: 'bg-violet-600',
    activeColor: 'text-violet-400',
    description: 'Your complete prospect-to-relationship process'
  },
  {
    id: 'leads',
    label: 'Prospecting',
    icon: TrendingUp,
    color: 'bg-amber-600',
    activeColor: 'text-amber-400',
    description: 'Find people, make contact & follow up'
  },
  {
    id: 'introduction',
    label: '7-Touch Campaign',
    icon: Repeat2,
    color: 'bg-cyan-600',
    activeColor: 'text-cyan-400',
    description: 'Seven useful contacts that earn permission'
  },
  {
    id: 'clients',
    label: 'Active Clients',
    icon: Users,
    color: 'bg-green-600',
    activeColor: 'text-green-400',
    description: 'Manage clients after the sale'
  },
  {
    id: 'email',
    label: 'NTA Journal',
    icon: Mail,
    color: 'bg-blue-600',
    activeColor: 'text-blue-400',
    description: 'Weekly teaching email & welcome sequence'
  },
  {
    id: 'subscribers',
    label: 'Journal Subscribers',
    icon: UserCheck,
    color: 'bg-orange-600',
    activeColor: 'text-orange-400',
    description: 'Permission-based list & interests'
  },
];

export default function CRMHub() {
  const [activeTab, setActiveTab] = useState('wizard');
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h1 className="text-xl font-bold">Prospecting & Relationship Hub</h1>
                </div>
                <p className="text-slate-400 text-sm">Your old relationship-based sales method, translated into one connected online process</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline breadcrumb banner */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="text-amber-400 font-medium">Prospect Identified</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-400 font-medium">Personal Introduction</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-orange-400 font-medium">Journal Relationship</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-violet-400 font-medium">Growth Conversation</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-purple-400 font-medium">Roadmap / Sales Room</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-green-400 font-medium">Client → Lasting Relationship</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-8">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); if (tab.id !== 'leads') setSelectedLead(null); }}
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

          {/* Content area */}
          <div className={`${selectedLead && activeTab === 'leads' ? 'flex gap-6' : ''}`}>
            <div className={selectedLead && activeTab === 'leads' ? 'flex-1 min-w-0' : 'w-full'}>
              {activeTab === 'leads' && (
                <LeadPipeline
                  selectedLeadId={selectedLead?.id}
                  onSelectLead={setSelectedLead}
                />
              )}
              {activeTab === 'wizard' && <ProspectingWizard onNavigate={setActiveTab} />}
              {activeTab === 'journey' && <OnlineSalesJourney onNavigate={setActiveTab} />}
              {activeTab === 'introduction' && <IntroductionCampaigns />}
              {activeTab === 'clients' && <ClientsRoster />}
              {activeTab === 'email' && <EmailCampaigns />}
              {activeTab === 'subscribers' && <SubscribersManager />}
            </div>

            {/* Lead detail panel */}
            {selectedLead && activeTab === 'leads' && (
              <div className="w-[380px] flex-shrink-0">
                <LeadDetailPanel
                  lead={selectedLead}
                  onClose={() => setSelectedLead(null)}
                  onSubscribeToEmail={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
