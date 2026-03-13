import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import NTALaunchCampaignBuilder from '@/components/sales/campaign/NTALaunchCampaignBuilder';

export default function AdminNTALaunchCampaign() {
  return (
    <AdminLayout currentPageName="adminNTALaunchCampaign">
      <NTALaunchCampaignBuilder />
    </AdminLayout>
  );
}