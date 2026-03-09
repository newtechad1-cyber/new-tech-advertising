import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  trial: 'bg-blue-100 text-blue-800',
  paused: 'bg-yellow-100 text-yellow-800',
  churned: 'bg-red-100 text-red-800'
};

export default function ResellerClientTable({ clients = [], onViewClient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Monthly Value</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Portal</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">No clients yet. Add your first client.</td>
                </tr>
              )}
              {clients.map(client => (
                <tr key={client.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{client.client_name}</td>
                  <td className="py-3 px-4 text-slate-600">{client.client_email}</td>
                  <td className="py-3 px-4 text-slate-600">{client.plan_type || '—'}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    ${(client.monthly_value || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {client.portal_access_enabled ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={statusColors[client.status] || 'bg-gray-100 text-gray-800'}>
                      {client.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="ghost" onClick={() => onViewClient?.(client)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}