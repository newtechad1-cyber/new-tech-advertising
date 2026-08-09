import React from 'react';
import { useParams } from 'react-router-dom';
import ContributorShell from '@/components/school-tv/ContributorShell';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Upload } from 'lucide-react';

export default function ContributorHub() {
  const { schoolSlug } = useParams();

  return (
    <ContributorShell currentPath={`/school-app/${schoolSlug}/contributor`}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Ready to share your story?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <Upload className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">New Submission</h3>
            <p className="text-gray-600 text-sm mt-2">Upload videos and photos</p>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <Eye className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">My Submissions</h3>
            <p className="text-gray-600 text-sm mt-2">View and manage uploads</p>
            <Button variant="outline" className="w-full mt-4">
              View All
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-gray-900">AI Story Lab</h3>
            <p className="text-gray-600 text-sm mt-2">Write with AI assistance</p>
            <Button variant="outline" className="w-full mt-4">
              Explore
            </Button>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Submissions</h2>
          <p className="text-gray-600">No submissions yet. Start by uploading your first story!</p>
        </div>
      </div>
    </ContributorShell>
  );
}