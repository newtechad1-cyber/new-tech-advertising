import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Content' },
  { value: 'approval', label: 'Needs Approval' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'In Preparation' },
];

const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'website', label: 'Website' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
];

export default function CalendarFilters({ statusFilter, channelFilter, onStatusChange, onChannelChange, onReset }) {
  const hasActiveFilters = statusFilter !== 'all' || channelFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40 bg-white border-slate-200">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={channelFilter} onValueChange={onChannelChange}>
        <SelectTrigger className="w-40 bg-white border-slate-200">
          <SelectValue placeholder="Filter by channel" />
        </SelectTrigger>
        <SelectContent>
          {CHANNEL_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded-md hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  );
}