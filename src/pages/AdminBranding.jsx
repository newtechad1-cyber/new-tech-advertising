import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Palette } from 'lucide-react';

export default function AdminBranding() {
  const { schoolSlug } = useParams();
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });
        setBranding(data[0] || null);
      } catch (error) {
        console.error('Error loading branding:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div>
        <h1 className="text-3xl font-bold mb-2">Branding & Customization</h1>
        <p className="text-gray-600 mb-8">Configure your school's visual identity and theme</p>
      </div>

      {branding ? (
        <div className="space-y-6">
          {/* School Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">School Information</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">School Name</p>
                <p className="font-semibold">{branding.school_name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">District</p>
                <p className="font-semibold">{branding.district_name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Network Name</p>
                <p className="font-semibold">{branding.network_name}</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
                Edit School Info
              </button>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" /> Brand Colors
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div
                  className="w-full h-24 rounded-lg border-2 border-gray-300 mb-3"
                  style={{ backgroundColor: branding.primary_color }}
                />
                <p className="text-sm text-gray-600 mb-1">Primary Color</p>
                <p className="font-mono text-sm">{branding.primary_color}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div
                  className="w-full h-24 rounded-lg border-2 border-gray-300 mb-3"
                  style={{ backgroundColor: branding.secondary_color }}
                />
                <p className="text-sm text-gray-600 mb-1">Secondary Color</p>
                <p className="font-mono text-sm">{branding.secondary_color}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div
                  className="w-full h-24 rounded-lg border-2 border-gray-300 mb-3"
                  style={{ backgroundColor: branding.accent_color }}
                />
                <p className="text-sm text-gray-600 mb-1">Accent Color</p>
                <p className="font-mono text-sm">{branding.accent_color}</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
              Edit Colors
            </button>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Logo & Media</h3>
            {branding.logo && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <img src={branding.logo} alt="School Logo" className="h-24 w-24 object-contain" />
              </div>
            )}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
              Upload New Logo
            </button>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Contact & Social</h3>
            <div className="space-y-4">
              {branding.contact_email && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                  <p className="font-semibold">{branding.contact_email}</p>
                </div>
              )}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
                Edit Contact Info
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No branding data found</p>
        </div>
      )}
    </AdminShell>
  );
}