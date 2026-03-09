import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import TopBar from './TopBar';
import { Upload, Sparkles, Home } from 'lucide-react';

const CONTRIBUTOR_NAV = [
  { label: 'Home', icon: Home, path: 'contributor' },
  { label: 'My Submissions', icon: Upload, path: 'contributor/submissions' },
  { label: 'AI Story Lab', icon: Sparkles, path: 'ai-lab' },
];

export default function ContributorShell({ children, currentPath }) {
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
      {/* Top Bar */}
      <TopBar schoolName={branding?.school_name || schoolSlug} />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center">
          {CONTRIBUTOR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.includes(item.path);
            return (
              <Link
                key={item.path}
                to={`/school-app/${schoolSlug}/${item.path}`}
                className={`px-6 py-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
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

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</div>
    </div>
  );
}