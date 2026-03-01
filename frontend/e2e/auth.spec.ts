import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('should complete signup flow successfully', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup')

    // Wait for page to load
    await expect(page.locator('h2')).toContainText('Create your account')

    // Fill signup form
    const timestamp = Date.now()
    await page.fill('input[name="name"]', `Test User ${timestamp}`)
    await page.fill('input[name="email"]', `test${timestamp}@example.com`)
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect to login with success message
    await page.waitForURL('**/login*')
    await expect(page.locator('text=Account created successfully')).toBeVisible()
  })

  test('should show validation errors for invalid signup', async ({ page }) => {
    await page.goto('/signup')

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
  })

  test('should complete login flow successfully', async ({ page }) => {
    // First create an account (reuse signup logic)
    await page.goto('/signup')
    const timestamp = Date.now()
    const email = `logintest${timestamp}@example.com`
    const password = 'TestPassword123!'

    await page.fill('input[name="name"]', `Login Test ${timestamp}`)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.fill('input[name="confirmPassword"]', password)
    await page.click('button[type="submit"]')

    // Wait for redirect to login
    await page.waitForURL('**/login*')

    // Now login with created account
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard')
    await expect(page.locator('text=GrowPath')).toBeVisible()
  })

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Invalid credentials').or(page.locator('text=Login failed'))).toBeVisible()
  })
})
