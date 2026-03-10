import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { school_lead_id, stage, school_name, contact_name, demo_url } = await req.json();

    if (!school_lead_id || !stage) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch the lead
    const leads = await base44.entities.SchoolLeads.filter({ id: school_lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const name = contact_name || lead.contact_name || 'School Administrator';
    const schoolName = school_name || lead.school_name;
    const dealRoomUrl = demo_url || 'https://www.schooltv.com/schooltv-deal-room';
    const demoChannelUrl = 'https://www.schooltv.com/demo-school-channel';

    let subject, body;

    if (stage === 'intro') {
      subject = `Transform ${schoolName} with Student-Created TV`;
      body = `Hi ${name},

I wanted to reach out because ${schoolName} is doing amazing work with student media, and I think you'd be interested in a platform that lets students create the content your school watches.

We work with schools to build their own streaming TV network—where students submit stories, your team reviews them, and it all goes live on a branded channel. Think of it as giving your students a real production studio experience.

Here's what I'd love to show you:

→ How your students can become content creators
→ A live example of what this looks like (our demo school has 6 published stories)
→ Why schools are doing this to build community pride

Check out our decision-maker guide here: ${dealRoomUrl}

And if you want to see a working example, visit: ${demoChannelUrl}

Would you be open to a quick 15-minute call next week to see how this could work for ${schoolName}?

Best,
[Your Name]
School TV Sales Team`;
    } else if (stage === 'followup') {
      subject = `${schoolName} + Student-Created Media = 👀`;
      body = `Hi ${name},

I wanted to follow up on my previous message. I know things get busy at this time of year, especially with budget planning happening.

That's actually why I'm reaching out—if your school is thinking about investing in student engagement or media production, this is the perfect time to explore School TV.

Here's what makes it different:
✓ Students drive the content creation
✓ Your team maintains full control and moderation
✓ It's designed specifically for K-12 schools
✓ Schools see increases in student engagement and school pride

I've put together a guide that walks through everything: ${dealRoomUrl}

And our live demo channel shows exactly what your school could build: ${demoChannelUrl}

Can I grab 15 minutes on your calendar next week? I think you'll find it valuable.

Thanks,
[Your Name]
School TV Sales Team`;
    } else if (stage === 'final_checkin') {
      subject = `Last chance to see School TV (this month)`;
      body = `Hi ${name},

I'm reaching out one final time because I know your school has tough decisions to make during budget season, and I want to make sure you have all the information.

School TV is helping schools like yours:
• Engage students in meaningful content creation
• Build stronger school community
• Create stunning content for showcasing your school

Before we wrap up, I'd love to give you a personal walkthrough. It's only 15 minutes, and it could make a real difference in how you approach student media this year.

See the live demo here: ${dealRoomUrl}

Or just reply and let me know the best time this month. I'm flexible.

Best,
[Your Name]
School TV Sales Team`;
    } else {
      return Response.json({ error: 'Invalid stage. Use: intro, followup, final_checkin' }, { status: 400 });
    }

    return Response.json({
      school_name: schoolName,
      contact_name: name,
      stage,
      subject,
      body,
      preview: body.substring(0, 200) + '...',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});