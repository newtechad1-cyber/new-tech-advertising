import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Film, Search, FilterX, AlertTriangle } from 'lucide-react';

export default function EmptyStateLibrary({ hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">No videos match your filters</h3>
          <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filter criteria</p>
        </div>
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="gap-2 mx-auto"
        >
          <FilterX className="w-4 h-4" />
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <Film className="w-10 h-10 text-slate-400" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">No videos yet</h2>
        <p className="text-slate-600 mt-2">Start by uploading your first video asset</p>
      </div>
      <div className="space-y-3 max-w-sm mx-auto">
        <p className="text-sm text-slate-600">
          Upload videos to begin managing your publishing workflow. Once uploaded, you'll be able to:
        </p>
        <ul className="text-sm text-slate-600 space-y-2 text-left bg-slate-50 p-4 rounded">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>Review and approve content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>Generate captions and branding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>Schedule multi-channel distribution</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-1">•</span>
            <span>Track publishing performance</span>
          </li>
        </ul>
      </div>
      <div className="flex gap-3 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Film className="w-4 h-4" />
          Upload Your First Video
        </Button>
        <Link to={createPageUrl("AdminVideoPublishing")}>
          <Button variant="outline" className="gap-2">
            View Publishing Center
          </Button>
        </Link>
      </div>
    </div>
  );
}