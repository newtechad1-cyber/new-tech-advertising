import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Zap, Link2, Clock } from 'lucide-react';

export default function EnhancedActivityFeed({ events = [] }) {
  const groupedEvents = {
    reviews: [],
    publishes: [],
    failures: [],
    connections: [],
  };

  events.forEach((event) => {
    if (event.event_type?.includes('approved') || event.event_type?.includes('review')) {
      groupedEvents.reviews.push(event);
    } else if (event.event_type?.includes('publish') || event.event_type?.includes('published')) {
      groupedEvents.publishes.push(event);
    } else if (event.event_type?.includes('fail') || event.event_type?.includes('error')) {
      groupedEvents.failures.push(event);
    } else if (event.event_type?.includes('connection') || event.event_type?.includes('token')) {
      groupedEvents.connections.push(event);
    }
  });

  const EventGroup = ({ title, icon: Icon, events, color, bgColor }) => {
    if (!events || events.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-semibold text-slate-700">{title}</span>
          <span className={`ml-auto text-xs font-bold ${color}`}>{events.length}</span>
        </div>
        <div className="space-y-1 pl-6">
          {events.slice(0, 3).map((event, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${bgColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 truncate">{event.event_label || event.event_type}</p>
                {event.destination && (
                  <p className="text-slate-500 text-xs">{event.destination}</p>
                )}
              </div>
              {event.logged_at && (
                <span className="text-slate-400 flex-shrink-0 whitespace-nowrap">
                  {new Date(event.logged_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasEvents =
    groupedEvents.reviews.length > 0 ||
    groupedEvents.publishes.length > 0 ||
    groupedEvents.failures.length > 0 ||
    groupedEvents.connections.length > 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Activity Feed
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {!hasEvents ? (
          <div className="text-center py-6 space-y-2">
            <div className="text-slate-400">
              <Clock className="w-6 h-6 mx-auto opacity-50" />
            </div>
            <p className="text-sm text-slate-600">No recent activity</p>
            <p className="text-xs text-slate-500">Events will appear here as they occur</p>
          </div>
        ) : (
          <>
            <EventGroup
              title="Reviews"
              icon={CheckCircle2}
              events={groupedEvents.reviews}
              color="text-green-600"
              bgColor="bg-green-500"
            />
            <EventGroup
              title="Publishes"
              icon={Zap}
              events={groupedEvents.publishes}
              color="text-blue-600"
              bgColor="bg-blue-500"
            />
            <EventGroup
              title="Failures"
              icon={AlertCircle}
              events={groupedEvents.failures}
              color="text-red-600"
              bgColor="bg-red-500"
            />
            <EventGroup
              title="Connections"
              icon={Link2}
              events={groupedEvents.connections}
              color="text-amber-600"
              bgColor="bg-amber-500"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}