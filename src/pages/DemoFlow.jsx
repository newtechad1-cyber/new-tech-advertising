import React, { useState } from 'react';
import DemoFlowStep from '@/components/demo/DemoFlowStep.jsx';
import DemoNarrativeContent from '@/components/demo/DemoNarrativeContent.jsx';
import DemoScreenShowcase from '@/components/demo/DemoScreenShowcase.jsx';

const stepConfig = {
  1: {
    title: 'The Problem',
    subtitle: 'Start with their pain',
    showScreens: false
  },
  2: {
    title: 'The Vision',
    subtitle: 'Paint the outcome first',
    showScreens: false
  },
  3: {
    title: 'The System',
    subtitle: 'How it all connects',
    showScreens: false
  },
  4: {
    title: 'The Platform',
    subtitle: 'Guided walkthrough — 5 key screens',
    showScreens: true,
    screenIndex: 1
  },
  5: {
    title: 'The Results',
    subtitle: 'Real client timeline and outcomes',
    showScreens: false
  },
  6: {
    title: 'The Opportunity',
    subtitle: 'Scale beyond the base system',
    showScreens: false
  },
  7: {
    title: 'The Next Step',
    subtitle: 'Clear decision path forward',
    showScreens: false
  }
};

export default function DemoFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [screenIndex, setScreenIndex] = useState(1);

  const config = stepConfig[currentStep];

  const handleNext = () => {
    if (currentStep === 4 && screenIndex < 5) {
      setScreenIndex(screenIndex + 1);
    } else if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      setScreenIndex(1);
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && screenIndex > 1) {
      setScreenIndex(screenIndex - 1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setScreenIndex(1);
    }
  };

  const nextLabel = currentStep === 4 && screenIndex < 5 ? `Next Screen (${screenIndex}/5)` : currentStep === 7 ? 'Book Demo' : 'Next';
  const showBack = currentStep > 1 || (currentStep === 4 && screenIndex > 1);
  const showNext = currentStep < 7 || (currentStep === 4 && screenIndex < 5);

  return (
    <DemoFlowStep
      step={currentStep}
      title={config.title}
      subtitle={config.subtitle}
      onNext={handleNext}
      onBack={handleBack}
      showBack={showBack}
      showNext={showNext}
      nextLabel={nextLabel}
    >
      {config.showScreens ? (
        <>
          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    idx <= screenIndex ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-slate-400">Screen {screenIndex} of 5</p>
          </div>
          <DemoScreenShowcase screenIndex={screenIndex} />
        </>
      ) : (
        <DemoNarrativeContent step={currentStep} />
      )}
    </DemoFlowStep>
  );
}