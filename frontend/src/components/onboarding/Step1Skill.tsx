'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const POPULAR_SKILLS = [
  'JavaScript',
  'Python',
  'React',
  'TypeScript',
  'Node.js',
  'Data Science',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing (AWS)',
  'UI/UX Design',
]

export function Step1Skill() {
  const { skill, setSkill, setCurrentStep } = useOnboardingStore()
  const [customSkill, setCustomSkill] = useState(skill || '')

  const handleSelectSkill = (selectedSkill: string) => {
    setSkill(selectedSkill)
    setCustomSkill(selectedSkill)
  }

  const handleNext = () => {
    if (customSkill.trim()) {
      setSkill(customSkill.trim())
      setCurrentStep(2)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          What do you want to learn?
        </h2>
        <p className="text-gray-600">
          Choose a popular skill or enter your own custom skill to get started.
        </p>
      </div>

      {/* Custom Input */}
      <div className="space-y-2">
        <label htmlFor="skill" className="text-sm font-medium text-gray-700">
          Enter your skill
        </label>
        <Input
          id="skill"
          type="text"
          placeholder="e.g., Python, Web Development, Digital Marketing..."
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customSkill.trim()) {
              handleNext()
            }
          }}
        />
      </div>

      {/* Popular Skills */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Or choose a popular skill:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POPULAR_SKILLS.map((popularSkill) => (
            <button
              key={popularSkill}
              onClick={() => handleSelectSkill(popularSkill)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                customSkill === popularSkill
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span className="font-medium text-sm">{popularSkill}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!customSkill.trim()}
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
