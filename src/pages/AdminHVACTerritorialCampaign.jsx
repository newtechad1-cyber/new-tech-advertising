import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import HVACTerritorialDashboard from '@/components/hvac-campaigns/HVACTerritorialDashboard';

export default function AdminHVACTerritorialCampaign() {
  return (
    <AdminLayout currentPageName="adminHVACTerritorialCampaign">
      <HVACTerritorialDashboard />
    </AdminLayout>
  );
}