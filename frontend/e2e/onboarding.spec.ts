import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Create account and login before each test
    await page.goto('/signup')
    const timestamp = Date.now()
    const email = `onboarding${timestamp}@example.com`
    const password = 'TestPassword123!'

    await page.fill('input[name="name"]', `Onboarding Test ${timestamp}`)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.fill('input[name="confirmPassword"]', password)
    await page.click('button[type="submit"]')

    await page.waitForURL('**/login*')

    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    await page.waitForURL('**/dashboard')
  })

  test('should complete full onboarding flow (6 steps)', async ({ page }) => {
    // Navigate to onboarding
    await page.goto('/onboarding')

    // Step 1: Choose Skill
    await expect(page.locator('text=Step 1 of 6')).toBeVisible()
    await page.fill('input[placeholder*="skill" i]', 'JavaScript')
    await page.click('button:has-text("Next")')

    // Step 2: Experience Level
    await expect(page.locator('text=Step 2 of 6')).toBeVisible()
    await page.click('button:has-text("BEGINNER"), button:has-text("Beginner")')
    await page.click('button:has-text("Next")')

    // Step 3: Time Commitment
    await expect(page.locator('text=Step 3 of 6')).toBeVisible()
    await page.selectOption('select[name="durationWeeks"]', '4')
    await page.selectOption('select[name="hoursPerWeek"]', '10')
    await page.selectOption('select[name="daysPerWeek"]', '5')
    await page.click('button:has-text("Next")')

    // Step 4: Set Goals
    await expect(page.locator('text=Step 4 of 6')).toBeVisible()
    await page.click('text=Build projects')
    await page.click('text=Get job ready')
    await page.click('button:has-text("Next")')

    // Step 5: Review
    await expect(page.locator('text=Step 5 of 6')).toBeVisible()
    await expect(page.locator('text=JavaScript')).toBeVisible()
    await page.click('button:has-text("Next")')

    // Step 6: Generate Path
    await expect(page.locator('text=Step 6 of 6')).toBeVisible()
    await page.click('button:has-text("Generate")')

    // Wait for AI generation (this might take a few seconds)
    await page.waitForTimeout(3000)

    // Should redirect to dashboard or learning path detail
    await expect(page.url()).toMatch(/(dashboard|learning-paths)/)
  })

  test('should navigate back and forth between steps', async ({ page }) => {
    await page.goto('/onboarding')

    // Go to step 2
    await page.fill('input[placeholder*="skill" i]', 'Python')
    await page.click('button:has-text("Next")')
    await expect(page.locator('text=Step 2 of 6')).toBeVisible()

    // Go back to step 1
    await page.click('button:has-text("Back")')
    await expect(page.locator('text=Step 1 of 6')).toBeVisible()

    // Verify skill is still filled
    await expect(page.locator('input[placeholder*="skill" i]')).toHaveValue('Python')
  })

  test('should show validation errors when required fields are empty', async ({ page }) => {
    await page.goto('/onboarding')

    // Try to proceed without filling skill
    await page.click('button:has-text("Next")')

    // Should show error or not proceed
    await expect(page.locator('text=Step 1 of 6')).toBeVisible()
  })
})
