import React, { useState } from 'react';
import { useGlobalContext } from './useGlobalContext.js';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

/**
 * ContextDebugBadge
 * 
 * Dev-only floating badge showing current global context
 * Only visible in development mode
 * 
 * Shows:
 * - Active context type
 * - Active company/school/vertical
 * - User role
 * - Nav family
 */
export default function ContextDebugBadge() {
  const { context, loading } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  if (loading || !context) {
    return null;
  }

  const getContextColor = () => {
    switch (context.active_context_type) {
      case 'agency':
        return 'border-purple-400 bg-purple-50';
      case 'client':
        return 'border-blue-400 bg-blue-50';
      case 'school':
        return 'border-amber-400 bg-amber-50';
      case 'vertical_system':
        return 'border-green-400 bg-green-50';
      default:
        return 'border-slate-400 bg-slate-50';
    }
  };

  const getContextTypeColor = () => {
    switch (context.active_context_type) {
      case 'agency':
        return 'bg-purple-200 text-purple-900';
      case 'client':
        return 'bg-blue-200 text-blue-900';
      case 'school':
        return 'bg-amber-200 text-amber-900';
      case 'vertical_system':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-slate-200 text-slate-900';
    }
  };

  const contextDetails = [
    {
      label: 'Type',
      value: context.active_context_type?.toUpperCase(),
    },
    ...(context.active_company_name ? [
      { label: 'Company', value: context.active_company_name }
    ] : []),
    ...(context.active_school_name ? [
      { label: 'School', value: context.active_school_name }
    ] : []),
    ...(context.active_vertical_type ? [
      { label: 'Vertical', value: context.active_vertical_type?.toUpperCase() }
    ] : []),
    {
      label: 'Role',
      value: context.active_user_role?.toUpperCase(),
    },
    {
      label: 'Nav Family',
      value: context.active_nav_family?.toUpperCase(),
    },
  ];

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className={`fixed bottom-4 right-4 px-3 py-1.5 text-xs font-mono font-bold rounded border-2 ${getContextColor()} hover:shadow-md transition z-50 cursor-pointer`}
      >
        📍 Context
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`border-2 ${getContextColor()} shadow-lg`}>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded ${getContextTypeColor()}`}>
              {context.active_context_type?.toUpperCase()}
            </span>
            <button
              onClick={() => setCollapsed(true)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 border-t pt-2">
            {contextDetails.map((detail, idx) => (
              <div key={idx} className="text-xs font-mono">
                <span className="text-slate-600">{detail.label}:</span>{' '}
                <span className="font-bold text-slate-900">{detail.value}</span>
              </div>
            ))}
          </div>

          {context.last_context_switch_at && (
            <div className="text-xs text-slate-500 border-t pt-1.5">
              Last switch: {new Date(context.last_context_switch_at).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}