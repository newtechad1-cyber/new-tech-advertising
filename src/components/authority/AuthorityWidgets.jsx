/**
 * R0.7 — Authority Dashboard Widgets
 * Reusable stat and display components for the Authority Dashboard.
 */
import React from 'react';
import * as LucideIcons from 'lucide-react';

export function AuthorityStat({ label, value, sublabel, icon, color = 'blue', trend }) {
  const IconComponent = icon ? (LucideIcons[icon] || LucideIcons.BarChart2) : LucideIcons.BarChart2;
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-900/30 border-blue-700/50',
    emerald: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50',
    amber: 'text-amber-400 bg-amber-900/30 border-amber-700/50',
    rose: 'text-rose-400 bg-rose-900/30 border-rose-700/50',
    purple: 'text-purple-400 bg-purple-900/30 border-purple-700/50',
    cyan: 'text-cyan-400 bg-cyan-900/30 border-cyan-700/50',
    slate: 'text-slate-400 bg-slate-800/50 border-slate-700/50',
  };
  const cls = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl p-4 border ${cls}`}>
      <div className="flex items-center justify-between mb-2">
        <IconComponent className="w-4 h-4 opacity-60" />
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      {sublabel && <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>}
    </div>
  );
}

export function AuthorityTable({ title, columns, rows, emptyText = 'No data available' }) {
  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-200">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/30">
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-2 text-left text-xs font-medium text-slate-500 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 text-sm">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-700/10">
                  {columns.map((col, j) => (
                    <td key={j} className={`px-4 py-2 text-slate-300 ${col.align === 'right' ? 'text-right' : ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AuthoritySection({ title, icon, children, actions }) {
  const IconComponent = icon ? (LucideIcons[icon] || LucideIcons.Layers) : null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="w-5 h-5 text-slate-400" />}
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const statusMap = {
    indexed: 'bg-emerald-800/60 text-emerald-300',
    'not-indexed': 'bg-rose-800/60 text-rose-300',
    'crawled-not-indexed': 'bg-amber-800/60 text-amber-300',
    orphaned: 'bg-rose-800/60 text-rose-300',
    strong: 'bg-emerald-800/60 text-emerald-300',
    weak: 'bg-amber-800/60 text-amber-300',
    missing: 'bg-slate-800/60 text-slate-400',
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusMap[status] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  );
}
