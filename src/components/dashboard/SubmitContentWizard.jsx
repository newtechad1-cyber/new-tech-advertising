import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { getPackageConfig, checkWeeklyLimit, getWeekStart } from '../config/packageRules';
import { POST_TEMPLATES, getRecommendedRatio } from '../config/contentTemplates';
import { 
  Image, 
  Video, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Lightbulb
} from 'lucide-react';

const SOCIAL_CHANNELS = [
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { id: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
  { id: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-black' }
];

export default function SubmitContentWizard({ onClose, onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    submission_type: '',
    social_channels: [],
    post_text: '',
    media_urls: [],
    scheduling_preference: '',
    preferred_date: ''
  });
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [packageConfig, setPackageConfig] = useState(null);
  const [weeklyLimit, setWeeklyLimit] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadPackageInfo();
  }, []);

  const loadPackageInfo = async () => {
    try {
      const user = await base44.auth.me();
      const config = getPackageConfig(user.subscription_package || 'collaborative');
      setPackageConfig(config);

      // Check weekly submissions
      const weekStart = getWeekStart();
      const submissions = await base44.entities.ContentSubmission.filter({
        created_by: user.email
      });
      
      const thisWeekSubmissions = submissions.filter(s => 
        new Date(s.created_date) >= weekStart
      );
      
      const limitCheck = checkWeeklyLimit(config.id, thisWeekSubmissions.length);
      setWeeklyLimit(limitCheck);

      if (!limitCheck.canSubmit) {
        toast.error(`Weekly limit reached (${limitCheck.limit} posts per week)`);
      }
    } catch (error) {
      console.error('Error loading package info:', error);
    }
  };

  const handleFileUpload = async (files) => {
    setUploadingFiles(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const result = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(result.file_url);
      }
      setFormData({ ...formData, media_urls: [...formData.media_urls, ...uploadedUrls] });
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async () => {
    if (weeklyLimit && !weeklyLimit.canSubmit) {
      toast.error('Weekly submission limit reached. Please try again next week.');
      return;
    }

    setLoading(true);
    try {
      const user = await base44.auth.me();
      const config = getPackageConfig(user.subscription_package || 'collaborative');
      
      const submission = await base44.entities.ContentSubmission.create({
        ...formData,
        status: 'pending',
        upgrade_status: 'none',
        priority: config.priority
      });
      setSubmittedId(submission.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to submit content');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpgrade = async (upgradeType) => {
    try {
      await base44.entities.ContentSubmission.update(submittedId, {
        upgrade_requested: true,
        upgrade_type: upgradeType,
        upgrade_status: 'client_requested'
      });
      toast.success('Upgrade request added! Our team will provide a quote.');
      if (onSubmitSuccess) onSubmitSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to request upgrade');
    }
  };

  const canGoNext = () => {
    if (step === 1) return formData.submission_type;
    if (step === 2) return formData.social_channels.length > 0;
    if (step === 3) return formData.post_text.trim();
    if (step === 4) return formData.media_urls.length > 0 || formData.submission_type === 'text_only';
    if (step === 5) return formData.scheduling_preference;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Submit Content for Scheduling</CardTitle>
              <CardDescription className="mt-2">
                Step {step} of 5 • Collaborative Package
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* SUCCESS VIEW */}
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Content Submitted!</h3>
              <p className="text-slate-600 mb-2">Our team will schedule your post soon.</p>
              
              {/* SLA EXPECTATION */}
              {packageConfig && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Expected Scheduling</span>
                  </div>
                  <p className="text-blue-800 text-sm">{packageConfig.sla}</p>
                  {weeklyLimit && weeklyLimit.remaining !== null && (
                    <p className="text-xs text-blue-700 mt-2">
                      {weeklyLimit.remaining} of {weeklyLimit.limit} submissions remaining this week
                    </p>
                  )}
                </div>
              )}
              
              {/* PASSIVE UPSELL */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Need help improving this post?</h4>
                <p className="text-sm text-slate-600 mb-4">Optional one-time upgrades available:</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => handleRequestUpgrade('rewrite_text')}
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    ✍️ Professional Rewrite - $25
                  </Button>
                  <Button
                    onClick={() => handleRequestUpgrade('edit_image')}
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    🎨 Image Enhancement - $35
                  </Button>
                  <Button
                    onClick={() => handleRequestUpgrade('create_video')}
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    🎬 Create Video Version - $75
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-3">No obligation - our team will confirm pricing</p>
              </div>

              <Button onClick={() => { if (onClose) onClose(); }} className="mr-2">
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* PACKAGE INFO & LIMITS */}
              {packageConfig && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-blue-900">{packageConfig.name}</p>
                      <p className="text-sm text-blue-800">Expected turnaround: {packageConfig.sla}</p>
                    </div>
                    {weeklyLimit && weeklyLimit.remaining !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">{weeklyLimit.remaining}</p>
                        <p className="text-xs text-blue-700">submissions left this week</p>
                      </div>
                    )}
                  </div>
                  {!weeklyLimit?.canSubmit && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                      <p className="text-sm text-red-800 font-medium">
                        ⚠️ Weekly limit reached. Your submission will be queued for next week.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* DISCLAIMER */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1">Important: Collaborative Package Guidelines</p>
                    <p>✓ You provide final text and exact images/video</p>
                    <p>✓ We schedule and post for you</p>
                    <p>✗ No editing, rewriting, or video creation included</p>
                  </div>
                </div>
              </div>

          {/* STEP 1: Submission Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">What type of content are you submitting?</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { value: 'image_post', icon: Image, label: 'Image Post', desc: 'Post with photos' },
                  { value: 'video_post', icon: Video, label: 'Video Post', desc: 'Post with video' },
                  { value: 'text_only', icon: FileText, label: 'Text Only', desc: 'No media' }
                ].map(({ value, icon: Icon, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setFormData({ ...formData, submission_type: value })}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      formData.submission_type === value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${formData.submission_type === value ? 'text-blue-600' : 'text-slate-400'}`} />
                    <h4 className="font-semibold text-slate-900 mb-1">{label}</h4>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Social Channels */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Which platforms should we post to?</h3>
              <div className="space-y-3">
                {SOCIAL_CHANNELS.map(({ id, label, color }) => (
                  <div key={id} className="flex items-center space-x-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-300">
                    <Checkbox
                      checked={formData.social_channels.includes(id)}
                      onCheckedChange={(checked) => {
                        const channels = checked
                          ? [...formData.social_channels, id]
                          : formData.social_channels.filter(c => c !== id);
                        setFormData({ ...formData, social_channels: channels });
                      }}
                    />
                    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {label[0]}
                    </div>
                    <Label className="text-base font-medium cursor-pointer flex-1">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Post Text */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900">Paste your final post text</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  type="button"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  {showTemplates ? 'Hide' : 'Show'} Templates
                </Button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                ⚠️ This text will be posted exactly as written. We do not edit or rewrite content.
              </p>

              {/* OPTIONAL TEMPLATES */}
              {showTemplates && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Choose a template (optional):</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Object.entries(POST_TEMPLATES).map(([key, template]) => (
                      <Button
                        key={key}
                        variant={selectedTemplate === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(key);
                          setFormData({ ...formData, post_text: template.placeholder, template_used: key });
                        }}
                        type="button"
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                  {selectedTemplate && (
                    <div className="bg-white rounded p-3 text-xs text-slate-600">
                      <p className="font-semibold mb-1">Tips:</p>
                      {POST_TEMPLATES[selectedTemplate].tips.map((tip, idx) => (
                        <p key={idx}>• {tip}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Textarea
                value={formData.post_text}
                onChange={(e) => setFormData({ ...formData, post_text: e.target.value })}
                placeholder="Enter your post text here..."
                className="min-h-[200px] text-base"
              />
              <p className="text-xs text-slate-500">
                Character count: {formData.post_text.length}
              </p>
              
              {/* PASSIVE HELP NOTICE */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">
                  💡 <strong>Need help?</strong> Professional rewriting available as an optional add-on after submission.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Upload Media */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload your media files</h3>
              {formData.submission_type !== 'text_only' && (
                <>
                  <p className="text-sm text-slate-600 mb-4">
                    ⚠️ Upload the exact {formData.submission_type === 'video_post' ? 'video' : 'images'} you want posted. We do not edit media files.
                  </p>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <Input
                      type="file"
                      multiple={formData.submission_type === 'image_post'}
                      accept={formData.submission_type === 'video_post' ? 'video/*' : 'image/*'}
                      onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                      disabled={uploadingFiles}
                      className="max-w-xs mx-auto"
                    />
                    {uploadingFiles && (
                      <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </p>
                    )}
                  </div>
                  {formData.media_urls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">Uploaded files: {formData.media_urls.length}</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.media_urls.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url} alt={`Upload ${idx + 1}`} className="w-20 h-20 object-cover rounded border" />
                            <button
                              onClick={() => setFormData({ ...formData, media_urls: formData.media_urls.filter((_, i) => i !== idx) })}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {formData.submission_type === 'text_only' && (
                <p className="text-center text-slate-600 py-8">
                  No media upload needed for text-only posts.
                </p>
              )}
              
              {/* IMAGE FORMAT GUIDANCE */}
              {formData.submission_type === 'image_post' && formData.social_channels.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Recommended image format:</p>
                  <p className="text-xs text-blue-800">
                    {getRecommendedRatio(formData.social_channels)?.label || 'Square (1:1) works best for multiple channels'}
                  </p>
                </div>
              )}

              {/* PASSIVE HELP NOTICE */}
              {formData.submission_type === 'image_post' && formData.media_urls.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-slate-600">
                    💡 <strong>Need help?</strong> Image enhancement & editing available as optional add-ons after submission.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Scheduling Preference */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">When should we schedule this?</h3>
              <RadioGroup value={formData.scheduling_preference} onValueChange={(value) => setFormData({ ...formData, scheduling_preference: value })}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 border-2 border-slate-200 rounded-lg">
                    <RadioGroupItem value="asap" id="asap" />
                    <div className="flex-1">
                      <Label htmlFor="asap" className="font-medium cursor-pointer">As Soon As Possible</Label>
                      <p className="text-sm text-slate-500">We'll schedule this in the next available slot</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border-2 border-slate-200 rounded-lg">
                    <RadioGroupItem value="specific_date" id="specific_date" />
                    <div className="flex-1">
                      <Label htmlFor="specific_date" className="font-medium cursor-pointer">Specific Date/Time</Label>
                      <p className="text-sm text-slate-500 mb-2">Choose when you want this posted</p>
                      {formData.scheduling_preference === 'specific_date' && (
                        <Input
                          type="datetime-local"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border-2 border-slate-200 rounded-lg">
                    <RadioGroupItem value="team_decides" id="team_decides" />
                    <div className="flex-1">
                      <Label htmlFor="team_decides" className="font-medium cursor-pointer">Let Our Team Decide</Label>
                      <p className="text-sm text-slate-500">We'll schedule for optimal engagement</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}
            </>
          )}
        </CardContent>

        {!showSuccess && (
          <div className="border-t p-4 bg-slate-50 flex justify-between">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step > 1 ? 'Back' : 'Cancel'}
            </Button>
            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canGoNext()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext() || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit for Scheduling
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}