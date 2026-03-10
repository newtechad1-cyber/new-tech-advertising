import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Verify user is admin
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Sample California school leads
    const sampleLeads = [
      {
        school_name: 'Lincoln High School',
        district_name: 'San Francisco Unified School District',
        school_type: 'public',
        city: 'San Francisco',
        state: 'CA',
        website: 'https://www.lincolnhs.org',
        contact_name: 'Maria Garcia',
        contact_title: 'principal',
        contact_email: 'mgarcia@sfusd.edu',
        contact_phone: '(415) 555-0101',
        student_population: 1200,
        lead_source: 'manual_research',
        outreach_status: 'new',
        outreach_stage: 0,
        client_status: 'prospect',
      },
      {
        school_name: 'Washington High School',
        district_name: 'Los Angeles Unified School District',
        school_type: 'public',
        city: 'Los Angeles',
        state: 'CA',
        website: 'https://www.washingtonhs.la.edu',
        contact_name: 'James Chen',
        contact_title: 'tech_director',
        contact_email: 'jchen@lausd.edu',
        contact_phone: '(213) 555-0102',
        student_population: 1800,
        lead_source: 'manual_research',
        outreach_status: 'ready_for_outreach',
        outreach_stage: 0,
        client_status: 'prospect',
      },
      {
        school_name: 'Jefferson Academy',
        district_name: 'Palo Alto Unified School District',
        school_type: 'charter',
        city: 'Palo Alto',
        state: 'CA',
        website: 'https://www.jeffersonacademy.org',
        contact_name: 'Sarah Mitchell',
        contact_title: 'principal',
        contact_email: 'smitchell@jeffersonacademy.org',
        contact_phone: '(650) 555-0103',
        student_population: 650,
        lead_source: 'referral',
        outreach_status: 'contacted',
        outreach_stage: 1,
        client_status: 'prospect',
        last_contact_date: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        next_followup_date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        school_name: 'Berkeley High School',
        district_name: 'Berkeley Unified School District',
        school_type: 'public',
        city: 'Berkeley',
        state: 'CA',
        website: 'https://www.berkeleyhs.org',
        contact_name: 'David Rodriguez',
        contact_title: 'av_director',
        contact_email: 'drodriguez@busd.org',
        contact_phone: '(510) 555-0104',
        student_population: 1400,
        lead_source: 'manual_research',
        outreach_status: 'replied',
        outreach_stage: 2,
        client_status: 'prospect',
        last_contact_date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Very interested, asked about pricing and timeline',
      },
      {
        school_name: 'Rawhide High School',
        district_name: 'San Diego Unified School District',
        school_type: 'public',
        city: 'San Diego',
        state: 'CA',
        website: 'https://www.rawhidehigh.org',
        contact_name: 'Angela West',
        contact_title: 'marketing_director',
        contact_email: 'awest@sdusd.edu',
        contact_phone: '(619) 555-0105',
        student_population: 950,
        lead_source: 'conference',
        outreach_status: 'demo_scheduled',
        outreach_stage: 3,
        client_status: 'prospect',
        demo_booked: true,
        demo_date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Very engaged, wants to see platform with their team',
      },
      {
        school_name: 'Clearwater Preparatory',
        district_name: 'Private Independent Schools',
        school_type: 'private',
        city: 'Pasadena',
        state: 'CA',
        website: 'https://www.clearwaterprep.edu',
        contact_name: 'Thomas Bradley',
        contact_title: 'principal',
        contact_email: 'tbradley@clearwaterprep.edu',
        contact_phone: '(626) 555-0106',
        student_population: 580,
        lead_source: 'inbound',
        outreach_status: 'demo_completed',
        outreach_stage: 3,
        client_status: 'prospect',
        demo_booked: true,
        demo_date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        last_contact_date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Demo went well, now discussing with budget committee',
      },
      {
        school_name: 'Oceanside High School',
        district_name: 'Oceanside Unified School District',
        school_type: 'public',
        city: 'Oceanside',
        state: 'CA',
        website: 'https://www.oceansidehigh.org',
        contact_name: 'Lisa Park',
        contact_title: 'principal',
        contact_email: 'lpark@ousd.edu',
        contact_phone: '(760) 555-0107',
        student_population: 1100,
        lead_source: 'manual_research',
        outreach_status: 'pilot',
        outreach_stage: 4,
        client_status: 'trial',
        pilot_interest: true,
        notes: 'Started 30-day pilot, enthusiastic early results',
      },
      {
        school_name: 'Riverside Academy',
        district_name: 'Riverside Unified School District',
        school_type: 'public',
        city: 'Riverside',
        state: 'CA',
        website: 'https://www.riversideacademy.org',
        contact_name: 'Mark Johnson',
        contact_title: 'superintendent',
        contact_email: 'mjohnson@rusd.edu',
        contact_phone: '(951) 555-0108',
        student_population: 2400,
        lead_source: 'referral',
        outreach_status: 'won',
        outreach_stage: 5,
        client_status: 'customer',
        last_contact_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Signed annual contract, rollout plan in progress',
      },
    ];

    // Create sample outreach campaign
    const campaign = {
      name: 'Spring 2026 California Schools Campaign',
      campaign_type: 'email_sequence',
      target_region: 'CA',
      audience_type: 'high_schools',
      active: true,
      message_1: `Hi [CONTACT_NAME],

I wanted to reach out because [SCHOOL_NAME] is doing amazing work with student media, and I think you'd be interested in a platform that lets students create the content your school watches.

School TV is a platform where students submit stories, your team reviews them, and it all goes live on a branded channel. Think of it as giving your students a real production studio experience.

→ See how it works: https://www.schooltv.com/schooltv-deal-room
→ Check our live demo: https://www.schooltv.com/demo-school-channel

Would you be open to a quick 15-minute call next week?

Best,
School TV Sales Team`,
      message_2: `Hi [CONTACT_NAME],

I wanted to follow up on my previous message. I know things get busy, especially with budget planning.

That's why I'm reaching out now—if your school is thinking about student engagement or media production this year, this is the perfect time to explore School TV.

Here's the guide: https://www.schooltv.com/schooltv-deal-room

Can I grab 15 minutes on your calendar?

Thanks,
School TV Sales Team`,
      message_3: `Hi [CONTACT_NAME],

Last chance to see School TV this month. I'd love to give you a personal walkthrough—it's only 15 minutes.

Demo: https://www.schooltv.com/demo-school-channel
Decision Guide: https://www.schooltv.com/schooltv-deal-room

Let me know if next week works.

Best,
School TV Sales Team`,
    };

    // Bulk create leads
    const createdLeads = await base44.entities.SchoolLeads.bulkCreate(sampleLeads);
    const createdCampaign = await base44.entities.SchoolOutreachCampaigns.create(campaign);

    return Response.json({
      success: true,
      message: 'Sample school leads and campaign seeded',
      leads_created: createdLeads.length,
      campaign_created: createdCampaign.id,
      leads: createdLeads.map(l => ({
        id: l.id,
        school_name: l.school_name,
        city: l.city,
        status: l.outreach_status,
      })),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});