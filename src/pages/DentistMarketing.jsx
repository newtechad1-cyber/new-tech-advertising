import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Search, Share2, Star, BarChart2, Video, Zap } from 'lucide-react';

const DATA = {
  industry: 'Dentist',
  headline: 'Attract New Dental Patients on Autopilot',
  subheadline: 'Patients choose their dentist based on online reputation. Our AI platform manages your social media, builds 5-star reviews, and keeps your schedule full — all automatically.',
  color: '#06b6d4',
  stats: [
    { value: '40+', label: 'New patients per month avg' },
    { value: '4.9★', label: 'Average Google rating' },
    { value: '90%', label: 'Patients check reviews before booking' },
    { value: '15min', label: 'Weekly time investment' },
  ],
  contentExamples: [
    {
      companyName: 'Bright Smile Dental',
      platform: 'Instagram',
      caption: '😁 Smile transformation Tuesday! Meet Sarah — she came to us feeling self-conscious about her smile. After Invisalign and professional whitening, she can\'t stop smiling! Ready for your transformation? DM us for a free consultation.',
      hashtags: '#SmileTransformation #Invisalign #DentalCare #BrightSmile',
      likes: 312,
      comments: 67,
    },
    {
      companyName: 'Family First Dentistry',
      platform: 'Facebook',
      caption: '🦷 Back to school dental reminder! Make sure your kids\' teeth are healthy before the school year starts. We\'re booking back-to-school checkups now — call or book online. Most insurances accepted!',
      hashtags: '#BackToSchool #KidsDentist #FamilyDentistry',
      likes: 78,
      comments: 22,
    },
    {
      companyName: 'Premier Dental Group',
      platform: 'Google Business',
      caption: 'February is National Children\'s Dental Health Month! We\'re offering free sealant applications for new pediatric patients all month. Help your child start healthy habits early — book now.',
      hashtags: '',
      likes: 52,
      comments: 14,
    },
  ],
  features: [
    { icon: Star, title: 'Review Generation', desc: 'After every appointment, patients get an automated review request. Build 5-star credibility that fills your schedule.' },
    { icon: Share2, title: 'Patient Education Content', desc: 'AI creates engaging posts about dental tips, service spotlights, and patient success stories.' },
    { icon: Search, title: 'Local Dental SEO', desc: 'Rank for "dentist near me," "teeth whitening," and other high-value terms in your city.' },
    { icon: Video, title: 'Smile Transformation Videos', desc: 'Showcase before & after results with professional video content that converts social scrollers to patients.' },
    { icon: BarChart2, title: 'New Patient Analytics', desc: 'Track exactly which marketing touchpoints are driving new patient bookings.' },
  ],
  testimonial: {
    quote: 'We went from 23 reviews to 190 in six months. New patients tell us every week they picked us because of our Google rating. The ROI is insane.',
    author: 'Dr. Amanda K.',
    company: 'Bright Smile Dental, Phoenix AZ',
  },
};

export default function DentistMarketing() {
  return <VerticalPageTemplate data={DATA} />;
}