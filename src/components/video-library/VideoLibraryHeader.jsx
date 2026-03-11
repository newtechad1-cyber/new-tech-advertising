import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Plus, Command, AlertTriangle, RefreshCw } from 'lucide-react';

export default function VideoLibraryHeader({ metrics }) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-8 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Video Library</h1>
            <p className="text-slate-600 text-sm mt-1">Manage video assets, review publishing readiness, and control distribution workflows.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Link to={createPageUrl("AdminVideoPublishing")}>
              <Button variant="outline" size="sm" className="gap-2 w-full">
                <Command className="w-4 h-4" />
                Command Center
              </Button>
            </Link>
            {metrics.failed > 0 && (
              <Button variant="outline" size="sm" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                <AlertTriangle className="w-4 h-4" />
                {metrics.failed} Failed
              </Button>
            )}
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Upload Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}