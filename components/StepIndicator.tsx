
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
      "Project Idea",
      "Audience & Problem",
      "Core Features",
      "Platform",
      "Results"
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <button
                onClick={() => onStepClick(stepNumber)}
                disabled={!isCompleted}
                className={`flex flex-col items-center text-center w-24 group disabled:cursor-not-allowed`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                    ${isCompleted ? 'bg-blue-600 text-white group-hover:bg-blue-500' : ''}
                    ${isActive ? 'bg-blue-500 text-white ring-4 ring-blue-500/50' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-700 text-gray-400' : ''}`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : stepNumber}
                </div>
                <p className={`mt-2 text-xs sm:text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-400'} ${isCompleted ? 'group-hover:text-blue-400' : ''}`}>
                  {label}
                </p>
              </button>
              {stepNumber < totalSteps && (
                <div className={`flex-1 h-1 transition-all duration-500 mx-2 rounded
                  ${isCompleted ? 'bg-blue-600' : 'bg-gray-700'}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
