import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Package, CheckCircle2 } from 'lucide-react';

export function NoCaptionsEmptyState({ onGenerate }) {
  return (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
        <Zap className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">No Captions Yet</h3>
        <p className="text-sm text-slate-600 mt-1">Generate AI captions to make your video accessible and boost engagement.</p>
      </div>
      <Button onClick={onGenerate} className="bg-blue-600 hover:bg-blue-700 gap-2">
        <Zap className="w-4 h-4" />
        Generate Captions
      </Button>
    </div>
  );
}

export function NoBrandingEmptyState({ onStart }) {
  return (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
        <Package className="w-8 h-8 text-purple-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">No Branding Yet</h3>
        <p className="text-sm text-slate-600 mt-1">Add your brand assets, colors, and logos to create a polished final video.</p>
      </div>
      <Button onClick={onStart} className="bg-purple-600 hover:bg-purple-700 gap-2">
        <Package className="w-4 h-4" />
        Add Branding
      </Button>
    </div>
  );
}

export function NoRenderEmptyState({ onRender }) {
  return (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
        <Zap className="w-8 h-8 text-amber-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">No Render Yet</h3>
        <p className="text-sm text-slate-600 mt-1">Create a final branded render with captions and overlay applied.</p>
      </div>
      <Button onClick={onRender} className="bg-amber-600 hover:bg-amber-700 gap-2">
        <Zap className="w-4 h-4" />
        Create Render
      </Button>
    </div>
  );
}

export function NoPublishJobsEmptyState() {
  return (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">No Publishing Jobs Yet</h3>
        <p className="text-sm text-slate-600 mt-1">Approve the video and select destinations to start publishing.</p>
      </div>
    </div>
  );
}

export function SuccessPublishedState({ publishedCount, destinations }) {
  return (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">Published Successfully!</h3>
        <p className="text-sm text-slate-600 mt-1">
          Your video is now live on {publishedCount} channel{publishedCount !== 1 ? 's' : ''}.
        </p>
        {destinations && (
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {destinations.map(dest => (
              <span key={dest} className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-xs font-medium text-green-700">
                ✓ {dest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}