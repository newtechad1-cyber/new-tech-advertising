import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Plus, Upload, CheckCircle, Zap, Target, Users
} from 'lucide-react';

export default function QuickCommandBar() {
  const commands = [
    { label: 'Add Lead', icon: Plus, page: 'AdminSalesDashboard', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Upload Content', icon: Upload, page: 'AdminVideoPublishing', color: 'bg-violet-600 hover:bg-violet-700' },
    { label: 'Review Approvals', icon: CheckCircle, page: 'AdminVideoPublishing', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'Publishing Queue', icon: Zap, page: 'AdminVideoPublishing', color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Sales Pipeline', icon: Target, page: 'AdminSales', color: 'bg-amber-600 hover:bg-amber-700' },
    { label: 'Clients', icon: Users, page: 'AdminClients', color: 'bg-cyan-600 hover:bg-cyan-700' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">Quick Commands</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {commands.map((cmd, idx) => {
          const Icon = cmd.icon;
          return (
            <Link key={idx} to={createPageUrl(cmd.page)}>
              <Button size="sm" className={`w-full ${cmd.color} text-white gap-1.5 flex flex-col items-center justify-center h-auto py-2`}>
                <Icon className="w-4 h-4" />
                <span className="text-xs">{cmd.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}