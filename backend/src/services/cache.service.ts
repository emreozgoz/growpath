import Redis from 'ioredis'
import { logger } from '../utils/logger'

class CacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
    })

    this.redis.on('connect', () => {
      logger.info('✅ Redis connected successfully')
    })

    this.redis.on('error', (err) => {
      logger.error('Redis connection error:', err)
    })
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key)
      return value
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value)
      } else {
        await this.redis.set(key, value)
      }
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error)
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      logger.error(`Cache DEL error for key ${key}:`, error)
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      logger.error(`Cache DEL pattern error for ${pattern}:`, error)
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      logger.error(`Cache EXISTS error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Increment counter (for rate limiting)
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key)
    } catch (error) {
      logger.error(`Cache INCR error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redis.expire(key, seconds)
    } catch (error) {
      logger.error(`Cache EXPIRE error for key ${key}:`, error)
    }
  }

  /**
   * Get remaining TTL
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key)
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error)
      return -1
    }
  }

  /**
   * Flush all cache (use with caution!)
   */
  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall()
      logger.warn('⚠️  Redis cache flushed')
    } catch (error) {
      logger.error('Cache FLUSHALL error:', error)
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    await this.redis.quit()
    logger.info('Redis disconnected')
  }
}

export const cacheService = new CacheService()
