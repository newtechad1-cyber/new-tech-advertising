import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export function GenerateSchoolStoryContentModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    school_slug: '',
    school_name: '',
    activity_type: '',
    event_name: '',
    clip_description: '',
  });

  useEffect(() => {
    if (open) {
      base44.asServiceRole.entities.SchoolBranding.list().then((data) => {
        setSchools(data);
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.school_slug) {
      toast.error('Please select a school');
      return;
    }

    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'generateSchoolStoryContent',
        status: 'pending',
        trigger_source: 'manual',
        school_slug: formData.school_slug,
        input_data: JSON.stringify(formData),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setFormData({ school_slug: '', school_name: '', activity_type: '', event_name: '', clip_description: '' });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate School Story Content</DialogTitle>
          <DialogDescription>
            Generate story, captions, headlines, video script, and interview questions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school">School</Label>
            <Select value={formData.school_slug} onValueChange={(val) => {
              const school = schools.find(s => s.school_slug === val);
              setFormData({ ...formData, school_slug: val, school_name: school?.school_name || '' });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((s) => (
                  <SelectItem key={s.id} value={s.school_slug}>
                    {s.school_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="activity">Activity Type</Label>
            <Input
              id="activity"
              value={formData.activity_type}
              onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
              placeholder="e.g., sports, arts, classroom"
            />
          </div>
          <div>
            <Label htmlFor="event">Event Name</Label>
            <Input
              id="event"
              value={formData.event_name}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              placeholder="e.g., State Championship"
            />
          </div>
          <div>
            <Label htmlFor="clip">Clip Description</Label>
            <Input
              id="clip"
              value={formData.clip_description}
              onChange={(e) => setFormData({ ...formData, clip_description: e.target.value })}
              placeholder="Describe the video/photo content"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Queue Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GenerateBlogArticleModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: 'streaming-tv',
    industry: '',
    city: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'generateBlogArticle',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify(formData),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Blog article job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setFormData({ service: 'streaming-tv', industry: '', city: '' });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Blog Article</DialogTitle>
          <DialogDescription>
            Create SEO-optimized blog article with video script and metadata
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service">Service</Label>
            <Select value={formData.service} onValueChange={(val) => setFormData({ ...formData, service: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="streaming-tv">Streaming TV Advertising</SelectItem>
                <SelectItem value="local-seo">Local SEO</SelectItem>
                <SelectItem value="ada-rebuild">ADA Website Compliance</SelectItem>
                <SelectItem value="ai-social-media">AI Social Media Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="industry">Industry (Optional)</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., HVAC, plumbing, dentist"
            />
          </div>
          <div>
            <Label htmlFor="city">City (Optional)</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Des Moines"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Article
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AuthorityPlannerModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'authorityPlanner',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify({}),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Authority planner job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Authority Plan</DialogTitle>
          <DialogDescription>
            Create topical authority map with 5 pillars and content queue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            This will generate a new authority map and schedule 7 content queue items.
          </p>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MonthlyReportModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'monthlyReportGenerator',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify({}),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Monthly report job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Monthly Reports</DialogTitle>
          <DialogDescription>
            Create performance reports for all active companies
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            This will generate monthly reports for all active client companies.
          </p>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Reports
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}