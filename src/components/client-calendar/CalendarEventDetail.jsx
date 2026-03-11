import React from 'react';
import { X, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import ChannelPills from './ChannelPills';
import WhyPostingNote from './WhyPostingNote';

export default function CalendarEventDetail({ event, onClose }) {
  if (!event) return null;

  const platforms = Array.isArray(event.platforms) ? event.platforms : [event.platforms].filter(Boolean);
  const eventDate = new Date(event.date);
  const isPublished = event.status === 'published';
  const needsApproval = event.status === 'approval';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Content Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thumbnail */}
          {event.thumbnail && (
            <img 
              src={event.thumbnail} 
              alt={event.title} 
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Title and Status */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{event.title}</h3>
            <div className="flex flex-wrap gap-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                event.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                event.status === 'approval' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {event.status === 'published' && <CheckCircle className="w-4 h-4" />}
                {event.status === 'scheduled' && <Clock className="w-4 h-4" />}
                <span>{
                  event.status === 'published' ? 'Published' :
                  event.status === 'scheduled' ? 'Scheduled' :
                  event.status === 'approval' ? 'Needs Approval' :
                  'In Preparation'
                }</span>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Scheduled For</p>
            <p className="text-lg font-semibold text-slate-900">
              {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {event.time && (
              <p className="text-sm text-slate-600 mt-1">{event.time}</p>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-sm text-slate-600 mb-2">Description</p>
              <p className="text-slate-900">{event.description}</p>
            </div>
          )}

          {/* Channels */}
          {platforms.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-3">Publishing To</p>
              <ChannelPills platforms={platforms} />
            </div>
          )}

          {/* Caption */}
          {event.caption && (
            <div>
              <p className="text-sm text-slate-600 mb-2">Caption / Headline</p>
              <p className="text-slate-900 bg-slate-50 rounded-lg p-3 text-sm">{event.caption}</p>
            </div>
          )}

          {/* Why Posting Note */}
          <WhyPostingNote platforms={platforms} status={event.status} />

          {/* CTA */}
          {event.cta && (
            <div>
              <p className="text-sm text-slate-600 mb-2">Call to Action</p>
              <p className="text-slate-900 bg-slate-50 rounded-lg p-3 text-sm">{event.cta}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            {needsApproval && (
              <>
                <a href={createPageUrl('ClientApprovals')} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve This Content
                  </Button>
                </a>
                <Button variant="outline" className="w-full">
                  Request Changes
                </Button>
              </>
            )}

            {isPublished && event.liveUrl && (
              <a href={event.liveUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Live Content
                </Button>
              </a>
            )}

            {event.status === 'scheduled' && (
              <a href={createPageUrl('ClientApprovals')} className="block">
                <Button variant="outline" className="w-full">
                  View Full Details
                </Button>
              </a>
            )}

            <Button variant="ghost" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}