import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function SchoolSubmit() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/submit`}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Submit Your Story</h1>
        <p className="text-gray-600 mb-8">Share videos, photos, and stories from your school experience</p>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
            <p className="text-gray-600 text-sm mb-6">PNG, JPG, MP4 • Max 100MB</p>
            <Button>Choose Files</Button>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Give your submission a title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <textarea className="w-full px-4 py-2 border border-gray-200 rounded-lg" rows={4} placeholder="Tell us about your submission" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="consent" />
              <label htmlFor="consent" className="text-sm text-gray-600">I consent to share this content</label>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit</Button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}