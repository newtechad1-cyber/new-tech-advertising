import React from "react";
import { CheckCircle } from "lucide-react";

export default function WizardStep({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${i < currentStep ? "bg-green-500 border-green-500 text-white" :
                i === currentStep ? "bg-blue-600 border-blue-600 text-white" :
                "bg-white border-gray-300 text-gray-400"}`}>
              {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === currentStep ? "text-blue-600" : i < currentStep ? "text-green-600" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}