import { FileText, Globe, Video, Play, Share2, Megaphone, Mail, Layout, MapPin, BookOpen } from 'lucide-react';

const MAP = {
  seo_article:    { icon: FileText,  label: 'SEO Article',    color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  service_page:   { icon: Globe,     label: 'Service Page',   color: 'text-purple-400', bg: 'bg-purple-500/10' },
  video_script:   { icon: Video,     label: 'Video Script',   color: 'text-red-400',    bg: 'bg-red-500/10' },
  short_video:    { icon: Play,      label: 'Short Video',    color: 'text-pink-400',   bg: 'bg-pink-500/10' },
  social_post:    { icon: Share2,    label: 'Social Post',    color: 'text-green-400',  bg: 'bg-green-500/10' },
  ad_copy:        { icon: Megaphone, label: 'Ad Copy',        color: 'text-orange-400', bg: 'bg-orange-500/10' },
  email:          { icon: Mail,      label: 'Email',          color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
  landing_page:   { icon: Layout,    label: 'Landing Page',   color: 'text-violet-400', bg: 'bg-violet-500/10' },
  gbp_post:       { icon: MapPin,    label: 'GBP Post',       color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ebook_chapter:  { icon: BookOpen,  label: 'Ebook Chapter',  color: 'text-teal-400',   bg: 'bg-teal-500/10' },
};

export function getAssetMeta(type) {
  return MAP[type] || { icon: FileText, label: type, color: 'text-slate-400', bg: 'bg-slate-500/10' };
}

export default function AssetTypeIcon({ type, size = 'md' }) {
  const { icon: Icon, color, bg } = getAssetMeta(type);
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const pad = size === 'sm' ? 'p-1' : 'p-2';
  return (
    <span className={`inline-flex items-center justify-center rounded-lg ${bg} ${pad}`}>
      <Icon className={`${sz} ${color}`} />
    </span>
  );
}