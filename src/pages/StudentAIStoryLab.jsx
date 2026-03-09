import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Upload,
  Lightbulb,
  BookOpen,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function StudentAIStoryLab() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: '',
    event_name: '',
    clip_description: '',
    student_description: '',
    tags: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/functions/generateSchoolStoryContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: 'Hampton-Dumont Schools',
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()),
        }),
      });

      if (response.ok) {
        setStep(3);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Story Lab</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Use AI to help write headlines, stories, captions, and scripts from your event photos or videos.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step Indicator */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  s <= step ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              ></div>
              <p className="text-center text-sm mt-2 font-semibold text-gray-700">
                {s === 1 ? 'Upload' : s === 2 ? 'Generate' : 'Review'}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1: Upload & Describe */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Upload className="h-6 w-6 text-purple-600" />
              Describe Your Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Activity Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  What activity are you capturing?
                </label>
                <Input
                  placeholder="e.g., robotics competition, football game, choir concert"
                  value={formData.activity_type}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_type: e.target.value })
                  }
                  required
                />
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event name
                </label>
                <Input
                  placeholder="e.g., Regional Robotics Competition Build Day"
                  value={formData.event_name}
                  onChange={(e) =>
                    setFormData({ ...formData, event_name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Media Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  What's happening in your photos/video?
                </label>
                <textarea
                  placeholder="Describe what you recorded (e.g., students assembling robot, testing wheels, solving problems together)"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  rows="3"
                  value={formData.clip_description}
                  onChange={(e) =>
                    setFormData({ ...formData, clip_description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Student Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your thoughts or notes about this moment
                </label>
                <textarea
                  placeholder="What was important about this? How did it make you feel? What did you learn?"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  rows="3"
                  value={formData.student_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      student_description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  placeholder="e.g., robotics, STEM, engineering, teamwork"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              {/* Safety Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">School-Safe Content</p>
                  <p>
                    All content will be reviewed by teachers before publication. Make sure your
                    submission is appropriate for your school community.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Story Content
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating your content...</h2>
            <p className="text-gray-600">
              Our AI is creating headlines, stories, captions, and scripts based on your
              descriptions.
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex gap-3">
              <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 mb-2">Content Generated!</p>
                <p className="text-green-800 text-sm">
                  Your AI-generated content is ready. Review it below, make any edits you'd like,
                  then submit for teacher approval.
                </p>
              </div>
            </div>

            {/* Results Tabs */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Story', icon: '📝', content: 'Your generated news article' },
                { title: 'Captions', icon: '📸', content: '3 photo caption options' },
                { title: 'Video Script', icon: '🎬', content: 'Voiceover narration script' },
                { title: 'Headlines', icon: '📰', content: '5 headline options' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <Button variant="outline" className="w-full text-blue-600">
                    View & Edit
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Start Over
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Submit for Teacher Approval
              </Button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Tips for Better AI Results
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>✓ Be specific about what's happening in your media</li>
            <li>✓ Include details about how students are participating</li>
            <li>✓ Mention the learning or achievement that's taking place</li>
            <li>✓ Add relevant tags to help organize content</li>
            <li>✓ Remember that teachers will review everything before publication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}