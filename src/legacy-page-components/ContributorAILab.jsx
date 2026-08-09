import React from 'react';
import { useParams } from 'react-router-dom';
import ContributorShell from '@/components/school-tv/ContributorShell';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function ContributorAILab() {
  const { schoolSlug } = useParams();

  return (
    <ContributorShell currentPath={`/school-app/${schoolSlug}/ai-lab`}>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Story Lab</h1>
        <p className="text-gray-600 mb-8">Write your story with AI assistance</p>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900">Create with AI</h2>
            <p className="text-gray-600 mt-2">Get writing suggestions powered by AI</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Writing a Story
            </Button>
            <p className="text-center text-sm text-gray-600">
              All AI-generated content requires staff review before publication
            </p>
          </div>
        </div>
      </div>
    </ContributorShell>
  );
}