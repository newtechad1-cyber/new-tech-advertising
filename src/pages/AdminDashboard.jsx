import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  BookOpen, ShoppingBag, Mail, Users, Image, Video,
  StickyNote, HelpCircle, ArrowLeft, Zap, RefreshCw,
  Calendar, DollarSign, FileText, TrendingUp, MonitorPlay, Briefcase,
  Globe, Share2, BarChart2
} from 'lucide-react';
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
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(null);

  const handleTileClick = (tile) => {
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
      <div className="min-h-screen bg-slate-950 text-white">
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
                      {category.tiles.map((tile) => {
                        const Icon = tile.icon;
                        return (
                          <button
                            key={tile.id}
                            onClick={() => handleTileClick(tile)}
                            className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105 hover:shadow-xl"
                          >
                            <div className={`${tile.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-white text-base mb-1">{tile.label}</h3>
                            <p className="text-slate-500 text-xs">{tile.description}</p>
                          </button>
                        );
                      })}
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
    </AdminGuard>
  );
}