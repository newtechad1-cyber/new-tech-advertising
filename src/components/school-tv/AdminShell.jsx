import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminSidebar from './AdminSidebar';
import TopBar from './TopBar';

export default function AdminShell({ children, currentPath, schoolSlug: propSchoolSlug }) {
  const { schoolSlug: paramSchoolSlug } = useParams();
  const location = useLocation();
  const querySlug = new URLSearchParams(window.location.search).get('schoolSlug');
  const schoolSlug = propSchoolSlug || paramSchoolSlug || querySlug || 'hampton-dumont';
  const [user, setUser] = useState(null);
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, brandingData] = await Promise.all([
          base44.auth.me(),
          base44.entities.SchoolBranding.filter({ school_slug: schoolSlug }),
        ]);
        setUser(userData);
        if (brandingData.length > 0) {
          setBranding(brandingData[0]);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };
    loadData();
  }, [schoolSlug]);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar schoolSlug={schoolSlug} currentPath={currentPath} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          schoolName={branding?.school_name || schoolSlug}
          userEmail={user?.email}
          onLogout={handleLogout}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}