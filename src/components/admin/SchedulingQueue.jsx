import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Filter, CheckCircle, AlertCircle, Sparkles, MessageSquare, Clock, Zap, HelpCircle, CalendarPlus } from 'lucide-react';
import { getPackageConfig } from '../config/packageRules';

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
  const [calendarForm, setCalendarForm] = useState({});
  const [calendarLoading, setCalendarLoading] = useState({});

  useEffect(() => {
    loadQueue();
  }, [filters]);

  const loadQueue = async () => {
    try {
      let query = {};
      if (filters.status !== 'all') query.status = filters.status;
      
      const data = await base44.entities.ContentSubmission.filter(query);
      
      // Sort by priority (1=highest) then by creation date
      const sorted = data.sort((a, b) => {
        const priorityDiff = (a.priority || 2) - (b.priority || 2);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.created_date) - new Date(b.created_date);
      });
      
      setSubmissions(sorted);
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

  const handleQualityStatusUpdate = async (id, qualityStatus) => {
    try {
      await base44.entities.ContentSubmission.update(id, { quality_status: qualityStatus });
      toast.success('Quality status updated');
      loadQueue();
    } catch (error) {
      toast.error('Failed to update quality status');
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

  const handleAddToCalendar = async (submission) => {
    const form = calendarForm[submission.id];
    if (!form?.start) {
      toast.error('Please select a start date/time');
      return;
    }
    setCalendarLoading(prev => ({ ...prev, [submission.id]: true }));
    try {
      const start = new Date(form.start).toISOString();
      const end = form.end ? new Date(form.end).toISOString() : new Date(new Date(form.start).getTime() + 60 * 60 * 1000).toISOString();
      await base44.functions.invoke('googleCalendar', {
        action: 'create_event',
        title: `Post: ${submission.submission_type.replace('_', ' ')} — ${submission.social_channels?.join(', ')}`,
        description: submission.post_text,
        start,
        end,
      });
      await base44.entities.ContentSubmission.update(submission.id, { status: 'scheduled', preferred_date: form.start });
      toast.success('Event added to Google Calendar & marked scheduled!');
      setCalendarForm(prev => { const n = {...prev}; delete n[submission.id]; return n; });
      loadQueue();
    } catch (err) {
      toast.error('Failed to add to calendar: ' + err.message);
    } finally {
      setCalendarLoading(prev => ({ ...prev, [submission.id]: false }));
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filters.package === '197' && !sub.created_by) return false;
    if (filters.channel !== 'all' && !sub.social_channels?.includes(filters.channel)) return false;
    return true;
  });

  const getPackageBadge = (submission) => {
    const priority = submission.priority || 2;
    if (priority === 1) {
      return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
        <Zap className="w-3 h-3" />
        $297 DFY - Priority
      </Badge>;
    }
    if (priority === 2) {
      return <Badge className="bg-blue-100 text-blue-800">$197 Collaborative</Badge>;
    }
    return <Badge className="bg-slate-100 text-slate-800">DIY</Badge>;
  };

  const getPriorityIndicator = (priority) => {
    if (priority === 1) {
      return <div className="w-2 h-2 bg-purple-600 rounded-full" title="Priority" />;
    }
    if (priority === 2) {
      return <div className="w-2 h-2 bg-blue-600 rounded-full" title="Standard" />;
    }
    return <div className="w-2 h-2 bg-slate-400 rounded-full" title="Low priority" />;
  };

  const getQualityBadge = (qualityStatus) => {
    const variants = {
      ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      needs_clarification: { label: 'Needs Clarification', color: 'bg-yellow-100 text-yellow-800', icon: HelpCircle },
      recommend_upgrade: { label: 'Recommend Upgrade', color: 'bg-purple-100 text-purple-800', icon: Sparkles }
    };
    const variant = variants[qualityStatus] || variants.ready;
    const Icon = variant.icon;
    return (
      <Badge className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    );
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
                  <div className="flex items-center gap-2 flex-1">
                    {getPriorityIndicator(submission.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getPackageBadge(submission)}
                        <Badge variant={submission.status === 'pending' ? 'default' : 'outline'}>
                          {submission.status}
                        </Badge>
                        {getQualityBadge(submission.quality_status || 'ready')}
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
                  
                  {/* Quality Status Controls */}
                  <div className="border-t pt-4 mb-3">
                    <p className="text-xs text-slate-500 mb-2">Quality Control:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant={submission.quality_status === 'ready' ? 'default' : 'outline'}
                        onClick={() => handleQualityStatusUpdate(submission.id, 'ready')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Ready
                      </Button>
                      <Button 
                        size="sm" 
                        variant={submission.quality_status === 'needs_clarification' ? 'default' : 'outline'}
                        onClick={() => handleQualityStatusUpdate(submission.id, 'needs_clarification')}
                      >
                        <HelpCircle className="w-4 h-4 mr-1" />
                        Needs Clarification
                      </Button>
                      <Button 
                        size="sm" 
                        variant={submission.quality_status === 'recommend_upgrade' ? 'default' : 'outline'}
                        onClick={() => handleQualityStatusUpdate(submission.id, 'recommend_upgrade')}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Recommend Upgrade
                      </Button>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="border-t pt-4 flex flex-wrap gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                          onClick={() => setCalendarForm(prev => ({
                            ...prev,
                            [submission.id]: prev[submission.id] ? undefined : { start: '', end: '' }
                          }))}
                        >
                          <CalendarPlus className="w-4 h-4 mr-1" />
                          Schedule on Google Calendar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(submission.id, 'scheduled')}>
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
                    {calendarForm[submission.id] && (
                      <div className="w-full mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-blue-800">Add to Google Calendar</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-blue-700 mb-1 block">Start Date & Time</label>
                            <Input
                              type="datetime-local"
                              value={calendarForm[submission.id]?.start || ''}
                              onChange={e => setCalendarForm(prev => ({ ...prev, [submission.id]: { ...prev[submission.id], start: e.target.value } }))}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-blue-700 mb-1 block">End Date & Time (optional)</label>
                            <Input
                              type="datetime-local"
                              value={calendarForm[submission.id]?.end || ''}
                              onChange={e => setCalendarForm(prev => ({ ...prev, [submission.id]: { ...prev[submission.id], end: e.target.value } }))}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleAddToCalendar(submission)}
                            disabled={calendarLoading[submission.id]}
                          >
                            {calendarLoading[submission.id] ? 'Adding...' : 'Add to Calendar'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setCalendarForm(prev => { const n = {...prev}; delete n[submission.id]; return n; })}>
                            Cancel
                          </Button>
                        </div>
                      </div>
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