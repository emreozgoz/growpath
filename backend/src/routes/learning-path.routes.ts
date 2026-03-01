import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/error.middleware'
import { logger } from '../utils/logger'
import { aiService } from '../services/ai.service'

const router = Router()
const prisma = new PrismaClient()

// Validation schema for creating learning path
const CreateLearningPathSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  skill: z.string().min(1, 'Skill is required').max(100, 'Skill too long'),
  currentLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    errorMap: () => ({ message: 'Invalid skill level' }),
  }),
  durationWeeks: z.number().int().min(1).max(52, 'Duration must be 1-52 weeks'),
  hoursPerWeek: z.number().min(1).max(40, 'Hours per week must be 1-40'),
  daysPerWeek: z.number().int().min(1).max(7, 'Days per week must be 1-7'),
  goals: z.array(z.string()).min(1, 'At least one goal required').max(5, 'Maximum 5 goals'),
})

/**
 * POST /api/v1/learning-paths
 * Generate a new AI-powered learning path
 */
router.post('/', async (req, res, next) => {
  try {
    // Validate request body
    const validated = CreateLearningPathSchema.parse(req.body)

    logger.info(`Generating learning path for user ${validated.userId}`)

    // Check user exists and get their tier
    const user = await prisma.user.findUnique({
      where: { id: validated.userId },
      select: { id: true, tier: true },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Check rate limits based on tier
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const pathsCreatedToday = await prisma.learningPath.count({
      where: {
        userId: validated.userId,
        createdAt: {
          gte: today,
        },
      },
    })

    const rateLimits = {
      FREE: 3,
      STARTER: 10,
      PRO: 30,
      UNLIMITED: 999999,
    }

    const limit = rateLimits[user.tier as keyof typeof rateLimits]
    if (pathsCreatedToday >= limit) {
      throw new AppError(
        `Daily limit reached. ${user.tier} tier allows ${limit} paths per day.`,
        429
      )
    }

    // Generate learning path with AI
    const aiInput = {
      userId: validated.userId,
      skill: validated.skill,
      currentLevel: validated.currentLevel,
      durationWeeks: validated.durationWeeks,
      hoursPerWeek: validated.hoursPerWeek,
      daysPerWeek: validated.daysPerWeek,
      goals: validated.goals,
    }

    const generatedPlan = await aiService.generateLearningPath(aiInput, user.tier)

    // Create learning path in database with transaction
    const learningPath = await prisma.$transaction(async (tx) => {
      // Create the learning path
      const path = await tx.learningPath.create({
        data: {
          userId: validated.userId,
          skill: validated.skill,
          currentLevel: validated.currentLevel,
          durationWeeks: validated.durationWeeks,
          hoursPerWeek: validated.hoursPerWeek,
          daysPerWeek: validated.daysPerWeek,
          goals: validated.goals,
          aiModel: user.tier === 'FREE' ? 'gpt-3.5-turbo' : 'gpt-4-turbo',
          planData: generatedPlan as any, // JSONB field
          status: 'ACTIVE',
        },
      })

      // Initialize progress tracking for all tasks
      const progressRecords = []
      for (const week of generatedPlan.weeks) {
        for (const day of week.days) {
          for (const task of day.tasks) {
            progressRecords.push({
              learningPathId: path.id,
              week: week.weekNumber,
              day: day.dayNumber,
              taskId: task.id,
              taskTitle: task.title,
              completed: false,
            })
          }
        }
      }

      // Bulk insert progress records
      if (progressRecords.length > 0) {
        await tx.learningProgress.createMany({
          data: progressRecords,
        })
      }

      return path
    })

    logger.info(`Learning path created successfully: ${learningPath.id}`)

    res.status(201).json({
      success: true,
      data: {
        learningPath: {
          id: learningPath.id,
          skill: learningPath.skill,
          currentLevel: learningPath.currentLevel,
          durationWeeks: learningPath.durationWeeks,
          status: learningPath.status,
          createdAt: learningPath.createdAt,
          plan: generatedPlan,
        },
      },
      meta: {
        aiModel: learningPath.aiModel,
        totalTasks: (generatedPlan.weeks || []).reduce(
          (total, week) =>
            total +
            (week.days || []).reduce((dayTotal, day) => dayTotal + (day.tasks || []).length, 0),
          0
        ),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
      })
      return
    }
    next(error)
  }
})

/**
 * GET /api/v1/learning-paths
 * Get all learning paths for a user
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId as string

    if (!userId) {
      throw new AppError('userId query parameter required', 400)
    }

    const paths = await prisma.learningPath.findMany({
      where: { userId },
      select: {
        id: true,
        skill: true,
        currentLevel: true,
        durationWeeks: true,
        status: true,
        createdAt: true,
        aiModel: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: { paths },
      meta: { count: paths.length },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/v1/learning-paths/:id
 * Get a specific learning path with full details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const path = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        progress: {
          orderBy: [{ week: 'asc' }, { day: 'asc' }],
        },
      },
    })

    if (!path) {
      throw new AppError('Learning path not found', 404)
    }

    // Calculate progress percentage
    const totalTasks = path.progress.length
    const completedTasks = path.progress.filter((p) => p.completed).length
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    res.json({
      success: true,
      data: {
        learningPath: {
          id: path.id,
          skill: path.skill,
          currentLevel: path.currentLevel,
          durationWeeks: path.durationWeeks,
          hoursPerWeek: path.hoursPerWeek,
          daysPerWeek: path.daysPerWeek,
          goals: path.goals,
          status: path.status,
          aiModel: path.aiModel,
          plan: path.planData,
          createdAt: path.createdAt,
        },
        progress: {
          totalTasks,
          completedTasks,
          percentage: progressPercentage,
          tasks: path.progress,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/v1/learning-paths/:id/progress
 * Update task completion status
 */
router.put('/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params
    const { taskId, completed, week, day } = req.body

    if (!taskId || typeof completed !== 'boolean') {
      throw new AppError('taskId and completed status required', 400)
    }

    // Find the progress record
    const progressRecord = await prisma.learningProgress.findFirst({
      where: {
        learningPathId: id,
        taskId,
      },
    })

    if (!progressRecord) {
      throw new AppError('Progress record not found', 404)
    }

    // Update progress
    const updated = await prisma.learningProgress.update({
      where: { id: progressRecord.id },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    // Get updated progress summary
    const allProgress = await prisma.learningProgress.findMany({
      where: { learningPathId: id },
    })

    const totalTasks = allProgress.length
    const completedTasks = allProgress.filter((p) => p.completed).length
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Update learning path status if completed
    if (percentage === 100) {
      await prisma.learningPath.update({
        where: { id },
        data: { status: 'COMPLETED' },
      })
    }

    logger.info(`Progress updated: ${id} - Task ${taskId} - ${completed ? 'completed' : 'uncompleted'}`)

    res.json({
      success: true,
      data: {
        progress: updated,
        summary: {
          totalTasks,
          completedTasks,
          percentage,
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
