import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const EMAIL_SEQUENCES = {
  default: [
    {
      step: 1,
      subject: "Your free guide is ready + a quick welcome from NTA",
      body: (lead) => `Hi ${lead.name},

Thanks for reaching out to New Tech Advertising! Your free guide has been queued and our team will follow up shortly.

Here's what you can expect from NTA's AI Marketing Platform:

✅ Automated social media content — 30+ posts per month, done for you
✅ Streaming TV advertising on Roku, Hulu & YouTube TV
✅ AI-powered local SEO that dominates Google search
✅ ADA website compliance that protects your business

Most of our clients see results within the first 30 days.

Want to see exactly how it works for ${lead.business_name || 'your business'}? Reply to this email or book a free 30-minute strategy call:

👉 https://newtechadvertising.com/book-call

Talk soon,
Rick
New Tech Advertising`
    },
    {
      step: 2,
      subject: "How local businesses are winning on streaming TV (case study)",
      body: (lead) => `Hi ${lead.name},

Quick question — have you ever watched a TV show on Roku or Hulu and thought "I wish MY business could advertise there"?

Good news: you can. And it's more affordable than you think.

Here's how it works for local businesses like ${lead.business_name || 'yours'}:

1️⃣ We create a professional 30-second video ad using AI
2️⃣ We target your exact local area — zip code, age, household income
3️⃣ Your ad runs on premium networks: Roku, Hulu, YouTube TV, ESPN+
4️⃣ You get weekly analytics showing impressions, reach & conversions

One of our HVAC clients in Dallas started with just $500/month and saw a 3x increase in summer service calls within 60 days.

Want to see if streaming TV advertising makes sense for ${lead.city ? lead.city + '-area ' : ''}businesses like yours?

👉 https://newtechadvertising.com/book-call

Best,
Rick`
    },
    {
      step: 3,
      subject: "3 things most local businesses get wrong about digital marketing",
      body: (lead) => `Hi ${lead.name},

After working with hundreds of local businesses, I've noticed 3 mistakes that keep most of them stuck:

❌ Mistake #1: Relying only on Facebook ads
Facebook reach has dropped 80% since 2015. Your posts reach fewer people each year.

❌ Mistake #2: Skipping video content
Businesses with video grow 49% faster. But most don't know how to produce it affordably.

❌ Mistake #3: Ignoring streaming TV
While your competitors are fighting over Google clicks, streaming TV gives you a blue ocean of local reach.

What NTA does differently:

We combine all three — social, video, and streaming TV — into one automated AI system that runs 24/7 without you lifting a finger.

The result? You dominate your local market on every screen.

Ready to see how this could work for ${lead.business_name || 'your business'}?

👉 Start your free trial: https://newtechadvertising.com/start

Talk soon,
Rick`
    },
    {
      step: 4,
      subject: "Free consultation — let's build your marketing plan",
      body: (lead) => `Hi ${lead.name},

I want to make this personal.

If you've been following along, you know what NTA can do for local businesses. But I'd rather show you exactly what we'd build specifically for ${lead.business_name || 'your business'} in ${lead.city || 'your area'}.

That's why I'm offering you a free 30-minute Marketing Strategy Call.

On this call we'll:
📍 Audit your current online presence
📍 Identify your top 3 growth opportunities
📍 Show you a custom marketing plan for your business
📍 Answer any questions you have — no pressure, no pitch

This call is completely free. We only take on clients we know we can get results for.

👉 Book your free call here: https://newtechadvertising.com/book-call

Spots are limited — I only do 5 of these per week.

Talk soon,
Rick
Founder, New Tech Advertising`
    }
  ]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, step } = await req.json();

    const lead = (await base44.asServiceRole.entities.Lead.filter({ id: lead_id }))[0];
    if (!lead) return Response.json({ error: 'Lead not found' }, { status: 404 });

    const sequence = EMAIL_SEQUENCES.default;
    const emailStep = sequence.find(s => s.step === step);
    if (!emailStep) return Response.json({ error: 'Invalid step' }, { status: 400 });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: lead.email,
      subject: emailStep.subject,
      body: emailStep.body(lead)
    });

    await base44.asServiceRole.entities.Lead.update(lead_id, {
      follow_up_sequence_step: step,
      last_contacted: new Date().toISOString().split('T')[0]
    });

    return Response.json({ success: true, step, email: lead.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});