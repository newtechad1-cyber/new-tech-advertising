import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Youtube, Music2, Linkedin, Facebook, Mail, BookOpen, Image, Video, CheckCircle2, Loader2 } from 'lucide-react';
import AssetCard from './AssetCard';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700' },
  generating: { label: 'Generating...', color: 'bg-yellow-100 text-yellow-700' },
  complete: { label: 'Complete', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
};

const TYPE_LABELS = {
  authority_pack: 'Authority Pack',
  blog_article: 'Blog Article',
  case_study: 'Case Study',
  service_page: 'Service Page',
  video_script: 'Video Script',
};

export default function ContentAssetDetail({ asset, onBack }) {
  const status = STATUS_CONFIG[asset.status] || STATUS_CONFIG.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge className={status.color}>{status.label}</Badge>
            <Badge variant="outline">{TYPE_LABELS[asset.content_type] || asset.content_type}</Badge>
            {asset.assets_generated > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {asset.assets_generated} assets
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{asset.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Created {new Date(asset.created_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {asset.status === 'generating' && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-600 shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">Generating all assets...</p>
            <p className="text-sm text-yellow-600">This takes 30–60 seconds. Refresh to see results.</p>
          </div>
        </div>
      )}

      {/* Generated Assets Grid */}
      <div className="grid gap-3">
        <AssetCard title="Blog Article" icon={FileText} content={asset.blog_article}
          badgeLabel="1,200–1,500 words" badgeColor="bg-purple-100 text-purple-700" />
        <AssetCard title="YouTube Video Script" icon={Youtube} content={asset.youtube_script}
          badgeLabel="90 seconds" badgeColor="bg-red-100 text-red-700" />
        <AssetCard title="TikTok Scripts (×3)" icon={Music2} content={asset.tiktok_script}
          badgeLabel="15–30 sec each" badgeColor="bg-pink-100 text-pink-700" />
        <AssetCard title="LinkedIn Post" icon={Linkedin} content={asset.linkedin_post}
          badgeLabel="Professional" badgeColor="bg-blue-100 text-blue-700" />
        <AssetCard title="Facebook Posts (×5)" icon={Facebook} content={asset.facebook_posts}
          badgeLabel="With image prompts" badgeColor="bg-indigo-100 text-indigo-700" />
        <AssetCard title="Email Newsletter" icon={Mail} content={asset.email_newsletter}
          badgeLabel="Subject + Story + CTA" badgeColor="bg-teal-100 text-teal-700" />
        <AssetCard title="Lead Magnet Guide" icon={BookOpen} content={asset.lead_magnet_content}
          badgeLabel="Downloadable" badgeColor="bg-amber-100 text-amber-700" />
        <AssetCard title="Image Prompts" icon={Image} content={asset.image_prompts}
          badgeLabel="6 prompts" badgeColor="bg-orange-100 text-orange-700" />
        <AssetCard title="Video Prompts" icon={Video} content={asset.video_prompts}
          badgeLabel="4 platforms" badgeColor="bg-violet-100 text-violet-700" />
      </div>

      {/* Source Content */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Source Content</p>
        <pre className="text-xs text-slate-600 bg-slate-50 border rounded-lg p-4 whitespace-pre-wrap max-h-48 overflow-y-auto font-sans">
          {asset.source_content}
        </pre>
      </div>
    </div>
  );
}