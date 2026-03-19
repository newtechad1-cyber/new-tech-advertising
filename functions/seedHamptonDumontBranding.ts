import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if Hampton-Dumont already exists
    const existing = await base44.asServiceRole.entities.SchoolBranding.filter({
      school_slug: 'hampton-dumont',
    });

    if (existing.length > 0) {
      return Response.json({ message: 'Hampton-Dumont branding already exists' });
    }

    // Seed Hampton-Dumont branding
    const branding = await base44.asServiceRole.entities.SchoolBranding.create({
      school_name: 'Hampton-Dumont Community School',
      school_slug: 'hampton-dumont',
      district_name: 'Hampton-Dumont Community School District',
      mascot_name: 'Bulldog',
      network_name: 'Bulldog Story Lab',
      logo: 'https://via.placeholder.com/200x100?text=HD+Bulldogs',
      primary_color: '#1e3a5f',
      secondary_color: '#f59e0b',
      accent_color: '#ffffff',
      intro_text: 'Welcome to Bulldog Story Lab',
      outro_text: 'Go Bulldogs!',
      public_submission_page_title: 'Share Your Bulldog Story',
      public_gallery_title: 'Bulldog Media Hub',
      upload_instructions: 'Upload your videos, photos, and stories from school events. All submissions require parental consent.',
      legal_release_text: 'By submitting content, you confirm you have parental/guardian permission to share.',
      contact_email: 'storieslab@hampton-dumont.edu',
      social_youtube_url: 'https://youtube.com',
      social_facebook_url: 'https://facebook.com',
      social_instagram_url: 'https://instagram.com',
      is_active: true,
    });

    return Response.json({
      success: true,
      message: 'Hampton-Dumont branding seeded successfully',
      branding,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});