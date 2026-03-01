'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'

const LEVELS = [
  {
    value: 'BEGINNER' as const,
    title: '🌱 Beginner',
    description: "I'm completely new to this skill",
    examples: 'No prior knowledge, starting from scratch',
  },
  {
    value: 'INTERMEDIATE' as const,
    title: '🌿 Intermediate',
    description: 'I have some basic knowledge',
    examples: 'Completed a course, built a small project, or worked on it casually',
  },
  {
    value: 'ADVANCED' as const,
    title: '🌳 Advanced',
    description: 'I have solid experience',
    examples: 'Used professionally, multiple projects, want to master advanced topics',
  },
]

export function Step2Level() {
  const { currentLevel, setCurrentLevel, setCurrentStep } = useOnboardingStore()

  const handleSelectLevel = (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
    setCurrentLevel(level)
  }

  const handleNext = () => {
    if (currentLevel) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          What's your current experience level?
        </h2>
        <p className="text-gray-600">
          This helps us tailor the learning path to your existing knowledge.
        </p>
      </div>

      {/* Level Options */}
      <div className="space-y-4">
        {LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => handleSelectLevel(level.value)}
            className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
              currentLevel === level.value
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100'
                : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {level.title}
                </h3>
                <p className="text-sm text-gray-700 mb-2">{level.description}</p>
                <p className="text-xs text-gray-500 italic">{level.examples}</p>
              </div>
              {currentLevel === level.value && (
                <div className="ml-4">
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!currentLevel}
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
