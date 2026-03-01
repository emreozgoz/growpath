# 🏗️ GrowPath - System Architecture

**Version**: 1.0
**Last Updated**: 2026-03-01
**Architect**: Dr. Rajesh Krishnan (Distinguished Engineer)

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Component Design](#component-design)
4. [Data Architecture](#data-architecture)
5. [API Design](#api-design)
6. [Security Architecture](#security-architecture)
7. [Performance & Scalability](#performance--scalability)
8. [Infrastructure](#infrastructure)
9. [Monitoring & Observability](#monitoring--observability)

---

## System Overview

### Vision
GrowPath is an AI-powered SaaS platform that generates personalized learning paths. The system is designed for:
- **Scalability**: Handle 100K+ users with <200ms API response time
- **Reliability**: 99.9% uptime SLA (43 min downtime/month)
- **Cost Efficiency**: AI cost <15% of revenue through caching & optimization
- **Developer Experience**: Type-safe, maintainable, well-documented codebase

### Key Quality Attributes
- **Performance**: P95 latency <500ms for AI generation, <200ms for cached responses
- **Availability**: Multi-region deployment capability, automated failover
- **Security**: SOC2 Type II compliant, GDPR ready
- **Maintainability**: Modular architecture, comprehensive testing (>80% coverage)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile App  │  │   API SDK    │          │
│  │  (Next.js)   │  │  (Future)    │  │  (Future)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │       CDN / Edge Network (Vercel)       │
          │     • Static assets caching             │
          │     • Edge functions (geolocation)      │
          └──────────────────┬──────────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │         APPLICATION LAYER                │
          │  ┌────────────────────────────────┐     │
          │  │   Next.js App (Vercel)         │     │
          │  │   • App Router (RSC)           │     │
          │  │   • API Routes                 │     │
          │  │   • Server Actions             │     │
          │  └───────┬────────────────┬───────┘     │
          │          │                │             │
          │  ┌───────▼──────┐  ┌──────▼────────┐   │
          │  │  Auth Service│  │  Express API  │   │
          │  │ (NextAuth.js)│  │   (Node.js)   │   │
          │  └───────┬──────┘  └──────┬────────┘   │
          └──────────┼─────────────────┼────────────┘
                     │                 │
          ┌──────────▼─────────────────▼────────────┐
          │         SERVICE LAYER                    │
          │  ┌──────────┐  ┌───────────┐           │
          │  │ AI Service│  │User Service│          │
          │  │ (OpenAI) │  │           │           │
          │  └─────┬────┘  └─────┬─────┘           │
          │        │             │                  │
          │  ┌─────▼─────┐  ┌────▼──────┐          │
          │  │Payment Svc│  │Email Svc  │          │
          │  │ (Stripe)  │  │ (Resend)  │          │
          │  └───────────┘  └───────────┘          │
          └──────────┬──────────────────────────────┘
                     │
          ┌──────────▼──────────────────────────────┐
          │          DATA LAYER                      │
          │  ┌──────────────┐  ┌─────────────┐     │
          │  │  PostgreSQL  │  │   Redis     │     │
          │  │  (Supabase)  │  │  (Upstash)  │     │
          │  │  • User data │  │  • Sessions │     │
          │  │  • Paths     │  │  • AI cache │     │
          │  │  • Progress  │  │  • Rate lmt │     │
          │  └──────────────┘  └─────────────┘     │
          └─────────────────────────────────────────┘
                     │
          ┌──────────▼──────────────────────────────┐
          │      EXTERNAL SERVICES                   │
          │  • OpenAI API (GPT-3.5 / GPT-4)         │
          │  • Stripe (Payments & Subscriptions)    │
          │  • Resend (Transactional emails)        │
          │  • Sentry (Error tracking)              │
          │  • Vercel Analytics (Performance)       │
          └─────────────────────────────────────────┘
```

---

## Component Design

### Frontend Architecture (Next.js 14)

#### App Router Structure
```
app/
├── (auth)/              # Auth route group
│   ├── login/
│   ├── signup/
│   └── layout.tsx       # Auth layout (minimal UI)
├── (dashboard)/         # Dashboard route group
│   ├── dashboard/
│   ├── paths/
│   ├── progress/
│   ├── settings/
│   └── layout.tsx       # Dashboard layout (sidebar, nav)
├── (marketing)/         # Marketing pages
│   ├── page.tsx         # Landing page
│   ├── pricing/
│   └── about/
├── onboarding/          # 6-step stepper
│   └── page.tsx
└── api/                 # API routes
    ├── auth/
    ├── webhooks/
    └── cron/
```

#### Component Library Structure
```
components/
├── ui/                  # Radix UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dialog.tsx
│   └── ...
├── features/            # Feature-specific components
│   ├── onboarding/
│   │   ├── StepperNav.tsx
│   │   ├── SkillSelector.tsx
│   │   ├── LevelSelector.tsx
│   │   └── ...
│   ├── dashboard/
│   ├── learning-path/
│   └── progress/
└── layout/              # Layout components
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

#### State Management Strategy

**Server State (React Query)**
- API data fetching & caching
- Automatic background refetching
- Optimistic updates
- Mutation management

```typescript
// Example: Learning paths query
const { data: paths, isLoading } = useQuery({
  queryKey: ['learning-paths', userId],
  queryFn: () => api.learningPaths.list(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

**Client State (Zustand)**
- UI state (modals, sidebars)
- User preferences
- Onboarding flow state

```typescript
// Example: Onboarding store
interface OnboardingStore {
  currentStep: number;
  formData: OnboardingData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingData>) => void;
}
```

### Backend Architecture (Express.js)

#### Service Layer Pattern
```
backend/src/
├── routes/              # Express routes (thin controllers)
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── learning-path.routes.ts
│   └── webhook.routes.ts
├── services/            # Business logic
│   ├── ai.service.ts
│   ├── user.service.ts
│   ├── payment.service.ts
│   └── email.service.ts
├── repositories/        # Data access layer
│   ├── user.repository.ts
│   └── learning-path.repository.ts
├── utils/
│   ├── cache.util.ts
│   ├── validation.util.ts
│   └── errors.util.ts
└── middleware/
    ├── auth.middleware.ts
    ├── rate-limit.middleware.ts
    └── error.middleware.ts
```

#### AI Service Architecture
```typescript
class AIService {
  private openai: OpenAI;
  private cache: RedisCache;

  async generateLearningPath(
    input: LearningPathInput,
    userTier: UserTier
  ): Promise<LearningPath> {
    // 1. Check cache (40% hit rate expected)
    const cacheKey = this.generateCacheKey(input);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // 2. Determine AI model based on tier
    const model = userTier === 'free' ? 'gpt-3.5-turbo' : 'gpt-4-turbo';

    // 3. Construct optimized prompt
    const prompt = this.buildPrompt(input);

    // 4. Call OpenAI API with retry logic
    const response = await this.callOpenAIWithRetry({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: userTier === 'free' ? 2000 : 4000,
      response_format: { type: 'json_object' }
    });

    // 5. Parse & validate response
    const plan = this.validateAndParsePlan(response);

    // 6. Cache result (24h TTL)
    await this.cache.set(cacheKey, plan, 86400);

    // 7. Track usage metrics
    await this.trackUsage(input.userId, model, response.usage);

    return plan;
  }
}
```

---

## Data Architecture

### Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'unlimited')),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);

-- Learning paths table
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(100) NOT NULL,
  current_level VARCHAR(20) NOT NULL CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
  target_level VARCHAR(20),
  duration_weeks INTEGER NOT NULL,
  hours_per_week INTEGER NOT NULL,
  days_per_week INTEGER NOT NULL,
  goals TEXT[],
  ai_model VARCHAR(20) NOT NULL,
  plan_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);
CREATE INDEX idx_learning_paths_created_at ON learning_paths(created_at DESC);

-- Learning progress table
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  task_id VARCHAR(100) NOT NULL,
  task_title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(learning_path_id, week, day, task_id)
);

CREATE INDEX idx_learning_progress_path_id ON learning_progress(learning_path_id);
CREATE INDEX idx_learning_progress_completed ON learning_progress(completed);

-- AI usage tracking
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  model VARCHAR(50) NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  cache_hit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at DESC);

-- Subscriptions table (Stripe integration)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Redis Cache Structure

**Key Patterns:**
```
# Session storage
session:{sessionId} -> JSON (TTL: 7 days)

# AI response cache
ai:path:{hash(input)} -> JSON (TTL: 24 hours)

# User tier cache
user:tier:{userId} -> string (TTL: 1 hour)

# Rate limiting
ratelimit:ai:{userId}:{date} -> counter (TTL: 24 hours)
ratelimit:api:{ip}:{endpoint} -> counter (TTL: 1 hour)

# Analytics cache
analytics:paths:{userId} -> JSON (TTL: 5 minutes)
```

---

## API Design

### RESTful API Endpoints

**Authentication**
```
POST   /api/auth/signup              # Create new user
POST   /api/auth/login               # Login
POST   /api/auth/logout              # Logout
GET    /api/auth/session             # Get current session
POST   /api/auth/forgot-password     # Password reset
```

**Users**
```
GET    /api/users/me                 # Get current user
PATCH  /api/users/me                 # Update profile
DELETE /api/users/me                 # Delete account
```

**Learning Paths**
```
GET    /api/learning-paths           # List user's paths
POST   /api/learning-paths           # Generate new path (AI)
GET    /api/learning-paths/:id       # Get path details
PATCH  /api/learning-paths/:id       # Update path
DELETE /api/learning-paths/:id       # Delete path
```

**Progress**
```
GET    /api/learning-paths/:id/progress     # Get progress
POST   /api/learning-paths/:id/progress     # Mark task complete
PATCH  /api/progress/:id                    # Update progress item
```

**Subscriptions**
```
GET    /api/subscriptions            # Get user subscription
POST   /api/subscriptions            # Create subscription
PATCH  /api/subscriptions/cancel     # Cancel subscription
```

**Webhooks**
```
POST   /api/webhooks/stripe          # Stripe events
```

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "skill": "Python",
    "weeks": 8
  },
  "meta": {
    "timestamp": "2026-03-01T10:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "duration_weeks",
        "message": "Must be between 1 and 52"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-01T10:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## Security Architecture

### Authentication & Authorization

**NextAuth.js Configuration**
- Email/Password (bcrypt hashing, 12 rounds)
- OAuth providers (Google, GitHub - future)
- JWT session tokens (secure, httpOnly cookies)
- CSRF protection

**Authorization Levels**
```typescript
enum Permission {
  // Free tier
  CREATE_PATH_LIMITED = 'create:path:limited',
  VIEW_OWN_PATHS = 'view:own:paths',

  // Paid tiers
  CREATE_PATH_UNLIMITED = 'create:path:unlimited',
  EXPORT_PATHS = 'export:paths',

  // Admin
  MANAGE_USERS = 'manage:users',
  VIEW_ANALYTICS = 'view:analytics'
}
```

### Data Protection

**Encryption**
- At rest: PostgreSQL encryption (AES-256)
- In transit: TLS 1.3 (all connections)
- Secrets: Environment variables (Vercel secrets)
- PII: Email hashing for analytics

**Input Validation**
- Zod schemas (type-safe validation)
- SQL injection prevention (Prisma ORM)
- XSS protection (React auto-escaping)
- Rate limiting (Redis-based)

---

## Performance & Scalability

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load (LCP) | <2.5s | TBD |
| API Response (P95) | <500ms | TBD |
| AI Generation (cached) | <200ms | TBD |
| AI Generation (uncached) | <5s | TBD |
| Database Query (P95) | <100ms | TBD |

### Caching Strategy

**Multi-Level Cache**
```
Request → CDN Cache (static assets)
        → Redis Cache (AI responses, sessions)
        → PostgreSQL (source of truth)
```

**Cache Invalidation**
- Time-based (TTL)
- Event-based (user updates → invalidate tier cache)
- Manual purge (admin panel)

### Scalability Considerations

**Horizontal Scaling**
- Stateless API servers (scale on Vercel/Railway)
- Redis cluster (future: Redis Cluster mode)
- PostgreSQL read replicas (future: for analytics queries)

**Database Optimization**
- Indexes on foreign keys & frequent queries
- Partitioning (future: partition ai_usage by month)
- Connection pooling (PgBouncer)

---

## Infrastructure

### Deployment Architecture

**Production Environment**
```
Frontend: Vercel (Edge Network + Serverless Functions)
Backend API: Railway / Render (Docker containers)
Database: Supabase (Managed PostgreSQL + Backups)
Cache: Upstash Redis (Serverless)
CDN: Vercel Edge Network
```

**Development Environment**
```
Frontend: Local (Next.js dev server)
Backend: Local (Node.js + nodemon)
Database: Docker (PostgreSQL container)
Cache: Docker (Redis container)
```

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
on: [push, pull_request]

jobs:
  test:
    - Lint (ESLint, Prettier)
    - Type check (TypeScript)
    - Unit tests (Vitest)
    - Integration tests

  build:
    - Build frontend (Next.js)
    - Build backend (TypeScript)

  deploy:
    - Deploy to staging (on PR)
    - Deploy to production (on main merge)
    - Run smoke tests
    - Notify team (Slack)
```

---

## Monitoring & Observability

### Error Tracking
- **Sentry**: Frontend & backend error tracking
- **Error boundaries**: React error boundaries
- **Logging**: Structured logging (Winston/Pino)

### Performance Monitoring
- **Vercel Analytics**: Core Web Vitals
- **Lighthouse CI**: Automated performance audits
- **API monitoring**: Response times, error rates

### Business Metrics
- **Plausible/PostHog**: Privacy-friendly analytics
- **Custom dashboard**: User signups, path generations, revenue

### Alerting
- **Sentry alerts**: Error rate spikes
- **Uptime monitoring**: UptimeRobot (99.9% SLA)
- **Slack notifications**: Deployment status, critical errors

---

## Appendix

### Technology Decisions (ADRs)

**ADR-001: Next.js App Router**
- **Decision**: Use Next.js 14 App Router
- **Rationale**: React Server Components, improved performance, better DX
- **Alternatives**: Pages Router, Remix
- **Status**: Accepted

**ADR-002: PostgreSQL over NoSQL**
- **Decision**: Use PostgreSQL as primary database
- **Rationale**: ACID compliance, relational data, mature ecosystem
- **Alternatives**: MongoDB, DynamoDB
- **Status**: Accepted

**ADR-003: Redis for Caching**
- **Decision**: Use Redis for AI response caching
- **Rationale**: Fast, simple, 40% cost reduction expected
- **Alternatives**: In-memory cache, CDN caching only
- **Status**: Accepted

---

**Document maintained by**: Infrastructure & Engineering Team
**Next review**: After Sprint 1 completion
