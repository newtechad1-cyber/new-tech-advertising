import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function SocialMediaManagement() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(createPageUrl('AiSocialMedia'));
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Redirecting...</h1>
        <p className="text-slate-500">Taking you to the AI Social Media page.</p>
      </div>
    </div>
  );
}