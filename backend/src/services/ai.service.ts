import OpenAI from 'openai'
import { createHash } from 'crypto'
import { cacheService } from './cache.service'
import { logger } from '../utils/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface LearningPathInput {
  userId: string
  skill: string
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationWeeks: number
  hoursPerWeek: number
  daysPerWeek: number
  goals: string[]
}

export interface LearningPathOutput {
  skill: string
  weeks: Week[]
  estimatedCompletionDate: string
}

interface Week {
  weekNumber: number
  title: string
  description: string
  days: Day[]
}

interface Day {
  dayNumber: number
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  type: 'reading' | 'practice' | 'project' | 'video' | 'quiz'
}

class AIService {
  /**
   * Generate a cache key from learning path input
   */
  private generateCacheKey(input: Omit<LearningPathInput, 'userId'>): string {
    const data = JSON.stringify({
      skill: input.skill.toLowerCase(),
      level: input.currentLevel,
      duration: input.durationWeeks,
      hours: input.hoursPerWeek,
      days: input.daysPerWeek,
      goals: input.goals.sort(),
    })
    return `ai:path:${createHash('sha256').update(data).digest('hex')}`
  }

  /**
   * Determine AI model based on user tier
   */
  private getModelForTier(userTier: string): string {
    return userTier === 'FREE' ? 'gpt-3.5-turbo' : 'gpt-4-turbo'
  }

  /**
   * Build optimized prompt for AI
   */
  private buildPrompt(input: LearningPathInput): string {
    return `Create a personalized ${input.durationWeeks}-week learning plan for ${input.skill}.

Student Profile:
- Current Level: ${input.currentLevel}
- Weekly Commitment: ${input.hoursPerWeek} hours across ${input.daysPerWeek} days
- Goals: ${input.goals.join(', ')}

Requirements:
1. Break down into ${input.durationWeeks} weeks with clear weekly objectives
2. Distribute tasks across ${input.daysPerWeek} days per week
3. Each day should have ${Math.round((input.hoursPerWeek / input.daysPerWeek) * 60)} minutes of content
4. Include variety: readings, practice exercises, projects, videos, quizzes
5. Progress from fundamentals to advanced topics
6. Align with stated goals

Output JSON format:
{
  "skill": "string",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week title",
      "description": "What will be learned",
      "days": [
        {
          "dayNumber": 1,
          "tasks": [
            {
              "id": "unique-id",
              "title": "Task title",
              "description": "What to do",
              "estimatedMinutes": 30,
              "type": "reading|practice|project|video|quiz"
            }
          ]
        }
      ]
    }
  ],
  "estimatedCompletionDate": "YYYY-MM-DD"
}`
  }

  /**
   * Generate a personalized learning path
   */
  async generateLearningPath(
    input: LearningPathInput,
    userTier: string = 'FREE'
  ): Promise<LearningPathOutput> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(input)
      const cached = await cacheService.get(cacheKey)

      if (cached) {
        logger.info(`Cache hit for learning path: ${cacheKey}`)
        return JSON.parse(cached)
      }

      logger.info(`Generating learning path for ${input.skill} (${userTier})`)

      // Determine model and token limits
      const model = this.getModelForTier(userTier)
      const maxTokens = userTier === 'FREE' ? 2000 : 4000

      // Build prompt
      const systemPrompt = `You are an expert education curriculum designer. Create structured, practical learning paths that help students achieve their goals efficiently.`
      const userPrompt = this.buildPrompt(input)

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0].message.content
      if (!content) {
        throw new Error('No content received from OpenAI')
      }

      const learningPath: LearningPathOutput = JSON.parse(content)

      // Cache the result (24 hours TTL)
      await cacheService.set(cacheKey, JSON.stringify(learningPath), 86400)

      // Track usage (in production, save to database)
      logger.info({
        message: 'AI usage',
        userId: input.userId,
        model,
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      })

      return learningPath
    } catch (error) {
      logger.error('Error generating learning path', error)
      throw error
    }
  }
}

export const aiService = new AIService()
