import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { school_lead_id } = await req.json();

    if (!school_lead_id) {
      return Response.json({ error: 'Missing school_lead_id' }, { status: 400 });
    }

    // Fetch the lead
    const leads = await base44.entities.SchoolLeads.filter({ id: school_lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Fetch related activities
    const activities = await base44.entities.SchoolOutreachActivity.filter({ school_lead_id });

    // Build research summary
    const summary = {
      school_name: lead.school_name,
      district: lead.district_name,
      location: `${lead.city}, ${lead.state}`,
      size: lead.student_population,
      size_category: lead.student_population > 1500 ? 'Large' : lead.student_population > 800 ? 'Medium' : 'Small',
      contact: {
        name: lead.contact_name,
        title: lead.contact_title,
        email: lead.contact_email,
        phone: lead.contact_phone,
      },
      status: {
        outreach: lead.outreach_status,
        client: lead.client_status,
        demo_booked: lead.demo_booked,
        pilot_interest: lead.pilot_interest,
      },
      timeline: {
        last_contact: lead.last_contact_date ? new Date(lead.last_contact_date).toLocaleDateString() : 'Never',
        next_followup: lead.next_followup_date ? new Date(lead.next_followup_date).toLocaleDateString() : 'Not scheduled',
        days_until_followup: lead.next_followup_date ? Math.ceil((new Date(lead.next_followup_date) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      },
      lead_source: lead.lead_source,
      activity_count: activities.length,
      activities: activities.slice(0, 5).map(a => ({
        type: a.activity_type,
        date: new Date(a.activity_date).toLocaleDateString(),
        status: a.response_status,
        note: a.message?.substring(0, 100),
      })),
      recommended_next_step: getRecommendedAction(lead),
      talking_points: generateTalkingPoints(lead),
    };

    return Response.json(summary);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getRecommendedAction(lead) {
  if (lead.outreach_status === 'new') {
    return 'Send intro email about platform';
  } else if (lead.outreach_status === 'ready_for_outreach') {
    return 'Send first email template from campaign';
  } else if (lead.outreach_status === 'contacted' && lead.last_contact_date) {
    const daysSinceContact = Math.floor((new Date() - new Date(lead.last_contact_date)) / (1000 * 60 * 60 * 24));
    if (daysSinceContact > 7) {
      return 'Send follow-up email (no reply yet)';
    }
    return 'Wait for response or check in next week';
  } else if (lead.outreach_status === 'replied') {
    return 'Schedule demo call based on their availability';
  } else if (lead.outreach_status === 'demo_scheduled') {
    return 'Prepare demo presentation, send calendar reminder';
  } else if (lead.outreach_status === 'demo_completed' && !lead.pilot_interest) {
    return 'Send final check-in email';
  } else if (lead.pilot_interest) {
    return 'Move to trial setup, coordinate with onboarding team';
  }
  return 'Review notes and determine next steps';
}

function generateTalkingPoints(lead) {
  const points = [];

  if (lead.school_type === 'public') {
    points.push('Budget considerations and grant opportunities');
  } else if (lead.school_type === 'charter') {
    points.push('Flexibility in implementation and customization');
  } else if (lead.school_type === 'private') {
    points.push('Aligns with mission to foster student creativity');
  }

  if (lead.student_population > 1500) {
    points.push('Scalable platform for large school populations');
  } else {
    points.push('Easy to launch and manage for smaller schools');
  }

  if (lead.contact_title === 'principal') {
    points.push('Strengthens school community and pride');
    points.push('Increases student engagement');
  } else if (lead.contact_title === 'tech_director') {
    points.push('Integration with existing systems');
    points.push('Technical support and security');
  } else if (lead.contact_title === 'marketing_director') {
    points.push('Showcase school achievements and stories');
    points.push('Multi-platform publishing capabilities');
  }

  points.push('Students get real production experience');
  points.push('School maintains full moderation control');

  return points;
}