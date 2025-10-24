"use client";

import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
}

interface StepsIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export function StepsIndicator({ steps }: StepsIndicatorProps) {
  return (
    <div className="w-full">
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${step.status === 'completed' 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.status === 'current'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
                }
              `}>
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  step.status === 'current' ? 'text-blue-600' : 
                  step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-all duration-300
                ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}
              `} />
            )}
          </div>
        ))}
      </div>

      <div className="md:hidden">
        <div className="mb-4">
          {steps.map((step, index) => (
            step.status === 'current' && (
              <div key={step.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">{step.title}</p>
                    <p className="text-xs text-blue-600">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progresso</span>
            <span>{steps.findIndex(s => s.status === 'current') + 1} de {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((steps.findIndex(s => s.status === 'current') + 1) / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center space-x-3 p-2 rounded-lg ${
              step.status === 'current' ? 'bg-blue-50' : 
              step.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${step.status === 'completed' 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.status === 'current'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
                }
              `}>
                {step.status === 'completed' ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'current' ? 'text-blue-600' : 
                  step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}