import React from 'react';
import { Flame, TrendingUp, Minus, Snowflake } from 'lucide-react';

const TIER_CONFIG = {
  burning: { label: 'Burning', icon: Flame, bg: '#fef2f2', text: '#dc2626', border: '#fca5a5', pulse: true },
  hot:     { label: 'Hot',     icon: TrendingUp, bg: '#fff7ed', text: '#ea580c', border: '#fdba74', pulse: false },
  warm:    { label: 'Warm',    icon: Minus, bg: '#fffbeb', text: '#d97706', border: '#fde68a', pulse: false },
  cold:    { label: 'Cold',    icon: Snowflake, bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd', pulse: false },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical Priority', bg: '#fef2f2', text: '#dc2626' },
  urgent:   { label: 'Urgent',            bg: '#fff7ed', text: '#ea580c' },
  elevated: { label: 'Elevated',          bg: '#fffbeb', text: '#d97706' },
  normal:   { label: 'Normal',            bg: '#f0fdf4', text: '#16a34a' },
};

export function EngagementBadge({ tier = 'warm', score }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.warm;
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.pulse ? 'animate-pulse' : ''}`}
      style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
      {score !== undefined && <span className="opacity-60">· {score}</span>}
    </div>
  );
}

export function PriorityBadge({ priority = 'normal' }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold" style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}