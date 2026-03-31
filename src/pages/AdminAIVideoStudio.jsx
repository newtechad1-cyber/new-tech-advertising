import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Play, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';

const ACTIONS = {
  generate_script: { label: 'Generate Script', description: 'Create a promotional video script' },
  generate_slide_ideas: { label: 'Generate Slide Ideas', description: 'Create slide concepts from a script' },
  generate_slide_image: { label: 'Generate Slide Image', description: 'Create background image for a slide' },
  generate_caption: { label: 'Generate Caption', description: 'Create engaging slide captions' },
  generate_overlay_image: { label: 'Generate Overlay Image', description: 'Create branded overlay graphics' },
  get_avatars: { label: 'Load Avatars', description: 'Fetch available HeyGen avatars' },
  get_voices: { label: 'Load Voices', description: 'Fetch available voice options' },
  create_video: { label: 'Create Video', description: 'Render final video with HeyGen' },
  check_status: { label: 'Check Status', description: 'Check rendering progress' },
};

export default function AdminAIVideoStudio() {
  const [step, setStep] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await base44.asServiceRole.entities.AIJobs.filter(
        { function_name: 'aiVideoStudio' },
        '-created_date',
        20
      );
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setFormData({});
    setStep(2);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step === 2) {
      if (!selectedAction) {
        toast.error('Please select an action');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      validateAndProceed();
    }
  };

  const validateAndProceed = () => {
    const action = selectedAction;

    if (action === 'generate_script' && !formData.topic && !formData.prompt) {
      toast.error('Please provide a topic or prompt');
      return;
    }
    if (action === 'generate_slide_ideas' && !formData.script) {
      toast.error('Please provide a script');
      return;
    }
    if (action === 'generate_slide_image' && !formData.prompt) {
      toast.error('Please provide an image prompt');
      return;
    }
    if (action === 'generate_caption' && !formData.slideTitle) {
      toast.error('Please provide slide title');
      return;
    }
    if (action === 'generate_overlay_image' && !formData.slideTitle) {
      toast.error('Please provide slide title');
      return;
    }
    if (action === 'create_video' && !formData.script && !formData.videoType) {
      toast.error('Please provide script and video type');
      return;
    }
    if (action === 'check_status' && !formData.heygenVideoId) {
      toast.error('Please provide HeyGen video ID');
      return;
    }

    setStep(4);
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const inputPayload = { action: selectedAction, ...formData };

      const job = await base44.asServiceRole.entities.AIJobs.create({
        function_name: 'aiVideoStudio',
        status: 'pending',
        trigger_source: 'manual',
        input_data: JSON.stringify(inputPayload),
        triggered_by_email: user.email,
      });

      toast.success(`Video studio job queued: ${job.id.substring(0, 8)}`);
      setStep(5);
      setTimeout(() => {
        loadJobs();
        setStep(1);
        setSelectedAction('');
        setFormData({});
      }, 2000);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const content = (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Video Studio</h1>
        <p className="text-gray-600 mt-2">Create, configure, and render videos with AI-powered tools</p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Wizard */}
          <div className="lg:col-span-2">
            {/* Step 1: Action Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Select Action</CardTitle>
                  <CardDescription>Choose what you want to do with your video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(ACTIONS).map(([key, { label, description }]) => (
                      <button
                        key={key}
                        onClick={() => handleActionSelect(key)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="font-medium text-sm text-gray-900">{label}</div>
                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Action Preview */}
            {step === 2 && selectedAction && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Action Details</CardTitle>
                  <CardDescription>{ACTIONS[selectedAction].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm text-blue-900">
                      <strong>Action:</strong> {ACTIONS[selectedAction].label}
                    </p>
                  </div>
                  <Button onClick={() => setStep(3)} className="w-full">
                    Continue to Configuration <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Configuration */}
            {step === 3 && selectedAction && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Configure</CardTitle>
                  <CardDescription>Provide parameters for {ACTIONS[selectedAction].label}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderActionInputs(selectedAction, formData, handleFormChange)}

                  <div className="flex gap-2 justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext}>
                      Review & Launch <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Review */}
            {step === 4 && selectedAction && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 4: Review Payload</CardTitle>
                  <CardDescription>Confirm your configuration before launching</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-100 rounded-lg font-mono text-xs overflow-auto max-h-64">
                    <pre>{JSON.stringify({ action: selectedAction, ...formData }, null, 2)}</pre>
                  </div>

                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      This will create an AIJobs record and queue the action for processing.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2 justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleLaunch} disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      Launch Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Job Queued Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Your {ACTIONS[selectedAction].label} job has been created and queued for processing.
                  </p>
                  <Button onClick={() => window.location.reload()} className="w-full">
                    Return to Studio
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Recent Jobs */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Latest aiVideoStudio tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : jobs.length === 0 ? (
                  <p className="text-sm text-gray-500">No jobs yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {jobs.map((job) => (
                      <div key={job.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          {job.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          )}
                          {job.status === 'running' && (
                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin mt-0.5 flex-shrink-0" />
                          )}
                          {job.status === 'pending' && (
                            <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          )}
                          {job.status === 'failed' && (
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {job.id.substring(0, 8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(job.created_date).toLocaleDateString()}
                            </div>
                            <div className={`text-xs font-medium mt-1 ${
                              job.status === 'completed' ? 'text-green-700' :
                              job.status === 'running' ? 'text-blue-700' :
                              job.status === 'failed' ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {job.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );

  return <AdminLayout currentPageName="AdminAIVideoStudio">{content}</AdminLayout>;
}

// Render inputs based on selected action
function renderActionInputs(action, formData, handleFormChange) {
  switch (action) {
    case 'generate_script':
      return (
        <>
          <div>
            <Label htmlFor="topic">Topic or Subject</Label>
            <Input
              id="topic"
              value={formData.topic || ''}
              onChange={(e) => handleFormChange('topic', e.target.value)}
              placeholder="e.g., Our new product launch"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="prompt"
              value={formData.prompt || ''}
              onChange={(e) => handleFormChange('prompt', e.target.value)}
              placeholder="Override with a custom prompt"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={formData.duration || '30s'} onValueChange={(val) => handleFormChange('duration', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15s">15 seconds</SelectItem>
                <SelectItem value="30s">30 seconds</SelectItem>
                <SelectItem value="60s">60 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={formData.format || '16:9'} onValueChange={(val) => handleFormChange('format', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    case 'generate_slide_ideas':
      return (
        <>
          <div>
            <Label htmlFor="script">Script</Label>
            <Textarea
              id="script"
              value={formData.script || ''}
              onChange={(e) => handleFormChange('script', e.target.value)}
              placeholder="Paste the video script here"
              className="mt-1 h-32"
            />
          </div>
          <div>
            <Label htmlFor="slideCount">Slide Count</Label>
            <Input
              id="slideCount"
              type="number"
              min="1"
              max="10"
              value={formData.slideCount || 5}
              onChange={(e) => handleFormChange('slideCount', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        </>
      );

    case 'generate_slide_image':
      return (
        <>
          <div>
            <Label htmlFor="imagePrompt">Image Prompt</Label>
            <Textarea
              id="imagePrompt"
              value={formData.prompt || ''}
              onChange={(e) => handleFormChange('prompt', e.target.value)}
              placeholder="Describe the image you want to generate"
              className="mt-1 h-24"
            />
          </div>
        </>
      );

    case 'generate_caption':
      return (
        <>
          <div>
            <Label htmlFor="slideTitle">Slide Title</Label>
            <Input
              id="slideTitle"
              value={formData.slideTitle || ''}
              onChange={(e) => handleFormChange('slideTitle', e.target.value)}
              placeholder="e.g., 'Product Features'"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="slideContent">Slide Content</Label>
            <Textarea
              id="slideContent"
              value={formData.slideContent || ''}
              onChange={(e) => handleFormChange('slideContent', e.target.value)}
              placeholder="Description of the slide"
              className="mt-1 h-24"
            />
          </div>
          <div>
            <Label htmlFor="videoScript">Video Script Context</Label>
            <Textarea
              id="videoScript"
              value={formData.videoScript || ''}
              onChange={(e) => handleFormChange('videoScript', e.target.value)}
              placeholder="Full video script for context"
              className="mt-1 h-24"
            />
          </div>
        </>
      );

    case 'generate_overlay_image':
      return (
        <>
          <div>
            <Label htmlFor="slideTitle">Slide Title</Label>
            <Input
              id="slideTitle"
              value={formData.slideTitle || ''}
              onChange={(e) => handleFormChange('slideTitle', e.target.value)}
              placeholder="e.g., 'Product Features'"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="slideContent">Slide Content</Label>
            <Textarea
              id="slideContent"
              value={formData.slideContent || ''}
              onChange={(e) => handleFormChange('slideContent', e.target.value)}
              placeholder="Description of the slide"
              className="mt-1 h-24"
            />
          </div>
          <div>
            <Label htmlFor="videoScript">Video Script Context</Label>
            <Textarea
              id="videoScript"
              value={formData.videoScript || ''}
              onChange={(e) => handleFormChange('videoScript', e.target.value)}
              placeholder="Full video script for context"
              className="mt-1 h-24"
            />
          </div>
        </>
      );

    case 'get_avatars':
      return (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            This action will fetch all available HeyGen avatars and store them in the job output.
          </AlertDescription>
        </Alert>
      );

    case 'get_voices':
      return (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            This action will fetch all available HeyGen voices and store them in the job output.
          </AlertDescription>
        </Alert>
      );

    case 'create_video':
      return (
        <>
          <div>
            <Label htmlFor="videoType">Video Type</Label>
            <Select value={formData.videoType || 'avatar'} onValueChange={(val) => handleFormChange('videoType', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avatar">Avatar Only</SelectItem>
                <SelectItem value="slides">Slides Only</SelectItem>
                <SelectItem value="avatar-slides">Avatar with Slides</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="script">Script</Label>
            <Textarea
              id="script"
              value={formData.script || ''}
              onChange={(e) => handleFormChange('script', e.target.value)}
              placeholder="Video script (voiceover text)"
              className="mt-1 h-24"
            />
          </div>
          <div>
            <Label htmlFor="voiceId">Voice ID</Label>
            <Input
              id="voiceId"
              value={formData.voiceId || ''}
              onChange={(e) => handleFormChange('voiceId', e.target.value)}
              placeholder="HeyGen voice ID (from get_voices)"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="Video title for records"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={formData.format || '16:9'} onValueChange={(val) => handleFormChange('format', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="enableCaptions">Enable Auto-Captions</Label>
            <Select value={formData.enableCaptions ? 'true' : 'false'} onValueChange={(val) => handleFormChange('enableCaptions', val === 'true')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    case 'check_status':
      return (
        <>
          <div>
            <Label htmlFor="heygenVideoId">HeyGen Video ID</Label>
            <Input
              id="heygenVideoId"
              value={formData.heygenVideoId || ''}
              onChange={(e) => handleFormChange('heygenVideoId', e.target.value)}
              placeholder="Video ID to check"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="recordId">Record ID (Optional)</Label>
            <Input
              id="recordId"
              value={formData.recordId || ''}
              onChange={(e) => handleFormChange('recordId', e.target.value)}
              placeholder="VideoRequests record ID to update"
              className="mt-1"
            />
          </div>
        </>
      );

    default:
      return null;
  }
}