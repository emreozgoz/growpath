'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Step1Skill } from '@/components/onboarding/Step1Skill'
import { Step2Level } from '@/components/onboarding/Step2Level'
import { Step3Time } from '@/components/onboarding/Step3Time'
import { Step4Goals } from '@/components/onboarding/Step4Goals'
import { Step5Review } from '@/components/onboarding/Step5Review'
import { Step6Generate } from '@/components/onboarding/Step6Generate'

const STEPS = [
  { number: 1, title: 'Choose Skill', component: Step1Skill },
  { number: 2, title: 'Experience Level', component: Step2Level },
  { number: 3, title: 'Time Commitment', component: Step3Time },
  { number: 4, title: 'Set Goals', component: Step4Goals },
  { number: 5, title: 'Review', component: Step5Review },
  { number: 6, title: 'Generate Path', component: Step6Generate },
]

export default function OnboardingPage() {
  const currentStep = useOnboardingStore((state) => state.currentStep)

  const CurrentStepComponent = STEPS.find((s) => s.number === currentStep)?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🌱</div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Create Your Learning Path
              </h1>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.number < currentStep
                        ? 'bg-primary-500 text-white'
                        : step.number === currentStep
                        ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.number < currentStep ? '✓' : step.number}
                  </div>
                  <div
                    className={`mt-2 text-xs font-medium text-center ${
                      step.number === currentStep ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-1 mx-2">
                    <div
                      className={`h-full rounded transition-all ${
                        step.number < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {CurrentStepComponent && <CurrentStepComponent />}
        </div>
      </div>
    </div>
  )
}
