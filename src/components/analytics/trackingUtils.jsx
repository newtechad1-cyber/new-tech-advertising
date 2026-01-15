import { base44 } from '@/api/base44Client';

// Track conversion events with UTM parameters
export const trackEvent = async (eventName, properties = {}) => {
  try {
    // Get UTM parameters from URL or sessionStorage
    const utmParams = getUTMParams();
    
    // Combine properties with UTM params
    const eventData = {
      ...properties,
      ...utmParams,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      url: window.location.href
    };
    
    // Track with Base44 analytics
    await base44.analytics.track({
      eventName,
      properties: eventData
    });
    
    // Also send to GA4 if available
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    console.log(`[Analytics] Tracked: ${eventName}`, eventData);
  } catch (error) {
    console.error(`[Analytics] Failed to track ${eventName}:`, error);
  }
};

// Get UTM parameters from URL or sessionStorage
export const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  // Check URL first
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'source', 'campaign'].forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
      // Store in sessionStorage for persistence
      sessionStorage.setItem(key, value);
    }
  });
  
  // Fall back to sessionStorage if not in URL
  if (Object.keys(utmParams).length === 0) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'source', 'campaign'].forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value) {
        utmParams[key] = value;
      }
    });
  }
  
  return utmParams;
};

// Save UTM params to lead/client record
export const saveUTMsToRecord = async (entityName, recordId) => {
  try {
    const utmParams = getUTMParams();
    if (Object.keys(utmParams).length > 0) {
      await base44.entities[entityName].update(recordId, {
        utm_data: JSON.stringify(utmParams)
      });
    }
  } catch (error) {
    console.error('[Analytics] Failed to save UTM params:', error);
  }
};

// Track CTA clicks
export const trackCTAClick = (buttonLabel, additionalProps = {}) => {
  trackEvent('cta_click', {
    button_label: buttonLabel,
    ...additionalProps
  });
};

// Track lead submission
export const trackLeadSubmit = (leadData) => {
  trackEvent('lead_submit', {
    business_name: leadData.business_name,
    selected_service: leadData.selectedService
  });
};

// Track onboarding step completion
export const trackOnboardingStep = (stepId, stepName) => {
  trackEvent('onboarding_step_complete', {
    step_id: stepId,
    step_name: stepName
  });
};

// Track onboarding completion
export const trackOnboardingComplete = (profileData) => {
  trackEvent('onboarding_complete', {
    business_name: profileData.business_name,
    industry: profileData.industry,
    goals_count: profileData.marketing_goals?.length || 0
  });
};