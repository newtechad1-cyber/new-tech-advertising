import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Zap, Search, Share2, Star, BarChart2, Video } from 'lucide-react';

const DATA = {
  industry: 'Restaurant',
  headline: 'Fill More Tables With AI-Powered Restaurant Marketing',
  subheadline: 'Hungry customers scroll social media before they search on Google. Our AI keeps your restaurant front-and-center with mouth-watering content, automated reviews, and local SEO.',
  color: '#ef4444',
  stats: [
    { value: '3x', label: 'More social engagement' },
    { value: '60%', label: 'Guests discover via social' },
    { value: '12+', label: 'Posts created per month' },
    { value: '0 hrs', label: 'Owner time on marketing' },
  ],
  contentExamples: [
    {
      companyName: "Luigi's Trattoria",
      platform: 'Instagram',
      caption: '🍝 It\'s Pasta Wednesday! Our handmade fettuccine Alfredo is back by popular demand. Made fresh daily with a family recipe passed down 3 generations. Reservations filling fast — link in bio!',
      hashtags: '#PastaWednesday #ItalianFood #LocalRestaurant #FreshPasta',
      likes: 234,
      comments: 47,
    },
    {
      companyName: 'Smokehouse BBQ',
      platform: 'Facebook',
      caption: '🔥 Weekend Special Alert! Full rack of ribs + 2 sides + cornbread for $28.99. Available Saturday & Sunday only while supplies last. Tag someone you\'d share these with 👇',
      hashtags: '#BBQ #WeekendSpecial #SmokehouseBBQ #RibsAndBeer',
      likes: 189,
      comments: 83,
    },
    {
      companyName: 'The Morning Cup',
      platform: 'Google Business',
      caption: 'Happy Monday from The Morning Cup! Stop in for our seasonal Lavender Honey Latte — only available through May. Open at 6am for your early commute. See you soon!',
      hashtags: '',
      likes: 45,
      comments: 11,
    },
  ],
  features: [
    { icon: Share2, title: 'Food & Promo Content', desc: 'AI creates drool-worthy menu posts, daily specials, seasonal promotions, and event announcements.' },
    { icon: Star, title: 'Review Management', desc: 'Respond to reviews automatically and grow your rating across Google, Yelp, and TripAdvisor.' },
    { icon: Search, title: 'Local Restaurant SEO', desc: 'Get found when people search "best [cuisine] near me" with AI-optimized blog content and GMB posts.' },
    { icon: Video, title: 'Behind-the-Scenes Videos', desc: 'Automatically generate chef spotlight videos, kitchen tours, and recipe reels for Instagram & TikTok.' },
    { icon: BarChart2, title: 'Reservation Analytics', desc: 'Track which posts drive OpenTable bookings and walk-ins to double down on what works.' },
  ],
  testimonial: {
    quote: 'We grew our Instagram from 400 to 2,200 followers in 90 days. Friday nights are consistently packed now. The AI literally writes better captions than I do.',
    author: 'Maria L.',
    company: "Luigi's Trattoria, Denver CO",
  },
};

export default function RestaurantMarketing() {
  return <VerticalPageTemplate data={DATA} />;
}