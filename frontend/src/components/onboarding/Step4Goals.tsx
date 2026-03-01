'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const SUGGESTED_GOALS = [
  'Build a portfolio project',
  'Get a job in this field',
  'Switch careers',
  'Freelance opportunities',
  'Improve current skills',
  'Personal development',
  'Start a side project',
  'Contribute to open source',
]

export function Step4Goals() {
  const { goals, setGoals, setCurrentStep } = useOnboardingStore()
  const [customGoal, setCustomGoal] = useState('')

  const handleToggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal))
    } else {
      if (goals.length < 5) {
        setGoals([...goals, goal])
      }
    }
  }

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && goals.length < 5 && !goals.includes(customGoal.trim())) {
      setGoals([...goals, customGoal.trim()])
      setCustomGoal('')
    }
  }

  const handleRemoveGoal = (goal: string) => {
    setGoals(goals.filter((g) => g !== goal))
  }

  const handleNext = () => {
    if (goals.length > 0) {
      setCurrentStep(5)
    }
  }

  const handleBack = () => {
    setCurrentStep(3)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          What are your learning goals?
        </h2>
        <p className="text-gray-600">
          Select up to 5 goals. This helps us create a path aligned with your objectives.
        </p>
      </div>

      {/* Selected Goals */}
      {goals.length > 0 && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm font-medium text-primary-900 mb-2">
            Selected goals ({goals.length}/5):
          </p>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <span
                key={goal}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500 text-white rounded-full text-sm"
              >
                {goal}
                <button
                  onClick={() => handleRemoveGoal(goal)}
                  className="hover:bg-primary-600 rounded-full p-0.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Goals */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Suggested goals:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUGGESTED_GOALS.map((goal) => {
            const isSelected = goals.includes(goal)
            const isDisabled = goals.length >= 5 && !isSelected
            return (
              <button
                key={goal}
                onClick={() => handleToggleGoal(goal)}
                disabled={isDisabled}
                className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <span className="font-medium">{goal}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Goal Input */}
      {goals.length < 5 && (
        <div className="space-y-2">
          <label htmlFor="customGoal" className="text-sm font-medium text-gray-700">
            Or add your own goal:
          </label>
          <div className="flex gap-2">
            <Input
              id="customGoal"
              type="text"
              placeholder="Enter your custom goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomGoal()
                }
              }}
            />
            <Button
              variant="outline"
              onClick={handleAddCustomGoal}
              disabled={!customGoal.trim() || goals.includes(customGoal.trim())}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={goals.length === 0}
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
