import React from 'react';
import { useGlobalContext } from '@/components/context/useGlobalContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, Video, AlertCircle, Settings } from 'lucide-react';

export default function PublishingHeader({ onRefresh, isRefreshing }) {
  const { activeContextType, activeCompanyName, activeSchoolName, getContextLabel } = useGlobalContext();

  return (
    <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100 p-6">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Publishing Command Center</h1>
        <p className="text-gray-600 mt-1">Review, approve, schedule, and distribute branded content across channels.</p>
      </div>

      {/* Context Summary */}
      {activeContextType && (
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200">
            <span className="text-gray-600">Context:</span>
            <span className="font-semibold text-gray-900">
              {getContextLabel()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Pipeline
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Open Connections
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Video className="w-4 h-4" />
          Video Library
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertCircle className="w-4 h-4" />
          Failed Jobs
        </Button>
      </div>
    </div>
  );
}