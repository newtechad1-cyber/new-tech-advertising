import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

function buildPortalLanding(account) {
  const { name, industry, location_city, location_state } = account;
  const loc = `${location_city}, ${location_state}`;

  return {
    headline: "This Is Where the Work Gets Done",
    subheadline: `You're one step away from your client portal. You've seen what New Tech Advertising offers. This is the platform that powers it — where your content is managed, your brand is built, and your marketing actually runs. Start your free trial, tell us about your ${industry} business, and we'll have your account configured and ready within one business day.`,
    hero_bullets: [
      "No credit card required",
      "Full platform access",
      "Cancel anytime"
    ],
    cta_primary: "Start My 7-Day Free Trial",
    cta_secondary: "Existing Client Sign In",
    sections_json: {
      trial_banner: {
        heading: "7-Day Free Trial",
        body: `Submit your business info and we'll build your Brand DNA profile, configure your dashboard, and get your marketing pipeline running — all within your first week, free.`
      },
      what_makes_different: {
        heading: "This isn't just a software signup",
        body: "When you start your trial, a real person on the NTA team reviews your submission, builds your brand profile, and configures your account. You log in to something that's already working.",
        bullets: [
          "Your Brand DNA is built from what you tell us — your voice, your audience, your goals",
          "Content is generated around your business specifically, not generic templates",
          "Your social platforms are connected and ready to publish",
          "You can add staff or team members with their own access",
          "Every post goes through your approval before it goes live",
          "You see exactly what's scheduled, what's live, and what's performing"
        ]
      },
      features: {
        heading: "Your Client Portal, Built Around Your Business",
        subheading: "Everything you need to see, approve, and track your marketing — in one place.",
        items: [
          { title: "Your Brand Dashboard", desc: "One place to see everything — scheduled posts, pending approvals, active campaigns, and performance at a glance." },
          { title: "Content Management", desc: "Review and approve every piece of content before it goes out. Or set it and let it run. You control how hands-on you want to be." },
          { title: "Team & User Access", desc: "Add staff, managers, or partners with their own logins. Everyone sees what they need to — nothing more." },
          { title: "Social Connections", desc: "Connect your Facebook, Instagram, LinkedIn, and more. Posts go out directly from the platform — no copying and pasting." },
          { title: "Reporting & Insights", desc: "Track what matters — reach, engagement, content performance. Plain-language summaries, not marketing data dumps." },
          { title: "Brand DNA Profile", desc: "Your voice, your audience, your goals — all on file so every piece of content we create sounds like you, not a template." }
        ]
      },
      how_involved: {
        heading: "How Involved Do You Want to Be?",
        subheading: "You set the level. We adjust to it.",
        hands_on: {
          title: "You're in the Driver's Seat",
          bullets: [
            "Use the platform tools yourself to create and schedule",
            "Review content drafts and publish on your schedule",
            "Access templates built around your Brand DNA",
            "The team is available when you need a hand"
          ]
        },
        hands_off: {
          title: "We Run It, You Approve It",
          bullets: [
            "NTA creates all content using your Brand DNA",
            "You get a weekly approval queue — takes minutes",
            "Posts go live automatically after your sign-off",
            "Comment & response bots handle engagement 24/7",
            "Monthly performance reports in plain language"
          ],
          note: "This is a managed service. We'll walk you through everything before we start — no surprises."
        },
        footer_note: "Most clients start hands-off and stay that way. Tell us your preference when you sign up."
      },
      what_to_expect: {
        heading: "What to Expect from the Trial",
        items: [
          { heading: "We configure it, you don't have to.", body: "After you submit your brand info, we do the setup. You're not paying to figure out software — you're getting a working account." },
          { heading: "Your content sounds like you.", body: "Everything we create uses your Brand DNA — your tone, your audience, your offers. It doesn't sound like it came from a robot." },
          { heading: "Nothing goes out without your approval.", body: "Every post hits your approval queue first. You're always in control of what represents your business." },
          { heading: "No pressure at the end.", body: "When the trial ends, we'll show you results and talk options. You decide what, if anything, comes next. No auto-billing, no hard sell." }
        ]
      },
      how_it_works: {
        heading: "How the Trial Works",
        steps: [
          { number: 1, title: "Submit Your Brand Info", body: "Fill out the short intake form. Tell us about your business, your customers, and what you want to achieve.", note: "Takes about 5 minutes." },
          { number: 2, title: "We Build Your Account", body: "We review your submission, build your Brand DNA profile, connect your platforms, and configure your dashboard.", note: "Done within 1 business day." },
          { number: 3, title: "You Log In and Run", body: "Your account is ready. Review your first batch of content, approve what you like, and watch it go live.", note: "We're here the whole time." }
        ]
      },
      testimonials: {
        heading: "What Clients Say After Their Trial",
        items: [
          { quote: "I didn't realize how much was happening behind the scenes.", detail: "The dashboard showed me exactly what was going out and when. Nothing fell through the cracks.", author: "Wendy Ruby" },
          { quote: "It felt like having a marketing team without hiring one.", detail: "I approved the content, they handled everything else.", author: "Pete Gardner" },
          { quote: "Finally one place for everything.", detail: "Social posts, approvals, reports — I stopped digging through emails.", author: "Tony Johnson" },
          { quote: "The brand setup was spot-on from day one.", detail: "They used what I submitted and the content actually sounded like me.", author: "Jay Monson" }
        ]
      },
      faq: {
        heading: "Questions About the Trial",
        items: [
          { q: "What exactly is included in the 7-day free trial?", a: "Full platform access — your configured dashboard, Brand DNA profile, connected social platforms, content approval queue, and a first batch of ready-to-approve content. Everything is set up for you before you log in." },
          { q: "Do I need to know how to use the software?", a: "No. We configure everything during the trial. You just log in, review your content, and approve what you want to go live. We're available if you have questions." },
          { q: "What happens after 7 days?", a: "We'll show you what ran, what performed, and walk through options. Nothing auto-bills. You decide whether to continue — no pressure, no hard sell." },
          { q: "Is this separate from what I already do with New Tech Advertising?", a: "This is the platform that powers our services. Whether you're a new or existing client, this is where your content is managed, approved, and published." },
          { q: "Who manages my account during the trial?", a: "A real person on the NTA team reviews your submission, builds your Brand DNA, and configures your dashboard. You're not on your own." }
        ]
      },
      final_cta: {
        heading: "Your account will be ready tomorrow.",
        body: "Submit your business info today. We'll build your Brand DNA profile, configure your dashboard, and have everything ready within one business day — at no cost for 7 days.",
        bullets: ["Brand DNA built for you", "Ready in 1 business day", "Full 7-day access"]
      },
      footer: {
        tagline: "The client platform behind New Tech Advertising's services — where your brand is managed, your content is created, and your marketing actually runs."
      }
    }
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, phone, industry, location_city, location_state, website_url, involvement_preference } = body;

    if (!name || !email || !industry || !location_city || !location_state) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = generateSlug(name);
    const existing = await base44.asServiceRole.entities.TrialAccount.filter({ slug: baseSlug });
    let slug = baseSlug;
    if (existing.length > 0) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Create account
    const account = await base44.asServiceRole.entities.TrialAccount.create({
      name, slug, email,
      phone: phone || '',
      industry,
      location_city,
      location_state,
      website_url: website_url || '',
      involvement_preference: involvement_preference || 'undecided',
      trial_status: 'submitted',
      trial_start_at: now.toISOString(),
      trial_end_at: trialEnd.toISOString(),
    });

    // Create personalized PortalLanding
    const landingData = buildPortalLanding({ name, industry, location_city, location_state });
    await base44.asServiceRole.entities.PortalLanding.create({
      account_id: account.id,
      ...landingData,
      last_generated_at: now.toISOString(),
    });

    // Idempotently create OnboardingProfile
    const existingProfiles = await base44.asServiceRole.entities.OnboardingProfile.filter({ account_id: account.id });
    if (!existingProfiles.length) {
      await base44.asServiceRole.entities.OnboardingProfile.create({
        account_id: account.id,
        business_name: name,
        email: email,
        phone: phone || '',
        website_url: website_url || '',
        city: location_city,
        state: location_state,
        status: 'not_started',
      });
    }

    return Response.json({
      success: true,
      slug,
      account_id: account.id,
      onboarding_url: '/ClientOnboarding',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});