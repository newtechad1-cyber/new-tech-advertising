import { Link } from 'react-router-dom';
import { BookOpen, Play, Headphones, Library } from 'lucide-react';
const formats = [
  { label: 'Read lessons', to: '/knowledge', icon: BookOpen },
  { label: 'Watch videos', to: '/learning-center/videos', icon: Play },
  { label: 'Listen to podcasts', to: '/podcasts', icon: Headphones },
  { label: 'Explore books', to: '/books', icon: Library },
];
export default function LearningFormatNav() {
  return <nav aria-label="Choose how to learn" className="my-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {formats.map(({ label, to, icon: Icon }) => <Link key={to} to={to} className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-slate-900 px-4 py-4 text-center text-sm font-bold text-white transition-colors hover:border-cyan-300 hover:bg-cyan-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><Icon className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />{label}</Link>)}
  </nav>;
}
