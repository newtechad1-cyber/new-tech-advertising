import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2 } from 'lucide-react';

export default function OnboardingStart() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      // Preserve UTM parameters and other query strings
      const currentParams = new URLSearchParams(window.location.search);
      const utmParams = {};
      for (const [key, value] of currentParams.entries()) {
        if (key.startsWith('utm_') || key === 'source' || key === 'campaign') {
          utmParams[key] = value;
        }
      }
      const paramString = new URLSearchParams(utmParams).toString();

      // Check if user is authenticated
      const isAuthenticated = await base44.auth.isAuthenticated();
      
      if (!isAuthenticated) {
        // Store intended destination with UTM params
        const intendedDestination = createPageUrl('OnboardingStart') + (paramString ? `?${paramString}` : '');
        sessionStorage.setItem('post_login_redirect', intendedDestination);
        
        // Redirect to login
        base44.auth.redirectToLogin(intendedDestination);
        return;
      }

      // User is authenticated - check onboarding status
      const user = await base44.auth.me();
      const profiles = await base44.entities.ClientProfile.filter({ created_by: user.email });
      
      if (!profiles || profiles.length === 0) {
        // No profile - go to dashboard which will show onboarding
        navigate(createPageUrl('Dashboard') + (paramString ? `?${paramString}` : ''));
        return;
      }

      const profile = profiles[0];
      
      if (profile.onboarding_completed) {
        // Onboarding complete - go to main dashboard with success message
        sessionStorage.setItem('show_onboarding_complete', 'true');
        navigate(createPageUrl('Dashboard') + (paramString ? `?${paramString}` : ''));
        return;
      }

      // Onboarding incomplete - go to dashboard which will show onboarding at the correct step
      navigate(createPageUrl('Dashboard') + (paramString ? `?${paramString}` : ''));
      
    } catch (error) {
      console.error('Error checking auth/onboarding:', error);
      // Fallback - redirect to dashboard
      navigate(createPageUrl('Dashboard'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Setting up your account...</h2>
        <p className="text-slate-600">Please wait while we prepare your dashboard.</p>
      </div>
    </div>
  );
}