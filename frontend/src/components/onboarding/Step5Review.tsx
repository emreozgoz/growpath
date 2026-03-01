'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'

const LEVEL_DISPLAY = {
  BEGINNER: '🌱 Beginner',
  INTERMEDIATE: '🌿 Intermediate',
  ADVANCED: '🌳 Advanced',
}

export function Step5Review() {
  const {
    skill,
    currentLevel,
    durationWeeks,
    hoursPerWeek,
    daysPerWeek,
    goals,
    setCurrentStep,
  } = useOnboardingStore()

  const handleNext = () => {
    setCurrentStep(6)
  }

  const handleBack = () => {
    setCurrentStep(4)
  }

  const handleEdit = (step: number) => {
    setCurrentStep(step)
  }

  const totalHours = durationWeeks * hoursPerWeek

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Review Your Learning Plan
        </h2>
        <p className="text-gray-600">
          Take a moment to review everything. You can go back and edit any step.
        </p>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {/* Skill */}
        <div className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Skill
              </p>
              <p className="text-xl font-semibold text-gray-900">{skill}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(1)}>
              Edit
            </Button>
          </div>
        </div>

        {/* Level */}
        <div className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Experience Level
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {LEVEL_DISPLAY[currentLevel as keyof typeof LEVEL_DISPLAY]}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(2)}>
              Edit
            </Button>
          </div>
        </div>

        {/* Time Commitment */}
        <div className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Time Commitment
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(3)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-primary-600">{durationWeeks}w</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours/Week</p>
              <p className="text-2xl font-bold text-primary-600">{hoursPerWeek}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days/Week</p>
              <p className="text-2xl font-bold text-primary-600">{daysPerWeek}d</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-primary-600">{totalHours}h</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="p-5 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Learning Goals ({goals.length})
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(4)}>
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <span
                key={goal}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✨</div>
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Ready to Generate Your Personalized Learning Path?
            </h3>
            <p className="text-sm text-primary-700 mb-3">
              Our AI will create a customized {durationWeeks}-week learning plan tailored to your{' '}
              {currentLevel.toLowerCase()} level in {skill}. You'll get daily tasks, resources, and
              milestones to achieve your goals.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">This takes about 10-20 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleNext} size="lg">
          Generate My Learning Path 🚀
        </Button>
      </div>
    </div>
  )
}
