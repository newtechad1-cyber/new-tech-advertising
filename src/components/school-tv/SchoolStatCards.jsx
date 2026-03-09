import { Upload, CheckCircle, Film, Loader2, Play, AlertCircle } from 'lucide-react';

export default function SchoolStatCards({ submissions = [], projects = [], renders = [] }) {
  const stats = [
    { label: 'Pending Submissions', value: submissions.filter(s => s.status === 'pending').length, icon: Upload, color: 'text-yellow-500 bg-yellow-50' },
    { label: 'Approved Submissions', value: submissions.filter(s => s.status === 'approved').length, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
    { label: 'Projects In Progress', value: projects.filter(p => !['published','failed','draft'].includes(p.status)).length, icon: Film, color: 'text-blue-500 bg-blue-50' },
    { label: 'Renders Queued', value: renders.filter(r => ['queued','rendering','processing','preparing'].includes(r.status)).length, icon: Loader2, color: 'text-purple-500 bg-purple-50' },
    { label: 'Published Videos', value: projects.filter(p => p.status === 'published').length, icon: Play, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Failed Renders', value: renders.filter(r => r.status === 'failed').length, icon: AlertCircle, color: 'text-red-500 bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map(({ label, value, icon: StatIcon, color }) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mx-auto mb-2`}>
            <StatIcon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900">{value}</div>
          <div className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
        </div>
      ))}
    </div>
  );
}