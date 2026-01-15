import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Filter, CheckCircle, AlertCircle, Sparkles, MessageSquare, Clock } from 'lucide-react';

export default function SchedulingQueue() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    package: 'all',
    channel: 'all'
  });
  const [expandedId, setExpandedId] = useState(null);
  const [upgradeForm, setUpgradeForm] = useState({});

  useEffect(() => {
    loadQueue();
  }, [filters]);

  const loadQueue = async () => {
    try {
      let query = {};
      if (filters.status !== 'all') query.status = filters.status;
      
      const data = await base44.entities.ContentSubmission.filter(query);
      setSubmissions(data.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
    } catch (error) {
      console.error('Error loading queue:', error);
      toast.error('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await base44.entities.ContentSubmission.update(id, { status: newStatus });
      toast.success('Status updated');
      loadQueue();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleRecommendUpgrade = async (id) => {
    const form = upgradeForm[id];
    if (!form?.upgrade_type || !form?.admin_upgrade_reason || !form?.upgrade_price) {
      toast.error('Please fill in all upgrade fields');
      return;
    }

    try {
      await base44.entities.ContentSubmission.update(id, {
        upgrade_status: 'admin_recommended',
        upgrade_type: form.upgrade_type,
        admin_upgrade_reason: form.admin_upgrade_reason,
        upgrade_price: parseFloat(form.upgrade_price)
      });
      toast.success('Upgrade recommended to client');
      setExpandedId(null);
      setUpgradeForm({});
      loadQueue();
    } catch (error) {
      toast.error('Failed to recommend upgrade');
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filters.package === '197' && !sub.created_by) return false;
    if (filters.channel !== 'all' && !sub.social_channels?.includes(filters.channel)) return false;
    return true;
  });

  const getPackageBadge = (submission) => {
    // Logic to determine package - for now showing as Collaborative
    return <Badge className="bg-blue-100 text-blue-800">$197 Collaborative</Badge>;
  };

  if (loading) return <div className="text-center py-8">Loading queue...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Scheduling Queue</h2>
        <div className="flex gap-3">
          <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.package} onValueChange={(v) => setFilters({...filters, package: v})}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="197">$197 Collab</SelectItem>
              <SelectItem value="297">$297 DFY</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.channel} onValueChange={(v) => setFilters({...filters, channel: v})}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Queue is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPackageBadge(submission)}
                      <Badge variant={submission.status === 'pending' ? 'default' : 'outline'}>
                        {submission.status}
                      </Badge>
                      {submission.upgrade_status !== 'none' && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Upgrade: {submission.upgrade_status}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm font-normal text-slate-600">
                      {submission.created_by} • {new Date(submission.created_date).toLocaleString()}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Content Type:</p>
                    <p className="font-medium">{submission.submission_type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Post Text:</p>
                    <p className="text-sm text-slate-700">{submission.post_text}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {submission.social_channels?.map(ch => (
                      <Badge key={ch} variant="outline">{ch}</Badge>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Scheduling Preference:</p>
                    <p className="text-sm">{submission.scheduling_preference.replace('_', ' ')}</p>
                    {submission.preferred_date && (
                      <p className="text-xs text-slate-600">
                        Requested: {new Date(submission.preferred_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Admin Actions */}
                  <div className="border-t pt-4 flex flex-wrap gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleStatusUpdate(submission.id, 'scheduled')}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Mark Scheduled
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Recommend Upgrade
                        </Button>
                      </>
                    )}
                    {submission.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(submission.id, 'posted')} className="bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Posted
                      </Button>
                    )}
                  </div>

                  {/* Upgrade Recommendation Form */}
                  {expandedId === submission.id && (
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3 mt-3">
                      <h4 className="font-semibold text-sm">Recommend Upgrade to Client</h4>
                      <Select 
                        value={upgradeForm[submission.id]?.upgrade_type || ''} 
                        onValueChange={(v) => setUpgradeForm({...upgradeForm, [submission.id]: {...upgradeForm[submission.id], upgrade_type: v}})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select upgrade type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rewrite_text">Rewrite Text</SelectItem>
                          <SelectItem value="edit_image">Edit Image</SelectItem>
                          <SelectItem value="create_video">Create Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea 
                        placeholder="Why recommend this upgrade? (visible to client)"
                        value={upgradeForm[submission.id]?.admin_upgrade_reason || ''}
                        onChange={(e) => setUpgradeForm({...upgradeForm, [submission.id]: {...upgradeForm[submission.id], admin_upgrade_reason: e.target.value}})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Price ($)"
                        value={upgradeForm[submission.id]?.upgrade_price || ''}
                        onChange={(e) => setUpgradeForm({...upgradeForm, [submission.id]: {...upgradeForm[submission.id], upgrade_price: e.target.value}})}
                      />
                      <Button size="sm" onClick={() => handleRecommendUpgrade(submission.id)}>
                        Send Recommendation
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}