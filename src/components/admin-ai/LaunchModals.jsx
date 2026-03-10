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

export function SchoolVideoScriptModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    if (open) {
      base44.asServiceRole.entities.SchoolVideoProjects.list().then((data) => {
        const readyProjects = data.filter(p => ['collecting_assets', 'ready_for_ai'].includes(p.status));
        setProjects(readyProjects);
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'schoolVideoScriptGeneration',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify({ project_id: selectedProjectId }),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Video script job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setSelectedProjectId('');
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
          <DialogTitle>Generate Video Script</DialogTitle>
          <DialogDescription>
            Generate script from selected project clips
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project">Project</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project with clips" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Script
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GenerateContentFromTopicModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');

  useEffect(() => {
    if (open) {
      base44.asServiceRole.entities.ContentTopics.filter({ status: 'pending' }).then((data) => {
        setTopics(data);
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopicId) {
      toast.error('Please select a topic');
      return;
    }

    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'generateContentFromTopic',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify({ topic_id: selectedTopicId }),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Content generation job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setSelectedTopicId('');
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
          <DialogTitle>Generate Content from Topic</DialogTitle>
          <DialogDescription>
            Generate blog, landing page, video script, social series, and emails
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
              <SelectTrigger>
                <SelectValue placeholder="Select topic to process" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title} {t.industry && `(${t.industry})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdaSalesAssistantModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    lead_id: '',
    task_type: '',
    context: '',
  });

  useEffect(() => {
    if (open) {
      base44.asServiceRole.entities.AdaLead.filter({}, '-created_date', 50).then((data) => {
        setLeads(data);
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lead_id || !formData.task_type) {
      toast.error('Please select lead and task type');
      return;
    }

    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'adaSalesAssistant',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify(formData),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Sales assistant job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setFormData({ lead_id: '', task_type: '', context: '' });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sales Assistant Analysis</DialogTitle>
          <DialogDescription>
            Generate follow-ups, analysis, or intelligence for a lead
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lead">Lead</Label>
            <Select value={formData.lead_id} onValueChange={(val) => setFormData({ ...formData, lead_id: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.full_name} — {l.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="task">Task Type</Label>
            <Select value={formData.task_type} onValueChange={(val) => setFormData({ ...formData, task_type: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft_email">Draft Email Follow-up</SelectItem>
                <SelectItem value="analyze_lead">Analyze Lead & Upsell Opportunities</SelectItem>
                <SelectItem value="answer_question">Answer Sales Question</SelectItem>
                <SelectItem value="crm_intelligence">Generate CRM Intelligence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Input
              id="context"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              placeholder="e.g., recent conversation details"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Run Analysis
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateAIContentJobModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    submission_id: '',
    school_slug: '',
    job_type: '',
  });

  useEffect(() => {
    if (open) {
      Promise.all([
        base44.asServiceRole.entities.StudentVideoSubmissions.filter({ status: 'approved' }, '-created_date', 50),
        base44.asServiceRole.entities.SchoolBranding.list(),
      ]).then(([subs, schoolData]) => {
        setSubmissions(subs);
        setSchools(schoolData);
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submission_id || !formData.school_slug || !formData.job_type) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'createAIContentJob',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify({
          submissionId: formData.submission_id,
          schoolSlug: formData.school_slug,
          jobType: formData.job_type,
        }),
        triggered_by_email: (await base44.auth.me()).email,
      });

      toast.success(`Content job queued: ${job.id.substring(0, 8)}`);
      setOpen(false);
      setFormData({ submission_id: '', school_slug: '', job_type: '' });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create AI Content Job</DialogTitle>
          <DialogDescription>
            Queue AI generation for student submission
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school">School</Label>
            <Select value={formData.school_slug} onValueChange={(val) => setFormData({ ...formData, school_slug: val })}>
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
            <Label htmlFor="submission">Submission</Label>
            <Select value={formData.submission_id} onValueChange={(val) => setFormData({ ...formData, submission_id: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select submission" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.submission_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="jobtype">Job Type</Label>
            <Select value={formData.job_type} onValueChange={(val) => setFormData({ ...formData, job_type: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story_generation">Generate Story</SelectItem>
                <SelectItem value="video_script">Generate Video Script</SelectItem>
                <SelectItem value="caption_generation">Generate Captions</SelectItem>
                <SelectItem value="event_recap">Generate Event Recap</SelectItem>
                <SelectItem value="yearbook_generation">Generate Yearbook Blurb</SelectItem>
                <SelectItem value="spotlight_summary">Generate Spotlight Summary</SelectItem>
              </SelectContent>
            </Select>
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