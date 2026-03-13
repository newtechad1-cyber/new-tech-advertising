import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles } from 'lucide-react';

const HIGHLIGHT_TYPES = [
  { value: 'growth_milestone', label: '📈 Growth Milestone' },
  { value: 'revenue_result', label: '💰 Revenue Result' },
  { value: 'content_win', label: '📝 Content Win' },
  { value: 'lead_breakthrough', label: '🎯 Lead Breakthrough' },
  { value: 'efficiency_gain', label: '⚡ Efficiency Gain' },
  { value: 'testimonial', label: '💬 Testimonial' }
];

const VISIBILITY_OPTIONS = [
  { value: 'internal', label: 'Internal Only' },
  { value: 'deal_room', label: 'Deal Room' },
  { value: 'upgrade_panels', label: 'Upgrade Panels' },
  { value: 'all', label: 'Everywhere' }
];

export default function AdminHighlightCreator({ organizationId, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    highlightType: 'growth_milestone',
    industry: '',
    summaryText: '',
    metricReference: '',
    testimonialQuote: '',
    visibility: 'internal',
    taggedForSales: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await base44.entities.SuccessHighlight.create({
        highlightId: `highlight_${Date.now()}`,
        organizationId,
        highlightType: formData.highlightType,
        industry: formData.industry || null,
        summaryText: formData.summaryText,
        metricReference: formData.metricReference,
        testimonialQuote: formData.testimonialQuote || null,
        approvalStatus: 'draft',
        visibility: formData.visibility,
        taggedForSales: formData.taggedForSales,
        createdAt: new Date().toISOString()
      });

      base44.analytics.track({
        eventName: 'admin_highlight_created',
        properties: { type: formData.highlightType, visibility: formData.visibility }
      });

      setFormData({
        highlightType: 'growth_milestone',
        industry: '',
        summaryText: '',
        metricReference: '',
        testimonialQuote: '',
        visibility: 'internal',
        taggedForSales: false
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating highlight:', error);
      alert('Error creating highlight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Success Highlight
      </Button>
    );
  }

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <CardTitle>Create Success Highlight</CardTitle>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Highlight Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Highlight Type
            </label>
            <Select
              value={formData.highlightType}
              onValueChange={(value) =>
                setFormData({ ...formData, highlightType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HIGHLIGHT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Industry (Optional)
            </label>
            <Input
              placeholder="e.g., HVAC, SaaS, Local Services"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Summary (Required)
            </label>
            <Textarea
              placeholder="Short 1-2 sentence win summary (50-150 chars)"
              value={formData.summaryText}
              onChange={(e) =>
                setFormData({ ...formData, summaryText: e.target.value })
              }
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.summaryText.length}/150
            </p>
          </div>

          {/* Metric */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Metric/Result (Optional)
            </label>
            <Input
              placeholder="e.g., 45% growth, 120 new leads, $50K revenue"
              value={formData.metricReference}
              onChange={(e) =>
                setFormData({ ...formData, metricReference: e.target.value })
              }
            />
          </div>

          {/* Testimonial */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Testimonial Quote (Optional)
            </label>
            <Textarea
              placeholder='Client quote: "This has been a game changer..."'
              value={formData.testimonialQuote}
              onChange={(e) =>
                setFormData({ ...formData, testimonialQuote: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Where should this appear?
            </label>
            <Select
              value={formData.visibility}
              onValueChange={(value) =>
                setFormData({ ...formData, visibility: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag for Sales */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="taggedForSales"
              checked={formData.taggedForSales}
              onChange={(e) =>
                setFormData({ ...formData, taggedForSales: e.target.checked })
              }
              className="rounded border-slate-300"
            />
            <label
              htmlFor="taggedForSales"
              className="text-sm font-medium text-slate-700"
            >
              Tag for active sales usage
            </label>
          </div>

          {/* Preview */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Preview
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-900">
                  {HIGHLIGHT_TYPES.find((t) => t.value === formData.highlightType)
                    ?.label?.split(' ')[1] || 'Highlight'}
                </Badge>
                {formData.industry && (
                  <Badge variant="outline">{formData.industry}</Badge>
                )}
              </div>
              <p className="text-sm font-medium text-slate-900">
                {formData.summaryText || 'Summary will appear here'}
              </p>
              {formData.metricReference && (
                <p className="text-sm text-slate-600 font-semibold">
                  {formData.metricReference}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.summaryText || isLoading}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Creating...' : 'Create Highlight'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}