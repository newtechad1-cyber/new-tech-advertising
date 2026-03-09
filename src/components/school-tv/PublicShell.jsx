import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import TopBar from './TopBar';
import { Home, BookOpen, Video, Newspaper, Calendar, Star, Upload, Info } from 'lucide-react';

const PUBLIC_NAV = [
  { label: 'Home', icon: Home, path: 'home' },
  { label: 'Yearbook', icon: BookOpen, path: 'yearbook' },
  { label: 'Video Hub', icon: Video, path: 'tv' },
  { label: 'Stories', icon: Newspaper, path: 'stories' },
  { label: 'Events', icon: Calendar, path: 'events' },
  { label: 'Spotlights', icon: Star, path: 'spotlights' },
  { label: 'Submit', icon: Upload, path: 'submit' },
  { label: 'About', icon: Info, path: 'about' },
];

export default function PublicShell({ children, currentPath }) {
  const { schoolSlug } = useParams();
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });
        if (data.length > 0) {
          setBranding(data[0]);
        }
      } catch (error) {
        console.error('Error loading branding:', error);
      }
    };
    loadData();
  }, [schoolSlug]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar schoolName={branding?.school_name || schoolSlug} />

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center overflow-x-auto">
          {PUBLIC_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.includes(item.path);
            return (
              <Link
                key={item.path}
                to={`/schools/${schoolSlug}/${item.path}`}
                className={`px-6 py-4 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-700 border-transparent hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="flex-1">{children}</div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">{branding?.school_name || 'School Name'}</h3>
              <p className="text-gray-400 text-sm">{branding?.district_name}</p>
            </div>
            <div>
              <p className="font-semibold mb-3">Navigation</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Yearbook</a></li>
                <li><a href="#" className="hover:text-white">Stories</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Connect</p>
              <ul className="space-y-2 text-sm text-gray-400">
                {branding?.social_youtube_url && <li><a href={branding.social_youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a></li>}
                {branding?.social_facebook_url && <li><a href={branding.social_facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></li>}
                {branding?.social_instagram_url && <li><a href={branding.social_instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Contact</p>
              <p className="text-sm text-gray-400">{branding?.contact_email || 'contact@school.edu'}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} {branding?.school_name}. Built with School Story Lab.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}