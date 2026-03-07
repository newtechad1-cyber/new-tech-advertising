import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  BookOpen, ShoppingBag, Mail, Users, Image, Video,
  StickyNote, HelpCircle, ArrowLeft, Zap, RefreshCw,
  Calendar, DollarSign, FileText, TrendingUp, MonitorPlay, Briefcase,
  Globe, Share2, BarChart2, Lock, X, BrainCircuit, Settings, CalendarDays, Wrench, Cpu, Tv
} from 'lucide-react';
import AdminNav from '../components/nav/AdminNav';
import { Button } from '@/components/ui/button';

import EbookWriter from '../components/studio/EbookWriter';
import ProductsStore from '../components/studio/ProductsStore';
import EmailMarketing from '../components/studio/EmailMarketing';
import Autoresponder from '../components/studio/Autoresponder';
import SubscribersList from '../components/studio/SubscribersList';
import MediaImages from '../components/studio/MediaImages';
import MediaVideos from '../components/studio/MediaVideos';
import StudioNotes from '../components/studio/StudioNotes';
import SchedulingQueue from '../components/admin/SchedulingQueue';
import UpsellQueue from '../components/admin/UpsellQueue';
import ClientsList from '../components/admin/ClientsList';
import ClientManagement from '../components/admin/ClientManagement';
import PortfolioManagement from '../components/admin/PortfolioManagement';
import GoogleAnalyticsView from '../components/admin/GoogleAnalyticsView';
import SocialAccounts from './SocialAccounts';
import AdminHelpSupport from '../components/admin/AdminHelpSupport';
import CampaignCreationWizard from '../components/admin/CampaignCreationWizard';

// Module IDs that are locked behind an upgrade
const LOCKED_MODULE_IDS = new Set([
  // Add module IDs here to lock them, e.g. 'ebook', 'autoresponder'
  // Leave empty to have no locked modules
]);

const CATEGORIES = [
  {
    id: 'website',
    label: 'Website Management',
    icon: Globe,
    color: 'text-sky-400',
    tiles: [
      { id: 'blog', label: 'Blog Management', icon: FileText, color: 'bg-rose-500', description: 'Create & edit blog posts', link: 'AdminBlog' },
      { id: 'products', label: 'Products', icon: ShoppingBag, color: 'bg-emerald-500', description: 'Manage your store items' },
      { id: 'ebook', label: 'Ebook Writer', icon: BookOpen, color: 'bg-violet-500', description: 'Write & organize chapters' },
      { id: 'analytics', label: 'Analytics', icon: BarChart2, color: 'bg-sky-500', description: 'Google Analytics data' },
      { id: 'portfolio', label: 'Portfolio', icon: Briefcase, color: 'bg-teal-500', description: 'Manage showcase work' },
      { id: 'notes', label: 'Notes', icon: StickyNote, color: 'bg-yellow-500', description: 'Ideas & reminders' },
    ]
  },
  {
    id: 'social',
    label: 'Social Media Management',
    icon: Share2,
    color: 'text-pink-400',
    tiles: [
      { id: 'ai-video-studio', label: 'AI Video Studio', icon: MonitorPlay, color: 'bg-indigo-500', description: 'Generate AI videos from script', link: 'AiVideoStudio' },
      { id: 'streaming-tv-generator', label: 'Streaming TV Scripts', icon: Tv, color: 'bg-purple-600', description: 'AI-generate TV ad scripts for your pages', link: 'AdminVideoGenerator' },
      { id: 'website-video-manager', label: 'Website Video Manager', icon: Video, color: 'bg-violet-700', description: 'Auto-generate & publish videos for website placeholders', link: 'WebsiteVideoManager' },
      { id: 'social-accounts', label: 'Connected Channels', icon: Share2, color: 'bg-violet-600', description: 'Connect & manage social accounts' },
      { id: 'images', label: 'Images', icon: Image, color: 'bg-pink-500', description: 'Media library for social & video' },
      { id: 'videos', label: 'Videos', icon: Video, color: 'bg-red-500', description: 'Video assets & links' },
    ]
  },
  {
    id: 'email',
    label: 'Email Marketing',
    icon: Mail,
    color: 'text-blue-400',
    tiles: [
      { id: 'email-marketing', label: 'Email Marketing', icon: Mail, color: 'bg-blue-400', description: 'Broadcasts & campaigns' },
      { id: 'autoresponder', label: 'Autoresponder', icon: RefreshCw, color: 'bg-cyan-500', description: 'Automated email sequences' },
      { id: 'subscribers', label: 'Subscribers', icon: Users, color: 'bg-orange-500', description: 'Manage your list' },
    ]
  },
  {
    id: 'customers',
    label: 'CRM & Marketing',
    icon: Users,
    color: 'text-green-400',
    tiles: [
      { id: 'crm-hub', label: 'CRM & Marketing Hub', icon: Users, color: 'bg-green-500', description: 'Leads, clients, email & subscribers', link: 'CRMHub' },
      { id: 'operations-hub', label: 'Operations Hub', icon: Briefcase, color: 'bg-amber-600', description: 'Prospect → Proposal → Fulfillment workflows', link: 'OperationsHub' },
    ]
  },
  {
    id: 'ai-content-engine',
    label: 'AI Content Engine',
    icon: BrainCircuit,
    color: 'text-violet-400',
    tiles: [
      { id: 'global-settings', label: 'System Settings', icon: Settings, color: 'bg-slate-600', description: 'Business info & AI configuration', link: 'GlobalSettings' },
      { id: 'authority-map', label: 'Weekly Authority Plans', icon: BrainCircuit, color: 'bg-violet-600', description: 'Topical authority maps & pillars', link: 'AuthorityMap' },
      { id: 'content-queue', label: 'Content Calendar & Queue', icon: CalendarDays, color: 'bg-fuchsia-600', description: 'Planned, generated & published content', link: 'ContentQueue' },
      { id: 'onboarding-queue', label: 'Trial Onboarding Queue', icon: Users, color: 'bg-green-600', description: 'Review & configure new trial accounts', link: 'AdminOnboardingQueue' },
      { id: 'ai-operations', label: 'AI Operations', icon: Cpu, color: 'bg-violet-800', description: 'Tasks, budgets, cost ledger & memory', link: 'AiOperations' },
      { id: 'agent-architecture', label: 'Agent Architecture', icon: BrainCircuit, color: 'bg-fuchsia-700', description: '22-agent event-driven business system', link: 'AgentArchitecture' },
      { id: 'workflow-map', label: 'Workflow Map', icon: Wrench, color: 'bg-teal-700', description: 'Master page → entity → agent architecture map', link: 'WorkflowMap' },
    ]
  },
];

// Flat list of all tiles for lookup
const ALL_TILES = CATEGORIES.flatMap(c => c.tiles);

const SECTION_COMPONENTS = {
  crm: ClientManagement,
  clients: ClientsList,
  ebook: EbookWriter,
  products: ProductsStore,
  'email-marketing': EmailMarketing,
  autoresponder: Autoresponder,
  subscribers: SubscribersList,
  images: MediaImages,
  videos: MediaVideos,
  notes: StudioNotes,
  portfolio: PortfolioManagement,
  analytics: GoogleAnalyticsView,
  'social-accounts': SocialAccounts,
  help: AdminHelpSupport,
};

function UpgradeModal({ tile, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`${tile.color} w-10 h-10 rounded-lg flex items-center justify-center opacity-60`}>
              <tile.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{tile.label}</h2>
              <p className="text-slate-400 text-sm">Upgrade required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-medium mb-1">This module requires an upgrade</p>
            <p className="text-slate-400 text-sm">
              {tile.description} is available on a higher plan. Upgrade your account to unlock access to <strong className="text-white">{tile.label}</strong> and more.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            onClick={() => window.location.href = createPageUrl('AdminSettings')}
          >
            Upgrade Plan
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModuleTile({ tile, onOpen }) {
  const isLocked = LOCKED_MODULE_IDS.has(tile.id);
  const Icon = tile.icon;

  return (
    <button
      onClick={() => onOpen(tile)}
      className={`group relative border rounded-xl p-6 text-left transition-all duration-200 ${
        isLocked
          ? 'bg-slate-900/50 border-slate-800 opacity-60 cursor-pointer hover:opacity-80'
          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-600 hover:scale-105 hover:shadow-xl'
      }`}
    >
      {isLocked && (
        <div className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-2 py-0.5 flex items-center gap-1">
          <Lock className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-medium">Upgrade</span>
        </div>
      )}
      <div className={`${tile.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${!isLocked && 'group-hover:scale-110'} transition-transform ${isLocked ? 'grayscale' : ''}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className={`font-bold text-base mb-1 ${isLocked ? 'text-slate-500' : 'text-white'}`}>{tile.label}</h3>
      <p className="text-slate-500 text-xs">{tile.description}</p>
    </button>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState(null);
  const [initializeLoading, setInitializeLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const handleInitializeQueue = async () => {
    setInitializeLoading(true);
    try {
      const { data } = await base44.functions.invoke('initializeProgrammaticSEOQueue', { reset: true });
      alert('Queue initialized! ' + data.message);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setInitializeLoading(false);
    }
  };

  const handleTileOpen = (tile) => {
    if (LOCKED_MODULE_IDS.has(tile.id)) {
      setUpgradeModal(tile);
      return;
    }
    if (tile.link) {
      window.location.href = createPageUrl(tile.link);
    } else {
      setActiveSection(tile.id);
    }
  };

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;
  const activeData = activeSection ? ALL_TILES.find(t => t.id === activeSection) : null;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AdminNav />
        <div className="flex-1 lg:pl-60">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeSection && (
                <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h1 className="text-xl font-bold">
                    {activeData ? activeData.label : 'Admin Hub'}
                  </h1>
                </div>
                <p className="text-slate-400 text-sm">
                  {activeData ? activeData.description : 'Operations & management center'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleInitializeQueue}
                disabled={initializeLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${initializeLoading ? 'animate-spin' : ''}`} />
                {initializeLoading ? 'Initializing...' : 'Initialize Queue'}
              </Button>
              <Link to={createPageUrl('ClientDashboardDemo')}>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  See How It Works
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Client View
                </Button>
              </Link>
              <Link to={createPageUrl('AdminHelp')}>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <HelpCircle className="w-4 h-4 mr-2" /> Help
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {!activeSection ? (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What would you like to work on?</h2>
                <p className="text-slate-400">Pick a section to get started.</p>
              </div>
              {CATEGORIES.map((category) => {
                const CatIcon = category.icon;
                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <CatIcon className={`w-5 h-5 ${category.color}`} />
                      <h3 className={`text-lg font-semibold ${category.color}`}>{category.label}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {category.tiles.map((tile) => (
                        <ModuleTile key={tile.id} tile={tile} onOpen={handleTileOpen} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {ActiveComponent && <ActiveComponent />}
            </div>
          )}
        </div>
        </div>
      </div>

      {upgradeModal && (
        <UpgradeModal tile={upgradeModal} onClose={() => setUpgradeModal(null)} />
      )}
    </AdminGuard>
  );
}