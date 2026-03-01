'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

interface User {
  id: string
  email: string
  name?: string
  tier: string
}

interface LearningPath {
  id: string
  skill: string
  currentLevel: string
  durationWeeks: number
  status: string
  createdAt: string
  aiModel: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [isLoadingPaths, setIsLoadingPaths] = useState(true)

  useEffect(() => {
    // Check if user is logged in (temporary - will use NextAuth session)
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchLearningPaths(parsedUser.id)
  }, [router])

  const fetchLearningPaths = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/learning-paths?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setLearningPaths(data.data.paths || [])
      }
    } catch (err) {
      console.error('Failed to fetch learning paths:', err)
    } finally {
      setIsLoadingPaths(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span aria-hidden="true" className="text-2xl">🌱</span>
              <h1 className="text-xl font-heading font-semibold text-gray-900">
                GrowPath
              </h1>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Welcome back, {user.name || 'there'}! 👋
          </h2>
          <p className="mt-2 text-gray-600">
            You're on the <span className="font-semibold text-primary-600">{user.tier}</span> plan
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle><span aria-hidden="true">🎯</span> Learning Paths</CardTitle>
              <CardDescription>Your active learning journeys</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPaths ? (
                <div className="text-center py-8" role="status" aria-label="Loading learning paths">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading paths...</p>
                </div>
              ) : learningPaths.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No learning paths yet</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push('/onboarding')}
                  >
                    Create Your First Path
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {learningPaths.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => router.push(`/learning-paths/${path.id}`)}
                      className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{path.skill}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {path.currentLevel} • {path.durationWeeks} weeks
                          </p>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              path.status === 'ACTIVE'
                                ? 'bg-primary-100 text-primary-700'
                                : path.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {path.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => router.push('/onboarding')}
                  >
                    + Create New Path
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span aria-hidden="true">📊</span> Progress</CardTitle>
              <CardDescription>Your learning statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">0</p>
                    <p className="text-sm text-gray-600">Tasks Done</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">0</p>
                    <p className="text-sm text-gray-600">Days Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span aria-hidden="true">🚀</span> Quick Actions</CardTitle>
              <CardDescription>Get started quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => router.push('/onboarding')}
                >
                  📝 Start Onboarding
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  ⚙️ Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  💎 Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <span aria-hidden="true" className="text-3xl">🎉</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-900 mb-1">
                Welcome to GrowPath!
              </h3>
              <p className="text-primary-700 mb-3">
                Start your personalized learning journey today. Our AI will create a custom study plan tailored to your goals and schedule.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/onboarding')}
              >
                Create Your Learning Path →
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
