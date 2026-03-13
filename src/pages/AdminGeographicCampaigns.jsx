import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import GeographicCampaignDashboard from '@/components/geo-campaigns/GeographicCampaignDashboard';

export default function AdminGeographicCampaigns() {
  return (
    <AdminLayout currentPageName="adminGeographicCampaigns">
      <GeographicCampaignDashboard />
    </AdminLayout>
  );
}