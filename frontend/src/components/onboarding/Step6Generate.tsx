'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/Button'

export function Step6Generate() {
  const router = useRouter()
  const {
    skill,
    currentLevel,
    durationWeeks,
    hoursPerWeek,
    daysPerWeek,
    goals,
    isGenerating,
    generatedPath,
    error,
    setIsGenerating,
    setGeneratedPath,
    setError,
    setCurrentStep,
  } = useOnboardingStore()

  useEffect(() => {
    generateLearningPath()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateLearningPath = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Get user from localStorage (temporary - will use NextAuth session)
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('Please log in to continue')
      }

      const user = JSON.parse(userData)

      const response = await fetch('http://localhost:3001/api/v1/learning-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          skill,
          currentLevel,
          durationWeeks,
          hoursPerWeek,
          daysPerWeek,
          goals,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate learning path')
      }

      setGeneratedPath(data.data.learningPath)

      // Redirect to the new learning path after 2 seconds
      setTimeout(() => {
        router.push(`/learning-paths/${data.data.learningPath.id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleRetry = () => {
    generateLearningPath()
  }

  const handleBack = () => {
    setCurrentStep(5)
  }

  if (isGenerating) {
    return (
      <div className="py-12 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
          Creating Your Personalized Learning Path
        </h2>

        <div className="max-w-md mx-auto space-y-4 text-gray-600">
          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
            <div className="animate-pulse text-2xl">🧠</div>
            <p className="text-sm text-left">
              AI is analyzing your skill level and goals...
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
            <div className="animate-pulse text-2xl" style={{ animationDelay: '0.3s' }}>
              📚
            </div>
            <p className="text-sm text-left">
              Curating the best resources and learning materials...
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
            <div className="animate-pulse text-2xl" style={{ animationDelay: '0.6s' }}>
              🗓️
            </div>
            <p className="text-sm text-left">
              Structuring your {durationWeeks}-week study schedule...
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">This usually takes 10-20 seconds...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>

        <div className="flex justify-center gap-3">
          <Button variant="ghost" onClick={handleBack}>
            ← Go Back
          </Button>
          <Button variant="primary" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (generatedPath) {
    return (
      <div className="py-12 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
          🎉 Your Learning Path is Ready!
        </h2>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We've created a personalized {durationWeeks}-week learning plan for {skill}.
          Redirecting you to your path...
        </p>

        <div className="inline-flex items-center gap-2 text-primary-600">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
          <span className="text-sm font-medium">Loading your path...</span>
        </div>
      </div>
    )
  }

  return null
}
