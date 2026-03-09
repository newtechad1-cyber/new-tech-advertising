export const PRIORITY_STYLE = {
  'P0 Critical': 'bg-red-600 text-white',
  'P0': 'bg-red-600 text-white',
  'P1 High': 'bg-orange-500 text-white',
  'P1': 'bg-orange-500 text-white',
  'P2 Normal': 'bg-blue-500 text-white',
  'P2': 'bg-blue-500 text-white',
  'P3 Low': 'bg-gray-400 text-white',
  'P3': 'bg-gray-400 text-white',
};

export const RESULT_STYLE = {
  Pass: 'bg-green-100 text-green-800 border-green-200',
  Fail: 'bg-red-100 text-red-800 border-red-200',
  Blocked: 'bg-orange-100 text-orange-800 border-orange-200',
  'Needs Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Not Run': 'bg-gray-100 text-gray-600 border-gray-200',
};

export const SEVERITY_STYLE = {
  Critical: 'bg-red-100 text-red-800 border-red-300',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const ISSUE_STATUS_STYLE = {
  Open: 'bg-red-50 text-red-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Blocked: 'bg-orange-50 text-orange-700',
  Resolved: 'bg-green-50 text-green-700',
  Closed: 'bg-gray-100 text-gray-500',
};

export function PriorityBadge({ priority, className = '' }) {
  const p = priority || 'P2';
  const short = p.split(' ')[0];
  return (
    <span className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${PRIORITY_STYLE[p] || PRIORITY_STYLE[short] || 'bg-gray-200 text-gray-700'} ${className}`}>
      {short}
    </span>
  );
}

export function ResultBadge({ result }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${RESULT_STYLE[result] || RESULT_STYLE['Not Run']}`}>
      {result || 'Not Run'}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${SEVERITY_STYLE[severity] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {severity}
    </span>
  );
}