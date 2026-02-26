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
    label: 'Customer Management',
    icon: Users,
    color: 'text-green-400',
    tiles: [
      { id: 'clients', label: 'Client Management', icon: Users, color: 'bg-green-500', description: 'View all clients' },
      { id: 'leads', label: 'Leads Dashboard', icon: TrendingUp, color: 'bg-amber-500', description: 'Manage incoming leads', link: 'LeadsDashboard' },
    ]
  },
];

// Flat list of all tiles for lookup
const ALL_TILES = CATEGORIES.flatMap(c => c.tiles);

const SECTION_COMPONENTS = {
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

  const handleSectionClick = (section) => {
    if (section.link) {
      window.location.href = createPageUrl(section.link);
    } else {
      setActiveSection(section.id);
    }
  };

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;
  const activeData = activeSection ? SECTIONS.find(s => s.id === activeSection) : null;

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
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What would you like to work on?</h2>
                <p className="text-slate-400">Pick a section to get started.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section)}
                      className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105 hover:shadow-xl"
                    >
                      <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{section.label}</h3>
                      <p className="text-slate-500 text-xs">{section.description}</p>
                    </button>
                  );
                })}
              </div>
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