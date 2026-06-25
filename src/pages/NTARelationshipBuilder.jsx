import React, { useEffect } from 'react';
import NextStepEngine from '@/components/recommendations/NextStepEngine';
import { addCompletedModule } from '@/lib/journeyMemory';

export default function NTARelationshipBuilder() {
  
  useEffect(() => {
    addCompletedModule('relationship_builder');
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NTA Relationship Builder™</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Discover simple systems for managing referrals and reviews. This module helps you transform local connections into sustainable digital growth.
        </p>
        <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-300 italic">This module is currently in development.</p>
        </div>
      </div>
      <NextStepEngine />
    </div>
  );
}