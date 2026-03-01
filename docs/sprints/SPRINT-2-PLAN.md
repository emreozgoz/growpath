# 🚀 Sprint 2: Core Features - Planning Document

**Sprint Duration**: 2 weeks (Week 3-4)
**Sprint Goal**: Deliver core learning path generation feature with complete user onboarding flow

---

## 📊 Sprint Overview

### Sprint Objectives
1. ✅ 6-step onboarding stepper fully functional
2. ✅ AI learning path generation working end-to-end
3. ✅ User dashboard with path listing & management
4. ✅ Progress tracking system implemented
5. ✅ Stripe integration for subscription management

### Team Capacity
- **Total Story Points**: 50
- **Team Velocity**: 45 points (based on Sprint 1 actual)
- **Sprint Duration**: 10 working days

---

## 🎯 User Stories & Tasks

### Epic 5: Onboarding Flow (12 points)

#### Story 5.1: Stepper Navigation Component (3 points)
**As a** user
**I want** a clear stepper interface
**So that** I know my progress through onboarding

**Acceptance Criteria:**
- [ ] Stepper shows 6 steps with icons
- [ ] Current step highlighted (green)
- [ ] Completed steps show checkmark
- [ ] Next/Previous buttons
- [ ] Progress bar (visual indicator)
- [ ] Mobile responsive

**Tasks:**
- [ ] Create `components/features/onboarding/StepperNav.tsx`
- [ ] Implement step state management (Zustand store)
- [ ] Add animations (step transitions)
- [ ] Style with green theme
- [ ] Add keyboard navigation (arrow keys)

**Definition of Done:**
- Stepper renders all 6 steps
- Navigation works (next, previous, jump to step)
- Responsive on mobile
- Accessible (ARIA labels)

---

#### Story 5.2: Step 1 - Welcome & Skill Selection (3 points)
**As a** user
**I want** to select what skill I want to learn
**So that** the AI can generate a relevant plan

**Acceptance Criteria:**
- [ ] Welcome message with GrowPath branding
- [ ] Search bar for skill input
- [ ] Popular skills suggestions (Python, JavaScript, C#, etc.)
- [ ] Custom skill input allowed
- [ ] Validation: non-empty, max 100 chars

**Tasks:**
- [ ] Create `SkillSelector.tsx` component
- [ ] Build search with autocomplete
- [ ] Add popular skills grid (clickable cards)
- [ ] Implement form validation (Zod schema)
- [ ] Save to onboarding store

**Definition of Done:**
- User can search or select skill
- Custom skills allowed
- Selection saved to state

---

#### Story 5.3: Step 2 - Current Level Selection (2 points)
**As a** user
**I want** to specify my current skill level
**So that** the learning path matches my experience

**Acceptance Criteria:**
- [ ] Three level options: Beginner, Intermediate, Advanced
- [ ] Clear descriptions for each level
- [ ] Visual cards with icons
- [ ] Single selection (radio group)

**Tasks:**
- [ ] Create `LevelSelector.tsx` component
- [ ] Design level cards with descriptions
- [ ] Implement radio group logic
- [ ] Add hover/focus states
- [ ] Save to onboarding store

**Definition of Done:**
- User can select one level
- Descriptions clear
- Selection saved

---

#### Story 5.4: Step 3 - Time Commitment (2 points)
**As a** user
**I want** to specify my available time
**So that** the plan fits my schedule

**Acceptance Criteria:**
- [ ] Duration selector (1-52 weeks)
- [ ] Days per week selector (1-7)
- [ ] Hours per day selector (0.5-8)
- [ ] Summary: "Total: X hours over Y weeks"
- [ ] Validation: reasonable ranges

**Tasks:**
- [ ] Create `TimeCommitmentSelector.tsx`
- [ ] Build number input with +/- buttons
- [ ] Add range sliders (alternative UI)
- [ ] Calculate total hours display
- [ ] Validate inputs (min/max)

**Definition of Done:**
- User can set weeks, days, hours
- Total calculated correctly
- Validation works

---

#### Story 5.5: Step 4 - Goals & Preferences (2 points)
**As a** user
**I want** to specify my learning goals
**So that** the AI tailors the path to my objectives

**Acceptance Criteria:**
- [ ] Multi-select checkbox for goals
- [ ] Common goals: "Build projects", "Get certified", "Job interview prep"
- [ ] Custom goal input (optional)
- [ ] Max 5 goals selected

**Tasks:**
- [ ] Create `GoalsSelector.tsx`
- [ ] Build checkbox group
- [ ] Add custom goal text input
- [ ] Limit selection to 5
- [ ] Save to onboarding store

**Definition of Done:**
- User can select up to 5 goals
- Custom goals allowed
- Selection saved

---

### Epic 6: AI Learning Path Generation (15 points)

#### Story 6.1: AI Prompt Engineering (5 points)
**As a** developer
**I want** optimized AI prompts
**So that** we get high-quality learning paths

**Acceptance Criteria:**
- [ ] System prompt defined (role, format, constraints)
- [ ] User prompt template with variables
- [ ] JSON output format enforced
- [ ] Prompt tested with GPT-3.5 and GPT-4
- [ ] Edge cases handled (vague skills, extreme durations)

**Tasks:**
- [ ] Write system prompt (AI persona, output format)
- [ ] Create user prompt template
- [ ] Define JSON schema for learning path
- [ ] Test prompts with various inputs
- [ ] Document prompt in codebase

**Definition of Done:**
- Prompts return valid JSON 95%+ of time
- Output quality validated by team
- Documented in `docs/ai-prompts.md`

---

#### Story 6.2: Learning Path API Endpoint (5 points)
**As a** user
**I want** to generate a personalized learning path
**So that** I have a structured plan to follow

**Acceptance Criteria:**
- [ ] POST `/api/learning-paths` endpoint
- [ ] Accepts onboarding form data
- [ ] Calls AIService.generateLearningPath()
- [ ] Saves to database (learning_paths table)
- [ ] Returns path with weekly breakdown
- [ ] Rate limiting (per user tier)

**Tasks:**
- [ ] Create `routes/learning-path.routes.ts`
- [ ] Implement request validation (Zod)
- [ ] Call AI service with tier-based model selection
- [ ] Parse and validate AI response
- [ ] Save to PostgreSQL via Prisma
- [ ] Add rate limiting middleware

**Definition of Done:**
- API returns learning path
- Saved to database correctly
- Rate limiting works (3/month free, unlimited paid)
- Error handling complete

---

#### Story 6.3: Loading & Error States (5 points)
**As a** user
**I want** clear feedback during AI generation
**So that** I know the system is working

**Acceptance Criteria:**
- [ ] Loading animation (AI thinking)
- [ ] Progress messages ("Analyzing your goals...", "Creating your path...")
- [ ] Success animation (confetti, celebration)
- [ ] Error messages (user-friendly)
- [ ] Retry button on failure

**Tasks:**
- [ ] Create `LoadingState.tsx` component (skeleton, spinner)
- [ ] Add progress messages (sequence of 3-4 messages)
- [ ] Implement success animation (confetti.js)
- [ ] Design error state UI
- [ ] Add retry logic

**Definition of Done:**
- Loading state shows during generation
- Success animation plays on completion
- Errors handled gracefully
- Retry works

---

### Epic 7: User Dashboard (13 points)

#### Story 7.1: Dashboard Layout (3 points)
**As a** user
**I want** a clean dashboard
**So that** I can manage my learning paths

**Acceptance Criteria:**
- [ ] Sidebar navigation (Dashboard, Paths, Progress, Settings)
- [ ] Header with user avatar & dropdown
- [ ] Main content area
- [ ] Footer with links
- [ ] Mobile responsive (hamburger menu)

**Tasks:**
- [ ] Create `app/(dashboard)/layout.tsx`
- [ ] Build `Sidebar.tsx` component
- [ ] Build `DashboardHeader.tsx`
- [ ] Implement mobile menu
- [ ] Add user dropdown (profile, logout)

**Definition of Done:**
- Dashboard layout renders
- Navigation works
- Responsive on mobile

---

#### Story 7.2: Learning Paths List (5 points)
**As a** user
**I want** to see all my learning paths
**So that** I can choose which one to work on

**Acceptance Criteria:**
- [ ] Grid/List view of paths
- [ ] Card shows: skill, duration, progress %, status
- [ ] Filter by status (active, completed, paused)
- [ ] Sort by date, progress
- [ ] "Create New Path" button
- [ ] Empty state (no paths yet)

**Tasks:**
- [ ] Create `app/(dashboard)/paths/page.tsx`
- [ ] Fetch paths via React Query
- [ ] Build `PathCard.tsx` component
- [ ] Implement filter & sort UI
- [ ] Add empty state illustration
- [ ] Link to onboarding flow

**Definition of Done:**
- Paths displayed correctly
- Filter & sort works
- Empty state shows for new users

---

#### Story 7.3: Learning Path Detail View (5 points)
**As a** user
**I want** to view my learning path details
**So that** I know what to study each week

**Acceptance Criteria:**
- [ ] Weekly breakdown (accordion/tabs)
- [ ] Each week shows daily tasks
- [ ] Checkboxes for task completion
- [ ] Progress bar (overall %)
- [ ] Edit notes feature
- [ ] Print/Export options

**Tasks:**
- [ ] Create `app/(dashboard)/paths/[id]/page.tsx`
- [ ] Fetch path details + progress
- [ ] Build weekly accordion component
- [ ] Implement task checkbox (updates DB)
- [ ] Add notes textarea (auto-save)
- [ ] Create print stylesheet

**Definition of Done:**
- Path details render correctly
- Tasks can be checked off
- Progress updates in real-time
- Notes save successfully

---

### Epic 8: Stripe Integration (10 points)

#### Story 8.1: Stripe Setup & Pricing Pages (5 points)
**As a** user
**I want** to see pricing options
**So that** I can upgrade to a paid plan

**Acceptance Criteria:**
- [ ] Pricing page with 4 tiers (Free, Starter, Pro, Unlimited)
- [ ] Feature comparison table
- [ ] "Upgrade" buttons (Stripe Checkout)
- [ ] Current plan indicator (dashboard)
- [ ] FAQ section

**Tasks:**
- [ ] Create `app/(marketing)/pricing/page.tsx`
- [ ] Design pricing cards (green theme)
- [ ] Build comparison table component
- [ ] Integrate Stripe Checkout
- [ ] Add FAQ accordion

**Definition of Done:**
- Pricing page renders
- Upgrade buttons work (test mode)
- Current plan shown correctly

---

#### Story 8.2: Subscription Management (5 points)
**As a** user
**I want** to manage my subscription
**So that** I can upgrade, downgrade, or cancel

**Acceptance Criteria:**
- [ ] Subscription status page
- [ ] Upgrade/Downgrade options
- [ ] Cancel subscription button
- [ ] Billing history
- [ ] Stripe Customer Portal integration

**Tasks:**
- [ ] Create `app/(dashboard)/settings/billing/page.tsx`
- [ ] Fetch subscription from Stripe API
- [ ] Build subscription card component
- [ ] Implement upgrade/downgrade flow
- [ ] Add Stripe webhook handler (subscription events)
- [ ] Integrate Customer Portal

**Definition of Done:**
- User can view subscription status
- Upgrade/downgrade works
- Cancellation works (end of period)
- Webhooks update database

---

## 📅 Sprint Schedule

### Week 3
**Monday-Tuesday**: Epic 5 (Onboarding Flow)
- Day 1: Stepper navigation, Step 1 (Skill)
- Day 2: Step 2 (Level), Step 3 (Time), Step 4 (Goals)

**Wednesday-Friday**: Epic 6 (AI Generation)
- Day 3: AI prompt engineering & testing
- Day 4: Learning path API endpoint
- Day 5: Loading & error states, integration testing

### Week 4
**Monday-Wednesday**: Epic 7 (Dashboard)
- Day 6: Dashboard layout, paths list
- Day 7: Path detail view
- Day 8: Progress tracking, notes feature

**Thursday-Friday**: Epic 8 (Stripe Integration)
- Day 9: Pricing page, Stripe setup
- Day 10: Subscription management, testing, sprint review prep

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Onboarding store (Zustand)
- [ ] Form validation schemas (Zod)
- [ ] AI response parser

### Integration Tests
- [ ] Complete onboarding flow (E2E)
- [ ] Learning path generation (mock AI)
- [ ] Progress tracking (mark tasks complete)
- [ ] Stripe webhook handling

### Manual Testing Checklist
- [ ] Complete onboarding with valid inputs
- [ ] Generate learning path (free tier - GPT-3.5)
- [ ] Generate learning path (paid tier - GPT-4)
- [ ] View learning path details
- [ ] Mark tasks as complete (progress updates)
- [ ] Upgrade to paid plan (test mode)
- [ ] Cancel subscription
- [ ] Test edge cases (invalid inputs, API failures)

---

## 🚧 Risks & Mitigation

### Risk 1: AI Generation Quality Inconsistent
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Extensive prompt testing
- JSON schema validation
- Fallback prompts
- Manual review of samples

### Risk 2: Stripe Integration Complexity
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Use Stripe test mode extensively
- Follow Stripe official docs
- Implement webhook signature verification
- Test all subscription states

### Risk 3: Onboarding UX Too Complex
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- User testing with 3-5 people
- Analytics on drop-off rates
- Simplify if completion rate <80%

---

## 📈 Success Metrics

### Sprint Velocity
- **Target**: 45-50 story points
- **Measurement**: Completed & accepted stories

### Feature Metrics
- **Onboarding Completion Rate**: >80%
- **AI Generation Success Rate**: >95%
- **Path Generation Time**: <8s (P95)

### Code Quality
- **Test Coverage**: >75%
- **TypeScript Errors**: 0
- **Lighthouse Performance**: >85

---

## 🎯 Definition of Done (Sprint Level)

Sprint 2 is complete when:
- ✅ All acceptance criteria met for each story
- ✅ Code reviewed & merged to `main`
- ✅ Unit + integration tests passing (>75% coverage)
- ✅ Manual testing checklist completed
- ✅ Onboarding flow fully functional (E2E test passes)
- ✅ Learning path generation working with both GPT models
- ✅ Dashboard shows paths & progress correctly
- ✅ Stripe integration tested in test mode
- ✅ Deployed to staging
- ✅ Sprint Review demo prepared
- ✅ Sprint Retrospective completed

---

**Created by**: Jordan Martinez (Scrum Master)
**Reviewed by**: Sarah Chen (Product Owner), Dr. Rajesh Krishnan (Tech Lead)
**Last Updated**: 2026-03-01
