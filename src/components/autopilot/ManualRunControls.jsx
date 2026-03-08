import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

const JOB_CONFIGS = [
  { type: 'Blog Generation', description: 'Generate SEO blog articles from topic clusters', icon: '📝', color: 'bg-blue-50 border-blue-200' },
  { type: 'Social Content Generation', description: 'Create social posts from latest content', icon: '📱', color: 'bg-pink-50 border-pink-200' },
  { type: 'Video Script Generation', description: 'Generate video scripts from case studies', icon: '🎬', color: 'bg-purple-50 border-purple-200' },
  { type: 'City Page Generation', description: 'Build localized SEO landing pages by city', icon: '🏙️', color: 'bg-green-50 border-green-200' },
  { type: 'Case Study Promotion', description: 'Repurpose case studies across all channels', icon: '📊', color: 'bg-orange-50 border-orange-200' },
  { type: 'Authority Pack Expansion', description: 'Expand existing authority topic clusters', icon: '⚡', color: 'bg-yellow-50 border-yellow-200' },
  { type: 'Email Newsletter Creation', description: 'Generate weekly email newsletter content', icon: '📧', color: 'bg-teal-50 border-teal-200' },
  { type: 'Lead Follow-Up', description: 'Trigger lead nurture email sequences', icon: '🎯', color: 'bg-indigo-50 border-indigo-200' },
  { type: 'SEO Refresh', description: 'Re-optimize existing pages for better ranking', icon: '🔍', color: 'bg-gray-50 border-gray-200' }
];

export default function ManualRunControls() {
  const [running, setRunning] = useState(null);
  const [service, setService] = useState('');
  const [city, setCity] = useState('');

  const runJob = async (job_type) => {
    setRunning(job_type);
    try {
      await base44.functions.invoke('runAutopilotJob', {
        job_type,
        related_service: service,
        related_city: city
      });
      toast.success(`${job_type} triggered successfully`);
    } catch (err) {
      toast.error(`Failed to run ${job_type}`);
    }
    setRunning(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-800 mb-1">Optional Context Filters</h3>
        <p className="text-xs text-gray-500 mb-3">These help the engine prioritize output for a specific service or city.</p>
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Related Service</label>
            <Input
              value={service}
              onChange={e => setService(e.target.value)}
              placeholder="e.g. streaming-tv"
              className="w-52"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Related City</label>
            <Input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Chicago"
              className="w-52"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {JOB_CONFIGS.map(({ type, description, icon, color }) => (
          <div key={type} className={`border rounded-lg p-4 ${color}`}>
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-gray-800 mt-2">{type}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">{description}</p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => runJob(type)}
              disabled={running === type}
            >
              {running === type
                ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Running...</>
                : <><Play className="w-4 h-4 mr-1" /> Run Now</>
              }
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}