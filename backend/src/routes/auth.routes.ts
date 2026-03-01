import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/error.middleware'
import { logger } from '../utils/logger'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const SignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res, next) => {
  try {
    // Validate request body
    const validated = SignupSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        name: validated.name,
        tier: 'FREE', // Default tier
      },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        createdAt: true,
      },
    })

    logger.info(`New user registered: ${user.email}`)

    res.status(201).json({
      success: true,
      data: {
        user,
        message: 'Account created successfully',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
      })
    }
    next(error)
  }
})

/**
 * POST /api/v1/auth/login
 * Authenticate user and return user data
 */
router.post('/login', async (req, res, next) => {
  try {
    // Validate request body
    const validated = LoginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401)
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    logger.info(`User logged in: ${user.email}`)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
      })
    }
    next(error)
  }
})

/**
 * GET /api/v1/auth/me
 * Get current user (requires session)
 */
router.get('/me', async (req, res, next) => {
  try {
    // TODO: Extract user ID from session/JWT
    // For now, this is a placeholder
    res.json({
      success: true,
      data: {
        message: 'Session endpoint - to be implemented with NextAuth',
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
