import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Search, Filter, ArrowUpDown, Loader2, Users, TrendingUp } from 'lucide-react';
import { createPageUrl } from '../utils';
import { toast } from 'sonner';

export default function LeadsDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [sortField, setSortField] = useState('created_date');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [leads, searchTerm, statusFilter, packageFilter, cityFilter, sortField, sortDirection]);

  const loadLeads = async () => {
    try {
      const allLeads = await base44.entities.AdaLead.list('-created_date', 500);
      setLeads(allLeads);
    } catch (error) {
      toast.error('Failed to load leads');
      console.error('Error loading leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Package filter
    if (packageFilter !== 'all') {
      filtered = filtered.filter(lead => lead.package === packageFilter);
    }

    // City filter
    if (cityFilter) {
      filtered = filtered.filter(lead =>
        lead.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'created_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredLeads(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      quoted: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      onboarded: 'bg-purple-100 text-purple-800',
      active: 'bg-emerald-100 text-emerald-800'
    };
    return <Badge className={colors[status] || 'bg-slate-100 text-slate-800'}>{status}</Badge>;
  };

  const getScoreBadge = (score) => {
    if (!score) return <span className="text-slate-400 text-sm">—</span>;
    
    let color = 'bg-slate-100 text-slate-800';
    let label = 'Low';
    
    if (score >= 61) {
      color = 'bg-green-100 text-green-800';
      label = 'High';
    } else if (score >= 31) {
      color = 'bg-yellow-100 text-yellow-800';
      label = 'Med';
    } else {
      color = 'bg-red-100 text-red-800';
      label = 'Low';
    }
    
    return (
      <Badge className={color}>
        {score} {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">ADA Leads Dashboard</h1>
          </div>
          <p className="text-slate-600">Manage and track all ADA compliance leads</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search name, business, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="onboarded">Onboarded</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>

              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Authority">Authority</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPackageFilter('all');
                  setCityFilter('');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('business_name')} className="gap-2">
                        Business
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('package')} className="gap-2">
                        Package
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('status')} className="gap-2">
                        Status
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('city')} className="gap-2">
                        Location
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('lead_score')} className="gap-2">
                        Score
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('created_date')} className="gap-2">
                        Created
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                        No leads found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{lead.business_name}</p>
                            {lead.nonprofit && (
                              <Badge variant="outline" className="text-xs mt-1">Nonprofit</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{lead.full_name}</p>
                            <p className="text-slate-500">{lead.email}</p>
                            <p className="text-slate-500">{lead.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{lead.package}</TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{lead.city}</p>
                            <p className="text-slate-500">{lead.state}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getScoreBadge(lead.lead_score)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.setup_price && (
                              <p className="font-semibold">${lead.setup_price} setup</p>
                            )}
                            {lead.monthly_price > 0 && (
                              <p className="text-slate-600">${lead.monthly_price}/mo</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(lead.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(createPageUrl('LeadDetail') + '?id=' + lead.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}