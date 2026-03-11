import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Globe, ChevronLeft, Calendar, CheckCircle2 } from 'lucide-react';
import OutreachAssistPanel from '@/components/school-tv/OutreachAssistPanel';

const statusColors = {
  new: 'bg-slate-100 text-slate-800',
  researched: 'bg-blue-100 text-blue-800',
  ready_for_outreach: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-orange-100 text-orange-800',
  opened: 'bg-amber-100 text-amber-800',
  replied: 'bg-cyan-100 text-cyan-800',
  demo_scheduled: 'bg-green-100 text-green-800',
  demo_completed: 'bg-emerald-100 text-emerald-800',
  pilot: 'bg-purple-100 text-purple-800',
  won: 'bg-green-600 text-white',
  lost: 'bg-red-100 text-red-800',
};

export default function AdminSchoolLeadDetail() {
  const params = new URLSearchParams(window.location.search);
  const leadId = params.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['school_lead', leadId],
    queryFn: () => base44.entities.SchoolLeads.filter({ id: leadId }),
    initialData: [],
  });

  const currentLead = lead[0];

  const { data: activities } = useQuery({
    queryKey: ['school_activities', leadId],
    queryFn: () => base44.entities.SchoolOutreachActivity.filter({ school_lead_id: leadId }),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.SchoolLeads.update(leadId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['school_lead', leadId] }),
  });

  const addActivityMutation = useMutation({
    mutationFn: (data) => base44.entities.SchoolOutreachActivity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['school_activities', leadId] }),
  });

  const handleStatusChange = (newStatus) => {
    updateMutation.mutate({
      outreach_status: newStatus,
      last_contact_date: new Date().toISOString(),
    });
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;
    await addActivityMutation.mutateAsync({
      school_lead_id: leadId,
      activity_type: 'note_added',
      activity_date: new Date().toISOString(),
      message: notes,
      response_status: 'pending',
    });
    setNotes('');
  };

  const handleScheduleDemo = () => {
    const date = prompt('Enter demo date (YYYY-MM-DD HH:MM):');
    if (date) {
      updateMutation.mutate({
        demo_booked: true,
        demo_date: new Date(date).toISOString(),
        outreach_status: 'demo_scheduled',
      });
    }
  };

  if (isLoading || !currentLead) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to Leads
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{currentLead.school_name}</h1>
              <p className="text-slate-600 mt-1">{currentLead.district_name}</p>
            </div>
            <Badge className={statusColors[currentLead.outreach_status]}>
              {currentLead.outreach_status?.replace(/_/g, ' ')}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-600 font-medium">School Type</div>
              <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.school_type}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-medium">Location</div>
              <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.city}, {currentLead.state}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-medium">Students</div>
              <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.student_population?.toLocaleString() || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 font-medium">Lead Source</div>
              <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.lead_source}</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Primary Contact</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-600 font-medium">Name</div>
                <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.contact_name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-medium">Title</div>
                <div className="text-sm text-slate-900 font-semibold mt-1">{currentLead.contact_title?.replace(/_/g, ' ')}</div>
              </div>
              <a href={`mailto:${currentLead.contact_email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-3">
                <Mail className="h-4 w-4" />
                {currentLead.contact_email}
              </a>
              {currentLead.contact_phone && (
                <a href={`tel:${currentLead.contact_phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Phone className="h-4 w-4" />
                  {currentLead.contact_phone}
                </a>
              )}
              {currentLead.website && (
                <a href={currentLead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              {currentLead.last_contact_date && (
                <div>
                  <div className="text-xs text-slate-600 font-medium">Last Contact</div>
                  <div className="text-sm text-slate-900 font-semibold mt-1">
                    {new Date(currentLead.last_contact_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {currentLead.next_followup_date && (
                <div>
                  <div className="text-xs text-slate-600 font-medium">Next Followup</div>
                  <div className="text-sm text-slate-900 font-semibold mt-1">
                    {new Date(currentLead.next_followup_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {currentLead.demo_booked && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <div>
                    <div className="text-xs text-green-700 font-medium">Demo Scheduled</div>
                    <div className="text-sm font-semibold">{new Date(currentLead.demo_date).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('contacted')}>
              Mark Contacted
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('replied')}>
              Mark Replied
            </Button>
            <Button variant="outline" size="sm" onClick={handleScheduleDemo}>
              Schedule Demo
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('pilot')}>
              Mark Pilot
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('won')}>
              Mark Won
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('lost')}>
              Mark Lost
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Outreach History</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-slate-600 text-sm">No activity yet</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="border-l-2 border-slate-300 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{activity.activity_type?.replace(/_/g, ' ')}</div>
                      {activity.subject && <div className="text-sm text-slate-600">{activity.subject}</div>}
                    </div>
                    <div className="text-xs text-slate-500">{new Date(activity.activity_date).toLocaleDateString()}</div>
                  </div>
                  {activity.message && <p className="text-sm text-slate-600 mt-2">{activity.message}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Note */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Add Note</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this lead..."
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm h-24"
          />
          <Button onClick={handleAddNote} className="mt-3">
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}