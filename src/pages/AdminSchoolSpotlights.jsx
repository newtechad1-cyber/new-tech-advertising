import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminSchoolSpotlights() {
  const { schoolSlug } = useParams();
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Spotlights.filter({
          school_slug: schoolSlug,
        });
        setSpotlights(data);
      } catch (error) {
        console.error('Error loading spotlights:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spotlights</h1>
            <p className="text-gray-700 mt-1">{spotlights.length} spotlights</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Spotlight
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {spotlights.map((spotlight) => (
            <div key={spotlight.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {spotlight.cover_image && (
                <img src={spotlight.cover_image} alt={spotlight.featured_name} className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{spotlight.featured_name}</h3>
                <p className="text-sm text-gray-600 mb-3">{spotlight.spotlight_type}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{spotlight.excerpt}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {spotlights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No spotlights yet</p>
          </div>
        )}
      </div>
    </div>
  );
}