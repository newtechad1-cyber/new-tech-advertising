import React from 'react';
import { useParams } from 'react-router-dom';
import ContributorShell from '@/components/school-tv/ContributorShell';

export default function ContributorSubmissions() {
  const { schoolSlug } = useParams();

  return (
    <ContributorShell currentPath={`/school-app/${schoolSlug}/contributor/submissions`}>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Submissions</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">You haven't submitted anything yet. Start sharing your stories!</p>
        </div>
      </div>
    </ContributorShell>
  );
}