import React from 'react';
import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#36343a] -translate-y-1/2 z-0" />
        
        {/* Active progress line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#6750a4] to-[#2D8CFF] -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center group">
              <button
                type="button"
                disabled={!isCompleted && !isCurrent}
                onClick={() => onStepClick && isCompleted && onStepClick(stepNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#2D8CFF] text-slate-950 shadow-md shadow-[#2D8CFF]/30 cursor-pointer'
                    : isCurrent
                    ? 'bg-[#6750a4] text-white ring-4 ring-[#6750a4]/30 shadow-lg shadow-[#6750a4]/40'
                    : 'bg-[#211f24] text-[#948e9c] border border-[#494551]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : stepNum}
              </button>
              <div className="mt-2 text-center">
                <span
                  className={`text-xs font-medium block whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#cfbcff] font-semibold'
                      : isCompleted
                      ? 'text-[#e6e0e9]'
                      : 'text-[#948e9c]'
                  }`}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="text-[10px] text-[#948e9c] hidden sm:block">
                    {step.subtitle}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
