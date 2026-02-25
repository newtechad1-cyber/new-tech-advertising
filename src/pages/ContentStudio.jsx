import React, { useState } from 'react';
import AdminGuard from '../components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  BookOpen, ShoppingBag, Mail, Users, Image, Video,
  StickyNote, HelpCircle, ArrowLeft, Zap, RefreshCw, Share2
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
import SocialImagePost from '../components/studio/SocialImagePost';

const SECTIONS = [
  { id: 'ebook', label: 'Ebook Writer', icon: BookOpen, color: 'bg-violet-500', description: 'Write & organize chapters' },
  { id: 'products', label: 'Products', icon: ShoppingBag, color: 'bg-emerald-500', description: 'Manage your store items' },
  { id: 'email', label: 'Email Marketing', icon: Mail, color: 'bg-blue-500', description: 'Broadcasts & campaigns' },
  { id: 'autoresponder', label: 'Autoresponder', icon: RefreshCw, color: 'bg-cyan-500', description: 'Automated email sequences' },
  { id: 'subscribers', label: 'Subscribers', icon: Users, color: 'bg-orange-500', description: 'Manage your list' },
  { id: 'images', label: 'Images', icon: Image, color: 'bg-pink-500', description: 'Media library for social & video' },
  { id: 'social_post', label: 'Post to Social', icon: Share2, color: 'bg-blue-500', description: 'Post images to Facebook & Instagram' },
  { id: 'videos', label: 'Videos', icon: Video, color: 'bg-red-500', description: 'Video assets & links' },
  { id: 'notes', label: 'Notes', icon: StickyNote, color: 'bg-yellow-500', description: 'Ideas & reminders' },
];

const SECTION_COMPONENTS = {
  ebook: EbookWriter,
  products: ProductsStore,
  email: EmailMarketing,
  autoresponder: Autoresponder,
  subscribers: SubscribersList,
  images: MediaImages,
  videos: MediaVideos,
  notes: StudioNotes,
};

export default function ContentStudio() {
  const [activeSection, setActiveSection] = useState(null);

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;
  const activeData = activeSection ? SECTIONS.find(s => s.id === activeSection) : null;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeSection ? (
                <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)} className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : (
                <Link to={createPageUrl('AdminDashboard')}>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Admin
                  </Button>
                </Link>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h1 className="text-xl font-bold">
                    {activeData ? activeData.label : 'Content Studio'}
                  </h1>
                </div>
                <p className="text-slate-400 text-sm">
                  {activeData ? activeData.description : 'Manage all your marketing content'}
                </p>
              </div>
            </div>
            <Link to={createPageUrl('AdminHelp')}>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <HelpCircle className="w-4 h-4 mr-2" /> Help
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {!activeSection ? (
            // Hub View
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What would you like to work on?</h2>
                <p className="text-slate-400">Pick a section to get started. Everything you need to launch faster.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
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
            // Active Section
            <div>
              {ActiveComponent && <ActiveComponent />}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}