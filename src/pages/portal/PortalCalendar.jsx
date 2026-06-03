import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const platformIcons = {
  facebook: <Facebook className="w-4 h-4 text-blue-600" />,
  instagram: <Instagram className="w-4 h-4 text-pink-600" />,
  linkedin: <Linkedin className="w-4 h-4 text-blue-700" />,
  x: <Twitter className="w-4 h-4 text-sky-500" />
};

export default function PortalCalendar() {
  const { data: user } = useQuery({ queryKey: ['auth-me'], queryFn: () => base44.auth.me() });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['client-posts', user?.client_id],
    queryFn: async () => {
      if (!user?.client_id && user?.role !== 'admin') return [];
      const query = user?.role === 'admin' ? {} : { client_id: user.client_id };
      return await base44.entities.SocialPostQueue.filter(query, '-scheduled_time', 50);
    },
    enabled: !!user
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading calendar...</div>;

  const upcoming = posts.filter(p => new Date(p.scheduled_time) > new Date());
  const past = posts.filter(p => new Date(p.scheduled_time) <= new Date());

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground">View your scheduled and historically published social media posts.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" /> Upcoming Posts
        </h2>
        {upcoming.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No upcoming posts scheduled currently.</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map(post => (
              <Card key={post.id} className="border-l-4 border-l-primary shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {platformIcons[post.platform?.toLowerCase()] || <CalendarIcon className="w-4 h-4 text-slate-400" />}
                      <span className="font-medium capitalize">{post.platform}</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-50">{post.publish_status}</Badge>
                  </div>
                  <CardTitle className="text-sm font-normal text-muted-foreground">
                    Scheduled for: {new Date(post.scheduled_time).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap bg-slate-50/50 p-3 rounded-md">{post.post_text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold text-slate-500">Recently Published</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {past.slice(0, 6).map(post => (
            <Card key={post.id} className="bg-slate-50/50 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-medium">
                  {platformIcons[post.platform?.toLowerCase()]}
                  {new Date(post.scheduled_time).toLocaleDateString()}
                </div>
                <p className="text-sm line-clamp-3 text-slate-600">{post.post_text}</p>
              </CardContent>
            </Card>
          ))}
          {past.length === 0 && <p className="text-muted-foreground text-sm col-span-full">No past posts available.</p>}
        </div>
      </div>
    </div>
  );
}