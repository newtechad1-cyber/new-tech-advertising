import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const DEFAULT_BRANDING = {
  school_name: 'Hampton-Dumont',
  district_name: 'Hampton-Dumont Community School District',
  mascot_name: 'Bulldogs',
  network_name: 'Bulldog TV',
  primary_color: '#1e3a5f',
  secondary_color: '#f59e0b',
  accent_color: '#ffffff',
  intro_text: 'Stories from Hampton-Dumont Schools',
  outro_text: 'Excellence Every Day',
  public_submission_page_title: 'Share Your Story',
  public_gallery_title: 'Bulldog TV — Watch Our Latest Videos',
  upload_instructions: 'Submit video clips or photos from school events, sports, classroom moments, clubs, arts, and more. All submissions are reviewed by staff before publishing.',
  legal_release_text: 'By submitting content, you confirm that you have permission to share this media and grant Hampton-Dumont Community School District the right to use it for school-related purposes.',
  contact_email: 'media@hampton-dumont.k12.ia.us',
};

export function useSchoolBranding() {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.SchoolBranding.filter({ is_active: true }).then(records => {
      if (records.length > 0) setBranding({ ...DEFAULT_BRANDING, ...records[0] });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { branding, loading };
}