import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/error.middleware'
import { logger } from './utils/logger'
import authRoutes from './routes/auth.routes'

// Load environment variables
dotenv.config({ path: '../.env' })

const app: Application = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // CORS configuration
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'GrowPath API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// Routes
app.use('/api/v1/auth', authRoutes)
// app.use('/api/v1/users', userRoutes)
// app.use('/api/v1/learning-paths', learningPathRoutes)

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 GrowPath API server running on port ${PORT}`)
  logger.info(`📍 Health check: http://localhost:${PORT}/api/v1/health`)
  logger.info(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
