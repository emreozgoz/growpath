'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'

export function Step3Time() {
  const {
    durationWeeks,
    hoursPerWeek,
    daysPerWeek,
    setTimeCommitment,
    setCurrentStep,
  } = useOnboardingStore()

  const handleWeeksChange = (weeks: number) => {
    setTimeCommitment(weeks, hoursPerWeek, daysPerWeek)
  }

  const handleHoursChange = (hours: number) => {
    setTimeCommitment(durationWeeks, hours, daysPerWeek)
  }

  const handleDaysChange = (days: number) => {
    setTimeCommitment(durationWeeks, hoursPerWeek, days)
  }

  const handleNext = () => {
    setCurrentStep(4)
  }

  const handleBack = () => {
    setCurrentStep(2)
  }

  const totalHours = durationWeeks * hoursPerWeek

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          How much time can you commit?
        </h2>
        <p className="text-gray-600">
          Be realistic about your schedule. Consistency is more important than intensity.
        </p>
      </div>

      {/* Duration Weeks */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Learning duration: <span className="text-primary-600 font-semibold">{durationWeeks} weeks</span>
        </label>
        <input
          type="range"
          min="1"
          max="52"
          value={durationWeeks}
          onChange={(e) => handleWeeksChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 week</span>
          <span>52 weeks</span>
        </div>
      </div>

      {/* Hours Per Week */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Hours per week: <span className="text-primary-600 font-semibold">{hoursPerWeek} hours</span>
        </label>
        <input
          type="range"
          min="1"
          max="40"
          value={hoursPerWeek}
          onChange={(e) => handleHoursChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 hour</span>
          <span>40 hours</span>
        </div>
      </div>

      {/* Days Per Week */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Days per week: <span className="text-primary-600 font-semibold">{daysPerWeek} days</span>
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={daysPerWeek}
          onChange={(e) => handleDaysChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 day</span>
          <span>7 days</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-6 p-6 bg-primary-50 border border-primary-200 rounded-lg">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">📊 Your Commitment Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-primary-700 font-medium">Total Duration</p>
            <p className="text-2xl font-bold text-primary-600">{durationWeeks} weeks</p>
          </div>
          <div>
            <p className="text-primary-700 font-medium">Total Hours</p>
            <p className="text-2xl font-bold text-primary-600">{totalHours}h</p>
          </div>
          <div>
            <p className="text-primary-700 font-medium">Study Days/Week</p>
            <p className="text-2xl font-bold text-primary-600">{daysPerWeek} days</p>
          </div>
          <div>
            <p className="text-primary-700 font-medium">Avg. Hours/Day</p>
            <p className="text-2xl font-bold text-primary-600">
              {(hoursPerWeek / daysPerWeek).toFixed(1)}h
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
