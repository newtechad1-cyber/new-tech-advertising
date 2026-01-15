// Single source of truth for onboarding steps
export const ONBOARDING_STEPS = [
  {
    id: 1,
    name: 'Business Info',
    requiredFields: ['business_name'],
    completionFlag: 'step1_completed'
  },
  {
    id: 2,
    name: 'Marketing Goals',
    requiredFields: ['marketing_goals'],
    completionFlag: 'step2_completed'
  },
  {
    id: 3,
    name: 'Setup Checklist',
    requiredFields: [],
    completionFlag: 'onboarding_completed'
  }
];

export const getNextIncompleteStep = (profile) => {
  if (!profile) return 1;
  
  for (const step of ONBOARDING_STEPS) {
    if (!profile[step.completionFlag]) {
      return step.id;
    }
  }
  
  return null; // All steps complete
};

export const isStepAccessible = (stepId, profile) => {
  if (stepId === 1) return true;
  
  // Check if all previous steps are complete
  for (let i = 0; i < stepId - 1; i++) {
    const prevStep = ONBOARDING_STEPS[i];
    if (!profile?.[prevStep.completionFlag]) {
      return false;
    }
  }
  
  return true;
};

export const validateStepData = (stepId, formData) => {
  const step = ONBOARDING_STEPS.find(s => s.id === stepId);
  if (!step) return { isValid: true, missingFields: [] };
  
  const missingFields = step.requiredFields.filter(field => {
    const value = formData[field];
    return !value || (Array.isArray(value) && value.length === 0);
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};