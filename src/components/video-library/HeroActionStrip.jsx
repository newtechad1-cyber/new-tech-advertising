import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Play, AlertCircle, RotateCcw } from 'lucide-react';

export default function HeroActionStrip({ onUpload, onReviewNext, onFixBlocked, onRetryFailed, blockedCount, failedCount }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold">Video Command Center</h3>
          <p className="text-blue-100 text-sm">Manage content workflows and publishing pipelines</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={onUpload}
            className="bg-white text-blue-600 hover:bg-blue-50 gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </Button>
          <Button 
            onClick={onReviewNext}
            variant="outline"
            className="border-white text-white hover:bg-white/20 gap-2"
          >
            <Play className="w-4 h-4" />
            Review Next
          </Button>
          {blockedCount > 0 && (
            <Button 
              onClick={onFixBlocked}
              variant="outline"
              className="border-yellow-300 text-yellow-100 hover:bg-yellow-600/30 gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Fix Blocked ({blockedCount})
            </Button>
          )}
          {failedCount > 0 && (
            <Button 
              onClick={onRetryFailed}
              variant="outline"
              className="border-red-300 text-red-100 hover:bg-red-600/30 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Failed ({failedCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}