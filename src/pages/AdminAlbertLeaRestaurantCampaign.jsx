import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AlbertLeaRestaurantDashboard from '@/components/hvac-campaigns/AlbertLeaRestaurantDashboard';

export default function AdminAlbertLeaRestaurantCampaign() {
  return (
    <AdminLayout currentPageName="adminAlbertLeaRestaurantCampaign">
      <AlbertLeaRestaurantDashboard />
    </AdminLayout>
  );
}