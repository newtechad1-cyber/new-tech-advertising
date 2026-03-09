import { createPageUrl } from '@/utils';
import { Activity, List, Play, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

const NAV = [
  { label: 'Dashboard',  page: 'AdminQA',          Icon: Activity },
  { label: 'Test Cases', page: 'AdminQATests',      Icon: List },
  { label: 'Test Runs',  page: 'AdminQARuns',       Icon: Play },
  { label: 'Issues',     page: 'AdminQAIssues',     Icon: AlertTriangle },
  { label: 'Readiness',  page: 'AdminQAReadiness',  Icon: CheckCircle2 },
];

export default function QANav({ current }) {
  return (
    <div className="bg-white border-b border-gray-200 mb-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center px-6">
        <div className="flex items-center gap-2 pr-6 mr-2 border-r border-gray-200 py-3 shrink-0">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-gray-900 text-sm">QA Command Center</span>
        </div>
        <nav className="flex overflow-x-auto scrollbar-none">
          {NAV.map(({ label, page, Icon }) => (
            <a key={page} href={createPageUrl(page)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                current === page ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}