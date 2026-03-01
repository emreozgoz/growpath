# 📊 Performance Baseline Metrics

**Date**: March 1, 2026
**Sprint**: Sprint 3 Day 1
**Next.js Version**: 14.2.35

---

## Bundle Size Analysis

### Current Bundle Sizes (Production Build)

| Route | Page Size | First Load JS | Status |
|-------|-----------|---------------|--------|
| `/` (Landing) | 175 B | **96.1 kB** | ✅ Good |
| `/dashboard` | 2.6 kB | **97.0 kB** | ✅ Good |
| `/learning-paths/[id]` | 3.23 kB | **97.6 kB** | ✅ Good |
| `/login` | 2.41 kB | **106 kB** | ⚠️ Heavy |
| `/signup` | 2.43 kB | **106 kB** | ⚠️ Heavy |
| `/onboarding` | 7.05 kB | **101 kB** | ⚠️ Heavy |

### Shared Chunks

| Chunk | Size | Notes |
|-------|------|-------|
| `chunks/117-d74d474dfbe751bf.js` | **31.7 kB** | React/Next core |
| `chunks/fd9d1056-b887bb06a2e14221.js` | **53.6 kB** | ⚠️ **Largest chunk** - needs investigation |
| Other shared chunks | 1.89 kB | ✅ Minimal |
| **Total Shared JS** | **87.3 kB** | ⚠️ Above 85KB threshold |

---

## Bundle Size Summary

### Current State
- **Smallest First Load**: 87.3 kB (shared baseline)
- **Largest First Load**: 106 kB (/login, /signup)
- **Average First Load**: ~100 kB
- **Largest Chunk**: 53.6 kB (fd9d1056)

### Target State (End of Sprint 3)
- **Shared Baseline**: <75 kB (goal: reduce by 12 kB)
- **Max First Load**: <95 kB (goal: reduce by 11 kB)
- **Largest Chunk**: <45 kB (goal: reduce by 8.6 kB)

### Optimization Opportunities
1. ⚠️ **High Priority**: Investigate 53.6 kB shared chunk (fd9d1056)
   - Likely contains: Radix UI components, React Hook Form, Zod
   - Action: Tree-shake unused components, lazy load heavy UI components

2. ⚠️ **Medium Priority**: Auth pages (login/signup) are 106 kB
   - Action: Code split form validation libraries

3. ⚠️ **Medium Priority**: Onboarding is 101 kB
   - Action: Lazy load multi-step form components

---

## Performance Targets (Sprint 3)

### Bundle Size Targets
| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Shared JS | 87.3 kB | <75 kB | 🔴 Not Met |
| Max First Load | 106 kB | <95 kB | 🔴 Not Met |
| Largest Chunk | 53.6 kB | <45 kB | 🔴 Not Met |
| Gzipped Bundle | TBD | <300 kB | ⏳ Pending |

### Core Web Vitals Targets
| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Lighthouse Performance | TBD | >90 | ⏳ Pending |
| LCP (Largest Contentful Paint) | TBD | <2.5s | ⏳ Pending |
| FID (First Input Delay) | TBD | <100ms | ⏳ Pending |
| CLS (Cumulative Layout Shift) | TBD | <0.1 | ⏳ Pending |

---

## Optimization Plan (Day 1)

### Phase 1: Bundle Analysis (Completed ✅)
- [x] Run production build
- [x] Document baseline bundle sizes
- [x] Identify largest chunks

### Phase 2: Code Splitting (Today)
- [ ] Implement dynamic imports for heavy components
- [ ] Lazy load form validation libraries (Zod, React Hook Form)
- [ ] Split Radix UI components per-page
- [ ] Route-based code splitting (already done by Next.js)

### Phase 3: Dependency Optimization (Today)
- [ ] Audit dependencies for unused imports
- [ ] Tree-shake Radix UI components
- [ ] Consider lighter alternatives for heavy libraries
- [ ] Remove unused dependencies

### Phase 4: Image Optimization (Today)
- [ ] Convert all `<img>` to `next/image`
- [ ] Add responsive image sizes
- [ ] Enable WebP/AVIF formats
- [ ] Add proper width/height to prevent CLS

### Phase 5: Font Optimization (Today)
- [ ] Use `next/font` for Google Fonts
- [ ] Add `font-display: swap`
- [ ] Preload critical fonts
- [ ] Self-host fonts if needed

---

## Detailed Chunk Analysis

### Chunk: fd9d1056 (53.6 kB) - INVESTIGATION NEEDED

**Likely Contents**:
- Radix UI components (@radix-ui/*)
- React Hook Form (7 kB)
- Zod validation (10 kB)
- Date libraries (if any)

**Optimization Strategy**:
1. Lazy load Radix UI components not used on initial page load
2. Code split form libraries (only load on auth/onboarding pages)
3. Use dynamic imports for dialog, dropdown, accordion components

**Expected Savings**: 10-15 kB (reduce to ~40 kB)

---

### Chunk: 117 (31.7 kB) - React/Next.js Core

**Contents**: React, React-DOM, Next.js runtime

**Optimization Strategy**:
- No action needed (core framework code)
- Already optimized by Next.js

---

## Next Steps

1. **Run bundle analyzer with visualization**:
   ```bash
   npm run build:analyze
   ```
   - Open `.next/analyze/client.html` to see visual breakdown

2. **Implement code splitting**:
   - Dynamic imports for heavy components
   - Lazy load non-critical UI libraries

3. **Run Lighthouse audit**:
   - Measure LCP, FID, CLS
   - Get Performance score
   - Identify critical issues

4. **Track progress**:
   - Re-run build after each optimization
   - Update this document with new metrics
   - Aim for 15-20% bundle size reduction by end of day

---

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web.dev - Optimize Bundle Size](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)

---

**Last Updated**: March 1, 2026
**Owner**: Emma Davis (Frontend Lead)
**Next Review**: End of Sprint 3 Day 1
