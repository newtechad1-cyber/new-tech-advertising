import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolAbout() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/about`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About {schoolSlug}</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              This is the story of our school—a place where students, faculty, and staff create memories and achieve greatness together.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We're committed to celebrating every moment, amplifying student voices, and preserving memories through digital storytelling.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-700">Questions? Reach out to us at contact@school.edu</p>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}