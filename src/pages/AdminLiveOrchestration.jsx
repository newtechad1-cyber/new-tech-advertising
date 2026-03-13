import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LiveOrchestrationDashboard from '@/components/orchestration/LiveOrchestrationDashboard';

export default function AdminLiveOrchestration() {
  return (
    <AdminLayout currentPageName="adminLiveOrchestration">
      <LiveOrchestrationDashboard />
    </AdminLayout>
  );
}