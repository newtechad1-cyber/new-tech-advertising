import React from 'react';
import { Clock, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function HeroStrip({ 
  nextPost = null, 
  pendingCount = 0, 
  campaignRunning = null 
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Next Post */}
        <div className="sm:border-r sm:border-blue-200 sm:pr-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-slate-600">Next Scheduled</p>
          </div>
          {nextPost ? (
            <p className="text-lg font-bold text-slate-900">{nextPost.title}</p>
          ) : (
            <p className="text-slate-500 text-sm">No posts scheduled yet</p>
          )}
          {nextPost && (
            <p className="text-xs text-slate-500 mt-1">
              {new Date(nextPost.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Pending */}
        <div className="sm:border-r sm:border-blue-200 sm:px-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm font-semibold text-slate-600">Awaiting Approval</p>
          </div>
          <p className="text-lg font-bold text-slate-900">{pendingCount} item{pendingCount !== 1 ? 's' : ''}</p>
          {pendingCount > 0 && (
            <p className="text-xs text-slate-500 mt-1">Review these to keep content flowing</p>
          )}
        </div>

        {/* Campaign */}
        <div className="sm:pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-violet-600" />
            <p className="text-sm font-semibold text-slate-600">Active Campaign</p>
          </div>
          {campaignRunning ? (
            <p className="text-lg font-bold text-slate-900">{campaignRunning}</p>
          ) : (
            <p className="text-slate-500 text-sm">No active campaigns</p>
          )}
        </div>
      </div>

      {/* Action CTA */}
      {pendingCount > 0 ? (
        <div className="pt-4 border-t border-blue-200">
          <a href={createPageUrl('ClientApprovals')}>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto">
              <AlertCircle className="w-4 h-4" />
              Review {pendingCount} Pending Item{pendingCount !== 1 ? 's' : ''}
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </a>
        </div>
      ) : nextPost ? (
        <div className="pt-4 border-t border-blue-200">
          <p className="text-sm text-slate-600">
            ✓ Everything is scheduled and ready. Your marketing is running smoothly.
          </p>
        </div>
      ) : null}
    </div>
  );
}