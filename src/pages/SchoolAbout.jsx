import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Mail, MapPin, Globe } from 'lucide-react';

export default function SchoolAbout() {
  const { schoolSlug } = useParams();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const brandingData = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });
        setBranding(brandingData[0] || null);
      } catch (error) {
        console.error('Error loading branding:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="about"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="about">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* School Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">{branding?.school_name}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">School Information</h3>
              <div className="space-y-4">
                {branding?.school_name && (
                  <p><strong>School:</strong> {branding.school_name}</p>
                )}
                {branding?.district_name && (
                  <p><strong>District:</strong> {branding.district_name}</p>
                )}
                {branding?.mascot_name && (
                  <p><strong>Mascot:</strong> {branding.mascot_name}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <div className="space-y-3">
                {branding?.contact_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <a href={`mailto:${branding.contact_email}`} className="text-blue-600 hover:underline">
                      {branding.contact_email}
                    </a>
                  </p>
                )}
                {branding?.social_website_url && (
                  <p className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <a href={branding.social_website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* School Colors */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: branding?.primary_color || '#1e3a5f' }}
              />
              <div>
                <p className="text-xs text-gray-500">Primary Color</p>
                <p className="font-mono text-sm">{branding?.primary_color}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: branding?.secondary_color || '#f59e0b' }}
              />
              <div>
                <p className="text-xs text-gray-500">Secondary Color</p>
                <p className="font-mono text-sm">{branding?.secondary_color}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: branding?.accent_color || '#ffffff' }}
              />
              <div>
                <p className="text-xs text-gray-500">Accent Color</p>
                <p className="font-mono text-sm">{branding?.accent_color}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-700 text-lg">
            The {branding?.network_name || 'School Story Lab'} celebrates the stories, achievements, and spirit of our school community. 
            Through this platform, we showcase the talent, dedication, and growth of our students, staff, and families.
          </p>
        </div>

        {/* Social Links */}
        {(branding?.social_youtube_url || branding?.social_facebook_url || branding?.social_instagram_url) && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            <div className="flex gap-4">
              {branding?.social_youtube_url && (
                <a href={branding.social_youtube_url} target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold">
                  YouTube
                </a>
              )}
              {branding?.social_facebook_url && (
                <a href={branding.social_facebook_url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Facebook
                </a>
              )}
              {branding?.social_instagram_url && (
                <a href={branding.social_instagram_url} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold">
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}