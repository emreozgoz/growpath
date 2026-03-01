# 🚀 Sprint 1: Foundation - Planning Document

**Sprint Duration**: 2 weeks (Week 1-2)
**Sprint Goal**: Establish solid technical foundation with authentication, database, and core infrastructure

---

## 📊 Sprint Overview

### Sprint Objectives
1. ✅ Project setup & configuration complete
2. ✅ Authentication system functional (login, signup, session management)
3. ✅ Database schema implemented & migrated
4. ✅ Design system & UI component library established
5. ✅ OpenAI API integration working with caching

### Team Capacity
- **Total Story Points**: 45
- **Team Velocity Target**: 40-45 points (first sprint, establishing baseline)
- **Sprint Duration**: 10 working days

---

## 🎯 User Stories & Tasks

### Epic 1: Project Foundation (13 points)

#### Story 1.1: Initialize Frontend Project (5 points)
**As a** developer
**I want** a properly configured Next.js 14 project
**So that** we can start building features with best practices

**Acceptance Criteria:**
- [ ] Next.js 14 initialized with App Router
- [ ] TypeScript configured (strict mode)
- [ ] Tailwind CSS 3.4 configured with green theme (#10B981)
- [ ] ESLint + Prettier setup
- [ ] Folder structure created (app/, components/, lib/)
- [ ] Basic layout components (Header, Footer)

**Tasks:**
- [ ] Run `npx create-next-app@latest` with TypeScript
- [ ] Configure `tailwind.config.js` with custom green palette
- [ ] Set up `eslint.config.js` with React rules
- [ ] Create folder structure
- [ ] Add Inter, Poppins, Fira Code fonts
- [ ] Create basic layout components

**Definition of Done:**
- Dev server runs without errors
- All linting passes
- Basic page renders with green theme

---

#### Story 1.2: Initialize Backend Project (5 points)
**As a** developer
**I want** a properly configured Express.js backend
**So that** we can build scalable APIs

**Acceptance Criteria:**
- [ ] Node.js project with TypeScript
- [ ] Express.js server running
- [ ] Prisma ORM configured
- [ ] Environment variable management (.env)
- [ ] Basic error handling middleware
- [ ] API versioning (/api/v1)

**Tasks:**
- [ ] Initialize `npm init` + TypeScript
- [ ] Install Express, Prisma, dotenv
- [ ] Create `src/` folder structure
- [ ] Configure Prisma schema
- [ ] Add error handling middleware
- [ ] Create health check endpoint (`/api/v1/health`)

**Definition of Done:**
- Server runs on port 3001
- Health check returns 200 OK
- TypeScript compiles without errors

---

#### Story 1.3: Database Setup (3 points)
**As a** developer
**I want** PostgreSQL database configured locally
**So that** we can persist user data

**Acceptance Criteria:**
- [ ] PostgreSQL running (Docker Compose)
- [ ] Prisma schema defined (users, learning_paths, progress, ai_usage)
- [ ] Initial migration created
- [ ] Database seeded with test data

**Tasks:**
- [ ] Create `docker-compose.yml` for PostgreSQL
- [ ] Define Prisma schema models
- [ ] Run `prisma migrate dev --name init`
- [ ] Create seed script with test users
- [ ] Document database setup in README

**Definition of Done:**
- Database accessible at localhost:5432
- All tables created
- Seed data inserted successfully

---

### Epic 2: Authentication System (15 points)

#### Story 2.1: NextAuth.js Setup (5 points)
**As a** developer
**I want** NextAuth.js configured
**So that** users can authenticate securely

**Acceptance Criteria:**
- [ ] NextAuth.js installed & configured
- [ ] JWT session strategy
- [ ] Credentials provider (email/password)
- [ ] Session middleware
- [ ] Protected route wrapper

**Tasks:**
- [ ] Install `next-auth@beta` (v5)
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Configure JWT secret & session strategy
- [ ] Create `auth.config.ts`
- [ ] Build `withAuth` middleware

**Definition of Done:**
- Auth API routes respond correctly
- Session cookies set properly
- Protected routes redirect to login

---

#### Story 2.2: Signup & Login Pages (5 points)
**As a** user
**I want** to create an account and login
**So that** I can use GrowPath

**Acceptance Criteria:**
- [ ] Signup page (/signup) with form validation
- [ ] Login page (/login) with error handling
- [ ] Password hashing (bcrypt)
- [ ] Email uniqueness check
- [ ] Redirect to dashboard after login

**Tasks:**
- [ ] Create signup form component (React Hook Form + Zod)
- [ ] Create login form component
- [ ] Build signup API endpoint
- [ ] Implement password hashing
- [ ] Add form error states & messages

**Definition of Done:**
- User can signup with email/password
- User can login with credentials
- Passwords stored hashed in DB
- Form validation works (client + server)

---

#### Story 2.3: Session Management (5 points)
**As a** user
**I want** my session to persist
**So that** I don't have to login repeatedly

**Acceptance Criteria:**
- [ ] Session stored in Redis
- [ ] Session TTL: 7 days
- [ ] Auto-refresh on activity
- [ ] Logout clears session
- [ ] `useSession` hook works

**Tasks:**
- [ ] Set up Redis (Docker Compose)
- [ ] Configure session adapter (Redis)
- [ ] Implement logout endpoint
- [ ] Create `useSession` wrapper hook
- [ ] Add session debugging (dev mode)

**Definition of Done:**
- Session persists across page refreshes
- Session expires after 7 days inactivity
- Logout works correctly

---

### Epic 3: Design System (8 points)

#### Story 3.1: UI Component Library (5 points)
**As a** developer
**I want** reusable UI components
**So that** we can build UIs faster

**Acceptance Criteria:**
- [ ] Radix UI primitives installed
- [ ] Button component with variants
- [ ] Input component with validation states
- [ ] Card component
- [ ] Typography components
- [ ] Green theme applied consistently

**Tasks:**
- [ ] Install `@radix-ui/react-*` packages
- [ ] Create `components/ui/Button.tsx` (primary, secondary, ghost variants)
- [ ] Create `components/ui/Input.tsx` (error, success states)
- [ ] Create `components/ui/Card.tsx`
- [ ] Create typography components (H1, H2, Text)
- [ ] Document components in Storybook (optional)

**Definition of Done:**
- All components render correctly
- Theme colors applied (#10B981)
- TypeScript types exported
- Accessible (keyboard navigation)

---

#### Story 3.2: Tailwind Theme Configuration (3 points)
**As a** developer
**I want** a consistent design system
**So that** the app looks cohesive

**Acceptance Criteria:**
- [ ] Custom color palette (green shades)
- [ ] Typography scale configured
- [ ] Spacing scale
- [ ] Border radius tokens
- [ ] Shadow tokens

**Tasks:**
- [ ] Define `colors.primary` in tailwind.config
- [ ] Add font families (Inter, Poppins, Fira Code)
- [ ] Configure spacing scale
- [ ] Define border radius (sm, md, lg, xl)
- [ ] Create shadow scale

**Definition of Done:**
- Tailwind config complete
- Design tokens documented
- Used in at least one component

---

### Epic 4: OpenAI Integration (9 points)

#### Story 4.1: OpenAI Service Setup (5 points)
**As a** developer
**I want** OpenAI API integrated
**So that** we can generate learning paths

**Acceptance Criteria:**
- [ ] OpenAI SDK installed
- [ ] API key configured securely
- [ ] `AIService` class created
- [ ] Basic prompt tested
- [ ] Error handling (rate limits, timeouts)

**Tasks:**
- [ ] Install `openai` npm package
- [ ] Create `services/ai.service.ts`
- [ ] Add `generateLearningPath()` method
- [ ] Test with GPT-3.5-turbo
- [ ] Implement retry logic (exponential backoff)

**Definition of Done:**
- Can generate learning path via API
- Errors handled gracefully
- Response time logged

---

#### Story 4.2: Redis Caching Layer (4 points)
**As a** developer
**I want** AI responses cached
**So that** we reduce costs and improve speed

**Acceptance Criteria:**
- [ ] Redis client configured
- [ ] Cache key generation (hash input)
- [ ] TTL: 24 hours
- [ ] Cache hit/miss tracking
- [ ] Cache warming strategy

**Tasks:**
- [ ] Install `ioredis`
- [ ] Create `utils/cache.util.ts`
- [ ] Implement `get()`, `set()`, `del()` methods
- [ ] Add cache key hashing (SHA256)
- [ ] Track metrics (hit rate)

**Definition of Done:**
- Cache stores AI responses
- Subsequent identical requests return cached data
- Cache expires after 24h

---

## 📅 Sprint Schedule

### Week 1
**Monday-Tuesday**: Epic 1 (Project Foundation)
- Day 1: Frontend setup, Backend setup
- Day 2: Database setup, initial deployment test

**Wednesday-Friday**: Epic 2 (Authentication)
- Day 3: NextAuth.js setup
- Day 4: Signup & Login pages
- Day 5: Session management + testing

### Week 2
**Monday-Tuesday**: Epic 3 (Design System)
- Day 6: UI component library
- Day 7: Tailwind theme + documentation

**Wednesday-Friday**: Epic 4 (OpenAI Integration)
- Day 8: OpenAI service setup
- Day 9: Redis caching layer
- Day 10: Integration testing, bug fixes, sprint review prep

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] AIService methods (mock OpenAI API)
- [ ] Cache utility functions
- [ ] Auth utility functions (password hashing)

### Integration Tests
- [ ] Signup flow (E2E)
- [ ] Login flow (E2E)
- [ ] AI generation with caching

### Manual Testing Checklist
- [ ] Signup with valid email/password
- [ ] Signup with existing email (should error)
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should error)
- [ ] Session persists after refresh
- [ ] Logout works
- [ ] Generate learning path (uncached)
- [ ] Generate same path (cached - should be faster)

---

## 🚧 Risks & Mitigation

### Risk 1: OpenAI API Rate Limits
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Implement request queuing
- Add rate limiting on our API
- Monitor usage closely

### Risk 2: Database Schema Changes
**Impact**: Medium
**Probability**: High
**Mitigation**:
- Use Prisma migrations
- Backup data before migrations
- Test migrations on staging first

### Risk 3: NextAuth.js v5 Beta Instability
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Stick to stable APIs
- Have rollback plan to v4
- Monitor GitHub issues

---

## 📈 Success Metrics

### Sprint Velocity
- **Target**: 40-45 story points
- **Measurement**: Completed & accepted stories

### Code Quality
- **Test Coverage**: >70%
- **TypeScript Errors**: 0
- **ESLint Warnings**: <5

### Performance
- **Page Load**: <3s (development)
- **API Response**: <1s (health check)
- **AI Generation**: <10s (uncached)

---

## 🎯 Definition of Done (Sprint Level)

Sprint 1 is complete when:
- ✅ All acceptance criteria met for each story
- ✅ Code reviewed & merged to `main`
- ✅ Unit tests written & passing (>70% coverage)
- ✅ Manual testing checklist completed
- ✅ Documentation updated (README, API docs)
- ✅ Deployed to staging environment
- ✅ Demo prepared for Sprint Review
- ✅ Sprint Retrospective completed

---

## 📝 Notes

- **Daily Standup**: 10:00 AM (async via Slack)
- **Sprint Review**: End of Week 2 (Friday)
- **Sprint Retrospective**: After Sprint Review
- **Backlog Refinement**: Mid-sprint (Day 5)

---

**Created by**: Jordan Martinez (Scrum Master)
**Reviewed by**: Dr. Rajesh Krishnan (Tech Lead), Sarah Chen (Product Owner)
**Last Updated**: 2026-03-01
