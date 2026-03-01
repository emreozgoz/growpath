'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface Task {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  type: 'reading' | 'practice' | 'project' | 'video' | 'quiz'
}

interface Day {
  dayNumber: number
  tasks: Task[]
}

interface Week {
  weekNumber: number
  title: string
  description: string
  days: Day[]
}

interface LearningPathPlan {
  skill: string
  weeks: Week[]
  estimatedCompletionDate: string
}

interface ProgressTask {
  id: string
  week: number
  day: number
  taskId: string
  taskTitle: string
  completed: boolean
}

interface LearningPath {
  id: string
  skill: string
  currentLevel: string
  durationWeeks: number
  hoursPerWeek: number
  daysPerWeek: number
  goals: string[]
  status: string
  aiModel: string
  plan: LearningPathPlan
  createdAt: string
}

interface Progress {
  totalTasks: number
  completedTasks: number
  percentage: number
  tasks: ProgressTask[]
}

const TASK_TYPE_ICONS = {
  reading: '📖',
  practice: '💻',
  project: '🚀',
  video: '🎥',
  quiz: '✅',
}

export default function LearningPathDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    if (!id) return
    fetchLearningPath()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchLearningPath = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/learning-paths/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load learning path')
      }

      setLearningPath(data.data.learningPath)
      setProgress(data.data.progress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskToggle = async (taskId: string, week: number, day: number, currentStatus: boolean) => {
    try {
      // Optimistic update
      if (progress) {
        const updatedTasks = progress.tasks.map((t) =>
          t.taskId === taskId ? { ...t, completed: !currentStatus } : t
        )
        const completedCount = updatedTasks.filter((t) => t.completed).length
        setProgress({
          ...progress,
          tasks: updatedTasks,
          completedTasks: completedCount,
          percentage: Math.round((completedCount / progress.totalTasks) * 100),
        })
      }

      // Call API to update progress
      const response = await fetch(`http://localhost:3001/api/v1/learning-paths/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !currentStatus, week, day }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to update progress')
      }

      // Update with server response
      if (progress && data.data.summary) {
        setProgress({
          ...progress,
          completedTasks: data.data.summary.completedTasks,
          percentage: data.data.summary.percentage,
        })
      }
    } catch (err) {
      // Rollback on error
      fetchLearningPath()
    }
  }

  const isTaskCompleted = (taskId: string): boolean => {
    return progress?.tasks.find((t) => t.taskId === taskId)?.completed || false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    )
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Path Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The learning path you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/dashboard')}>← Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const currentWeekData = learningPath.plan.weeks.find((w) => w.weekNumber === currentWeek)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">
                  {learningPath.skill} Learning Path
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {learningPath.currentLevel} • {learningPath.durationWeeks} weeks • {learningPath.aiModel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>📊 Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Overall Progress</span>
                    <span className="font-bold text-primary-600">{progress?.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress?.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary-600">{progress?.completedTasks}</p>
                    <p className="text-sm text-gray-600 mt-1">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-3xl font-bold text-gray-600">
                      {progress ? progress.totalTasks - progress.completedTasks : 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary-600">{learningPath.durationWeeks}</p>
                    <p className="text-sm text-gray-600 mt-1">Weeks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {learningPath.plan.weeks.map((week) => (
              <button
                key={week.weekNumber}
                onClick={() => setCurrentWeek(week.weekNumber)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  currentWeek === week.weekNumber
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                Week {week.weekNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Current Week Content */}
        {currentWeekData && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                {currentWeekData.title}
              </h2>
              <p className="text-gray-600">{currentWeekData.description}</p>
            </div>

            {/* Days */}
            {currentWeekData.days.map((day) => (
              <Card key={day.dayNumber}>
                <CardHeader>
                  <CardTitle>Day {day.dayNumber}</CardTitle>
                  <CardDescription>
                    {day.tasks.length} tasks • ~
                    {day.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.tasks.map((task) => {
                      const completed = isTaskCompleted(task.id)
                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                            completed
                              ? 'bg-primary-50 border-primary-200'
                              : 'bg-white border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <button
                            onClick={() =>
                              handleTaskToggle(task.id, currentWeek, day.dayNumber, completed)
                            }
                            className={`mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              completed
                                ? 'bg-primary-500 border-primary-500'
                                : 'border-gray-300 hover:border-primary-400'
                            }`}
                          >
                            {completed && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{TASK_TYPE_ICONS[task.type]}</span>
                              <h4
                                className={`font-semibold ${
                                  completed ? 'text-primary-700 line-through' : 'text-gray-900'
                                }`}
                              >
                                {task.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {task.estimatedMinutes} min
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">
                                {task.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
