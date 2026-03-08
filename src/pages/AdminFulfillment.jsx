import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Calendar, AlertCircle, Loader2, MoreVertical } from 'lucide-react';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700 border-green-200',
  waiting_on_client: 'bg-amber-50 text-amber-700 border-amber-200',
  in_production: 'bg-blue-50 text-blue-700 border-blue-200',
  in_review: 'bg-purple-50 text-purple-700 border-purple-200',
  scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-slate-50 text-slate-700 border-slate-200',
  paused: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function AdminFulfillment() {
  const [workrooms, setWorkrooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadWorkrooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workrooms, filter, search]);

  const loadWorkrooms = async () => {
    try {
      const data = await base44.entities.FulfillmentWorkrooms.list('-created_date', 200);
      setWorkrooms(data);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = workrooms;

    if (filter !== 'all') {
      result = result.filter(w => w.status === filter);
    }

    if (search) {
      result = result.filter(w => 
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.company_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  };

  const handleMarkDelivered = async (workroom) => {
    await base44.entities.FulfillmentWorkrooms.update(workroom.id, { 
      status: 'delivered',
      phase: 'reporting',
    });
    loadWorkrooms();
  };

  const handlePause = async (workroom) => {
    await base44.entities.FulfillmentWorkrooms.update(workroom.id, { status: 'paused' });
    loadWorkrooms();
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Fulfillment Workrooms</h1>
          <p className="text-slate-600">Manage active service delivery workrooms</p>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'waiting_on_client', 'in_production', 'in_review', 'scheduled', 'delivered', 'paused'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workrooms Table */}
        <div className="p-6">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500">No fulfillment workrooms found</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(workroom => (
                <Card key={workroom.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    {/* Company & Service */}
                    <div className="lg:col-span-2">
                      <Link to={createPageUrl(`AdminFulfillmentDetail?id=${workroom.id}`)}>
                        <h3 className="font-semibold text-slate-900 hover:text-violet-600">
                          {workroom.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{workroom.service_type}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${STATUS_COLORS[workroom.status]}`}>
                        {workroom.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-violet-600 h-2 rounded-full transition-all"
                            style={{ width: `${workroom.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{workroom.progress_percent || 0}%</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-sm">
                      {workroom.next_delivery_date && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(workroom.next_delivery_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Link to={createPageUrl(`AdminFulfillmentDetail?id=${workroom.id}`)}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}