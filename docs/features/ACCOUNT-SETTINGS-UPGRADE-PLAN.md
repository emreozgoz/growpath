# 🎯 Feature Planning: Account Settings & Upgrade Plan

**Meeting Date**: March 5, 2026
**Meeting Type**: Feature Planning Session
**Sprint**: Sprint 4 (March 11-24, 2026)
**Attendees**: Full SDLC Team (8 members)

---

## 📋 Meeting Agenda

**CEO Request**:
> "Bir sonraki sprintte Account Settings ve Upgrade Plan sayfalarını tasarlayıp geliştirmek istiyorum. Kullanıcılar profillerini düzenleyebilmeli, plan değiştirebilmeli ve faturaları görebilmeli. Takımın görüşlerini almak istiyorum."

---

## 💬 Team Discussion Transcript

### 🎯 Sarah Chen (VP of Product) - Product Vision

**"Account Settings & Plan Management are critical for retention and monetization."**

**User Stories Identified**:
1. **As a user**, I want to update my profile so my information stays current
2. **As a free user**, I want to upgrade to a paid plan so I can access premium features
3. **As a paid user**, I want to manage my subscription so I can upgrade/downgrade/cancel
4. **As a user**, I want to view my billing history so I can track my payments

**Product Requirements**:
- ✅ Clean, intuitive UI (inspired by Stripe, Linear, Vercel)
- ✅ One-click upgrade (minimize friction)
- ✅ Clear value proposition for each tier
- ✅ Self-service cancellation (reduce support load)
- ✅ Email change with verification
- ✅ Password reset functionality

**Success Metrics**:
- Upgrade conversion rate: >5% (free → paid)
- Settings page completion rate: >80%
- Support tickets reduction: 30% (self-service)

---

### 📊 Marcus Weber (Principal BA) - Business Analysis

**"Let's analyze the business impact and user flow."**

**Business Goals**:
1. **Revenue Growth**: Convert free users to paid ($19-$69/mo)
2. **Retention**: Make subscription management transparent
3. **Support Reduction**: Self-service for common tasks
4. **Compliance**: GDPR-ready (data export, account deletion)

**User Flow Analysis**:

**Upgrade Flow** (Critical Path):
```
Dashboard → "Upgrade Plan" button → Pricing comparison
  → Select plan → Stripe Checkout → Payment success
  → Dashboard (updated tier badge)
```

**Estimated Conversion**:
- 1000 free users → 50 paid users (5% conversion)
- Average plan: $29/mo (mix of Starter/Pro)
- MRR: $1,450/month

**Break-even Analysis**:
- Fixed costs: ~$100/mo (hosting, services)
- Break-even: 4 users (@ $29/mo average)
- Profit margin: 95% after break-even

---

### 🏗️ Dr. Rajesh Krishnan (Tech Lead) - Architecture

**"Clean separation of concerns, Stripe as source of truth."**

**Architecture Decisions**:

1. **Subscription State Management**:
   - **Source of Truth**: Stripe (not our database)
   - **Sync Method**: Stripe webhooks → update our DB
   - **Fallback**: Poll Stripe API if webhook fails

2. **Database Schema**:
```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  passwordHash      String
  tier              String   @default("FREE") // FREE, STARTER, PRO, UNLIMITED

  // Stripe fields
  stripeCustomerId  String?  @unique
  stripeSubscriptionId String? @unique
  stripeStatus      String?  // active, canceled, past_due
  stripePriceId     String?

  // Billing
  subscriptionStart DateTime?
  subscriptionEnd   DateTime?

  // Account settings
  emailVerified     Boolean  @default(false)
  avatar            String?
  preferences       Json?    @default("{}")

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

3. **API Endpoints**:
```
GET  /api/v1/users/me                 # Get current user profile
PUT  /api/v1/users/me                 # Update profile
POST /api/v1/users/me/change-email    # Change email (with verification)
POST /api/v1/users/me/change-password # Change password

GET  /api/v1/subscriptions/plans      # Get available plans
POST /api/v1/subscriptions/checkout   # Create Stripe Checkout session
POST /api/v1/subscriptions/portal     # Create Stripe Customer Portal session
GET  /api/v1/subscriptions/invoices   # Get billing history

POST /api/v1/stripe/webhook           # Stripe webhook handler
```

4. **Security Considerations**:
- ✅ Password changes require current password
- ✅ Email changes require verification link
- ✅ Stripe webhook signature verification (HMAC)
- ✅ Rate limiting on sensitive endpoints
- ✅ No direct tier changes (only via Stripe)

---

### 💻 Elena Rodriguez (Backend Lead) - Implementation Plan

**"Stripe integration is straightforward, webhooks are critical."**

**Backend Tasks** (3 days):

**Day 1: User Profile API**
```typescript
// GET /api/v1/users/me
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      avatar: true,
      stripeStatus: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      createdAt: true
    }
  })
  res.json({ success: true, data: user })
}

// PUT /api/v1/users/me
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, avatar } = req.body
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, avatar, updatedAt: new Date() }
  })
  res.json({ success: true, data: user })
}
```

**Day 2: Stripe Checkout Integration**
```typescript
// POST /api/v1/subscriptions/checkout
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  const { priceId } = req.body // e.g., price_1ABC...DEF (Stripe Price ID)

  const session = await stripe.checkout.sessions.create({
    customer: user.stripeCustomerId, // or create new customer
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.FRONTEND_URL}/settings?upgrade=canceled`,
    metadata: { userId: req.user.id }
  })

  res.json({ success: true, data: { sessionId: session.id } })
}
```

**Day 3: Webhook Handler**
```typescript
// POST /api/v1/stripe/webhook
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']
  const event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET)

  switch (event.type) {
    case 'checkout.session.completed':
      // Update user tier, subscription IDs
      await updateUserSubscription(event.data.object)
      break
    case 'customer.subscription.updated':
      // Handle upgrade/downgrade
      break
    case 'customer.subscription.deleted':
      // Handle cancellation
      await handleCancellation(event.data.object)
      break
    case 'invoice.payment_failed':
      // Handle failed payment
      break
  }

  res.json({ received: true })
}
```

**Stripe Products Setup**:
```javascript
// Create in Stripe Dashboard or via API
const products = [
  { name: 'Starter', price: 1900, features: ['GPT-4', '10 paths/month', 'Priority support'] },
  { name: 'Pro', price: 3900, features: ['GPT-4', '30 paths/month', 'Export features'] },
  { name: 'Unlimited', price: 6900, features: ['GPT-4', 'Unlimited paths', 'API access'] }
]
```

---

### 🎨 Yuki Tanaka (Frontend Lead) - UI/UX Design

**"Settings page should be simple, upgrade flow should be frictionless."**

**Frontend Tasks** (2.5 days):

**Page Structure**:
```
/settings
├── /settings/profile        # Name, email, avatar
├── /settings/account        # Password, security
├── /settings/subscription   # Plan, billing
└── /settings/preferences    # Notifications, theme
```

**Day 1: Settings Layout**
```tsx
// app/settings/layout.tsx
export default function SettingsLayout({ children }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64">
          <SettingsNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**Day 2: Profile & Subscription Pages**
```tsx
// app/settings/profile/page.tsx
export default function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label>Name</label>
          <Input name="name" value={user.name} />
        </div>
        <div>
          <label>Email</label>
          <Input name="email" value={user.email} disabled />
          <p className="text-sm text-gray-500">
            Contact support to change email
          </p>
        </div>
        <div>
          <label>Avatar</label>
          <AvatarUpload />
        </div>
        <Button type="submit">Save Changes</Button>
      </CardContent>
    </Card>
  )
}

// app/settings/subscription/page.tsx
export default function SubscriptionSettings() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{user.tier}</h3>
              {user.tier === 'FREE' ? (
                <p>Upgrade to unlock premium features</p>
              ) : (
                <p>Next billing: {user.subscriptionEnd}</p>
              )}
            </div>
            <Button onClick={handleManageBilling}>
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {user.tier === 'FREE' && <PricingCards />}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Day 3: Upgrade Flow Polish**
- Stripe Checkout integration (redirectToCheckout)
- Success/cancel handling
- Loading states
- Error handling
- Optimistic UI updates

**Design Inspiration**:
- **Stripe Dashboard**: Clean, professional
- **Linear Settings**: Minimalist, fast
- **Vercel Dashboard**: Modern, intuitive

---

### 🧪 Priya Sharma (QA Lead) - Testing Strategy

**"We need to test payment flows thoroughly - use Stripe test mode."**

**Test Cases** (20 test cases):

**Profile Settings** (5 tests):
1. ✅ Update name successfully
2. ✅ Upload avatar successfully
3. ✅ Validation errors for empty name
4. ✅ Change password with correct current password
5. ✅ Reject password change with wrong current password

**Subscription Management** (10 tests):
6. ✅ View current plan (Free tier)
7. ✅ Click "Upgrade" → redirect to Stripe Checkout
8. ✅ Complete payment in test mode → tier updates
9. ✅ Cancel payment → no tier change
10. ✅ Upgrade from Starter to Pro
11. ✅ Downgrade from Pro to Starter (end of period)
12. ✅ Cancel subscription → end of period access
13. ✅ View billing history (invoices)
14. ✅ Download invoice PDF
15. ✅ Handle failed payment (webhook)

**Edge Cases** (5 tests):
16. ✅ Webhook arrives before redirect (race condition)
17. ✅ Duplicate webhook (idempotency)
18. ✅ Invalid webhook signature → reject
19. ✅ Stripe API down → graceful error
20. ✅ User deletes account with active subscription

**Stripe Test Cards**:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

**E2E Test** (Playwright):
```typescript
test('upgrade from free to starter plan', async ({ page }) => {
  await page.goto('/login')
  await login(page, 'test@example.com', 'password')

  await page.goto('/settings/subscription')
  await page.click('text=Upgrade to Starter')

  // Wait for Stripe Checkout redirect
  await page.waitForURL(/.*checkout\.stripe\.com.*/)

  // Fill payment form (test mode)
  await page.fill('[name="cardnumber"]', '4242 4242 4242 4242')
  await page.fill('[name="exp-date"]', '12/30')
  await page.fill('[name="cvc"]', '123')
  await page.click('button[type="submit"]')

  // Wait for redirect back
  await page.waitForURL('**/dashboard?upgrade=success')

  // Verify tier updated
  await page.goto('/settings/subscription')
  await expect(page.locator('text=STARTER')).toBeVisible()
})
```

---

### 🚀 Alex Kim (DevOps Lead) - Deployment & Monitoring

**"Stripe webhooks need reliable delivery - use retries and monitoring."**

**Infrastructure Requirements**:

1. **Webhook Endpoint**:
   - Must be HTTPS (Stripe requirement)
   - Public endpoint: `https://api.growpath.com/api/v1/stripe/webhook`
   - Signature verification required

2. **Environment Variables**:
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
STRIPE_PRICE_STARTER=price_1ABC...
STRIPE_PRICE_PRO=price_1DEF...
STRIPE_PRICE_UNLIMITED=price_1GHI...
```

3. **Monitoring**:
   - **Sentry**: Track webhook failures
   - **Stripe Dashboard**: Monitor successful webhooks
   - **Alerts**: Failed payment, webhook down

4. **Backup Strategy**:
   - Daily backup of user subscriptions
   - Stripe reconciliation script (weekly)
   - Manual override endpoint (admin only)

---

### 📋 Jordan Martinez (Scrum Master) - Sprint Planning

**"This is a 5-point epic, fits perfectly in Sprint 4 Day 2-3."**

**Epic Breakdown**:

**Epic 12: Account Settings & Upgrade Plan (5 points)**

**Tasks**:
1. **Backend**: User profile API (0.5 day) - Elena
2. **Backend**: Stripe checkout integration (1 day) - Elena
3. **Backend**: Webhook handler (0.5 day) - Elena
4. **Backend**: Billing history API (0.5 day) - Elena
5. **Frontend**: Settings layout & navigation (0.5 day) - Yuki
6. **Frontend**: Profile page (0.5 day) - Yuki
7. **Frontend**: Subscription page (1 day) - Yuki
8. **Frontend**: Upgrade flow (Stripe integration) (0.5 day) - Yuki
9. **QA**: E2E tests (20 test cases) (0.5 day) - Priya
10. **Docs**: User guide, API docs (0.5 day) - Jordan

**Total Estimate**: 2.5 days (5 story points)

**Dependencies**:
- Stripe account set up (test mode first)
- Product prices created in Stripe
- Webhook endpoint deployed

**Success Criteria**:
- ✅ Users can view/edit profile
- ✅ Free users can upgrade via Stripe
- ✅ Paid users can manage subscription (Stripe Customer Portal)
- ✅ Tier changes reflect immediately after payment
- ✅ Billing history displays all invoices
- ✅ All E2E tests passing

---

## 🎯 Feature Specification Summary

### User Flows

**1. Profile Update Flow**:
```
Dashboard → Settings → Profile
  → Edit name/avatar → Save
  → Success notification → Dashboard
```

**2. Upgrade Flow** (Critical):
```
Dashboard → "Upgrade Plan" button (OR Settings → Subscription)
  → View pricing tiers → Click "Upgrade to [Tier]"
  → Redirect to Stripe Checkout → Enter payment details
  → Payment success → Redirect to /dashboard?upgrade=success
  → Tier badge updates (FREE → STARTER/PRO/UNLIMITED)
```

**3. Subscription Management** (Paid Users):
```
Settings → Subscription → "Manage Subscription" button
  → Redirect to Stripe Customer Portal
  → Upgrade / Downgrade / Cancel subscription
  → Changes take effect per Stripe billing cycle
```

**4. Billing History**:
```
Settings → Subscription → Billing History
  → Table of invoices (date, amount, status, PDF link)
  → Click "Download PDF" → Stripe-hosted invoice
```

---

### Wireframe (Low-Fidelity)

**Settings Navigation**:
```
┌─────────────────────────────────────────────────────┐
│ GrowPath                              [Avatar] ▼    │
├─────────────────────────────────────────────────────┤
│                    Settings                          │
│                                                      │
│  ┌──────────┐  ┌──────────────────────────────────┐│
│  │ Profile  │  │  Profile Information              ││
│  │ Account  │  │                                   ││
│  │►Subscription│  Name: [John Doe              ] ││
│  │ Preferences│ Email: john@example.com (verified)││
│  └──────────┘  │Avatar: [Upload Image]          ││
│                │                                   ││
│                │ [Save Changes]                    ││
│                └──────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Subscription Page** (Free User):
```
┌─────────────────────────────────────────────────────┐
│  Current Plan: FREE                                  │
│  Upgrade to unlock premium features                  │
│                                      [Upgrade Plan]  │
├─────────────────────────────────────────────────────┤
│  Available Plans                                     │
│  ┌───────┐  ┌───────┐  ┌───────────┐               │
│  │STARTER│  │  PRO  │  │ UNLIMITED │               │
│  │$19/mo │  │$39/mo │  │  $69/mo   │               │
│  │GPT-4  │  │GPT-4  │  │   GPT-4   │               │
│  │10path │  │30path │  │ Unlimited │               │
│  │[Select│  │[Select│  │  [Select] │               │
│  └───────┘  └───────┘  └───────────┘               │
└─────────────────────────────────────────────────────┘
```

**Subscription Page** (Paid User):
```
┌─────────────────────────────────────────────────────┐
│  Current Plan: STARTER ($19/month)                   │
│  Next billing: March 15, 2026                        │
│                          [Manage Subscription]       │
├─────────────────────────────────────────────────────┤
│  Billing History                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Date       │ Amount │ Status │ Invoice       │  │
│  │ Feb 15     │ $19.00 │ Paid   │ [Download PDF]│  │
│  │ Jan 15     │ $19.00 │ Paid   │ [Download PDF]│  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Decisions Made

### Technology Stack
- **Payment Provider**: Stripe Checkout + Customer Portal
- **Subscription Sync**: Stripe Webhooks (primary) + polling (fallback)
- **Email Verification**: Resend API
- **Avatar Upload**: Cloudinary or S3 (future)

### Scope for Sprint 4
**In Scope** ✅:
- Profile edit (name, avatar placeholder)
- Subscription view (current plan, next billing)
- Upgrade flow (Stripe Checkout)
- Subscription management (Stripe Customer Portal link)
- Billing history (invoice list)
- 20 E2E tests

**Out of Scope** ⏳ (Future Sprint):
- Email change (requires verification system)
- Password change (requires current password flow)
- 2FA / Security keys
- Account deletion (GDPR compliance)
- Usage analytics in settings
- Team collaboration features

---

## 📅 Integration with Sprint 4

**Sprint 4 Epic 12** (Updated):
**Account Settings & Subscription Management (5 points)**

**Day 2-3 of Sprint 4**:
- Day 2 Morning: Backend profile + Stripe setup
- Day 2 Afternoon: Stripe webhook handler
- Day 3 Morning: Frontend settings pages
- Day 3 Afternoon: E2E tests + polish

**Fits perfectly** with existing Sprint 4 plan!

---

## 🚀 Next Steps

1. ✅ **Approve Feature Spec** (this document)
2. ⏳ Set up Stripe account (test mode)
3. ⏳ Create Stripe products (Starter, Pro, Unlimited)
4. ⏳ Add to Sprint 4 backlog (already planned!)
5. ⏳ Design high-fidelity mockups (Figma)
6. ⏳ Implement in Sprint 4 Day 2-3

---

**Meeting Outcome**: ✅ **Feature Approved**
**Estimated Delivery**: Sprint 4 Day 3 (March 13, 2026)
**Confidence Level**: 🟢 **HIGH** (clear requirements, proven tech stack)

---

**Prepared by**: Jordan Martinez (Scrum Master)
**Reviewed by**: All team leads
**Next Review**: Sprint 4 Day 2 standup (implementation progress)
**Status**: 📋 **READY FOR SPRINT 4**
