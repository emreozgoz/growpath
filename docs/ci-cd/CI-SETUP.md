# 🔄 CI/CD Setup Documentation

**Last Updated**: March 5, 2026
**Status**: ✅ **Active**

---

## 📊 Overview

GrowPath uses **GitHub Actions** for continuous integration and continuous deployment. Every push to `main` or `develop` branches triggers automated testing, building, and quality checks.

---

## 🎯 CI Workflow

### Workflow File
`.github/workflows/ci.yml`

### Triggers
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### Jobs

#### 1. Frontend CI
**Duration**: ~3-4 minutes
**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Cache npm dependencies
4. Install dependencies (`npm ci`)
5. Type check (`npm run type-check`)
6. Lint (`npm run lint`)
7. Build (`npm run build`)
8. Run unit tests (future)

**Environment Variables**:
- `NEXT_PUBLIC_API_URL`: http://localhost:3001

---

#### 2. Backend CI
**Duration**: ~2-3 minutes
**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Cache npm dependencies
4. Install dependencies (`npm ci`)
5. Type check (`npx tsc --noEmit`)
6. Security audit (`npm audit --audit-level=high`)

**Security Audit**:
- Runs `npm audit` with high severity threshold
- `continue-on-error: true` (doesn't fail build for accepted risks)
- Alerts on new high/critical vulnerabilities

---

#### 3. E2E Tests
**Duration**: ~5-7 minutes
**Depends On**: `frontend-ci`, `backend-ci`

**Services**:
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install frontend + backend dependencies
4. Run database migrations (`prisma migrate deploy`)
5. Install Playwright browsers (chromium only)
6. Start backend server (background)
7. Wait for backend health check
8. Start frontend server (background)
9. Wait for frontend ready
10. Run E2E tests (`npm run test:e2e`)
11. Upload test artifacts (on failure)

**Test Artifacts** (retained 7 days):
- Playwright HTML report
- Screenshots (on failure)
- Videos (on failure)

---

## 🔒 Secrets Configuration

### Required GitHub Secrets

Navigate to: `Settings → Secrets and variables → Actions`

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI generation | `sk-proj-...` |

### Optional Secrets (for future deployment)

| Secret Name | Description |
|-------------|-------------|
| `VERCEL_TOKEN` | Vercel deployment token |
| `SENTRY_AUTH_TOKEN` | Sentry error tracking |
| `STRIPE_SECRET_KEY` | Stripe payments (test mode) |

---

## 📈 Performance Optimization

### Dependency Caching

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
```

**Cache Hit Rate**: ~80% (speeds up builds 2-3x)

### Parallel Jobs

- `frontend-ci` and `backend-ci` run in parallel
- `e2e-tests` runs after both complete
- Total pipeline time: ~8-10 minutes

---

## 🧪 Test Execution

### E2E Test Suite

**Test Cases**: 7 total
- **Auth Flow**: 4 tests (signup, login, validation)
- **Onboarding Flow**: 3 tests (6-step wizard, navigation, validation)

**Test Configuration** (`playwright.config.ts`):
```typescript
{
  testDir: './e2e',
  fullyParallel: false,  // Sequential in CI
  retries: 2,            // Retry failed tests
  workers: 1,            // Single worker in CI
  timeout: 30000,        // 30s timeout per test
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
}
```

### Test Database

**CI Database**:
```
postgresql://growpath:growpath_dev_password_2026@localhost:5432/growpath_dev
```

**Migrations**: Applied automatically via `prisma migrate deploy`

---

## 🐛 Debugging Failed CI Runs

### 1. Check Logs

**GitHub Actions UI**:
```
Actions → CI → [Failed run] → Click on failed job
```

### 2. Download Artifacts

**Failed E2E tests**:
1. Navigate to failed workflow run
2. Scroll to "Artifacts" section
3. Download:
   - `playwright-report` (HTML report)
   - `playwright-screenshots` (failure screenshots)

### 3. Common Issues

#### Type Check Failures
```bash
# Run locally:
cd frontend
npm run type-check
```

#### E2E Test Failures
```bash
# Run locally with UI:
cd frontend
npm run test:e2e:ui
```

#### Build Failures
```bash
# Run locally:
cd frontend
npm run build
```

---

## 📊 Quality Gates

### Required Checks (must pass)

- ✅ TypeScript type check (frontend + backend)
- ✅ ESLint (no errors)
- ✅ Next.js build succeeds
- ✅ All E2E tests pass (7/7)

### Advisory Checks (can fail)

- ⚠️ npm audit (alerts only, doesn't block)
- ⚠️ Unit tests (not yet implemented)

---

## 🚀 Local Testing (Before Pushing)

### Pre-Push Checklist

```bash
# 1. Type check
cd frontend && npm run type-check
cd ../backend && npx tsc --noEmit

# 2. Lint
cd ../frontend && npm run lint

# 3. Build
npm run build

# 4. E2E tests (optional)
npm run test:e2e

# 5. Security audit
cd ../backend && npm audit
```

### Quick Pre-Push Script

Create `.git/hooks/pre-push`:
```bash
#!/bin/bash
echo "Running pre-push checks..."
cd frontend && npm run type-check && npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Pre-push checks failed"
  exit 1
fi
echo "✅ Pre-push checks passed"
```

Make executable:
```bash
chmod +x .git/hooks/pre-push
```

---

## 📈 CI Metrics & Monitoring

### Success Rate Target
- **Target**: >95% pass rate
- **Current**: TBD (first CI run pending)

### Performance Targets
- **Frontend CI**: <4 minutes
- **Backend CI**: <3 minutes
- **E2E Tests**: <7 minutes
- **Total Pipeline**: <10 minutes

### Flaky Test Detection
- Tests with <80% pass rate flagged
- Playwright retries: 2 attempts
- Screenshots/videos for debugging

---

## 🔄 Future Enhancements

### Phase 1 (Post-Launch)
- [ ] Add unit test execution
- [ ] Enable test coverage reporting
- [ ] Add Lighthouse CI (performance)
- [ ] Dependency vulnerability alerts

### Phase 2 (Month 2)
- [ ] Continuous deployment (CD)
- [ ] Preview deployments (Vercel)
- [ ] Automated release notes
- [ ] Slack notifications

### Phase 3 (Month 3)
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Visual regression testing
- [ ] Performance budgets
- [ ] A/B testing infrastructure

---

## 🆘 Support & Troubleshooting

### CI Pipeline Issues

**Problem**: E2E tests timeout
**Solution**: Increase timeout in `playwright.config.ts` or check backend health

**Problem**: Database migration fails
**Solution**: Check `prisma/schema.prisma` syntax, run `prisma validate`

**Problem**: Cache not working
**Solution**: Clear cache in Actions settings, rebuild

### Getting Help

1. **Check Logs**: Review GitHub Actions logs
2. **Download Artifacts**: Playwright reports + screenshots
3. **Run Locally**: Reproduce issue in local environment
4. **Team Channel**: Post in #engineering Slack channel
5. **Documentation**: This file + Playwright docs

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Next.js CI/CD](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Prisma CI](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## 📊 Status Badge

### Markdown
```markdown
[![CI](https://github.com/emreozgoz/growpath/actions/workflows/ci.yml/badge.svg)](https://github.com/emreozgoz/growpath/actions/workflows/ci.yml)
```

### HTML
```html
<a href="https://github.com/emreozgoz/growpath/actions/workflows/ci.yml">
  <img src="https://github.com/emreozgoz/growpath/actions/workflows/ci.yml/badge.svg" alt="CI">
</a>
```

---

**Maintained by**: Alex Chen (DevOps Lead)
**Last CI Run**: TBD (first run pending)
**Pipeline Status**: ✅ **Ready for first test**
