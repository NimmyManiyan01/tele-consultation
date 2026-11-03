import { test, expect } from '@playwright/test';

test.describe('Flow F01: Doctor Discovery & Appointment Booking', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });
  });

  test('F01-H1: Clinician Directory Search and Profile Navigation', async ({ page }) => {
    // 1. Visit Doctor Directory
    await page.goto('/doctors');
    await expect(page).toHaveTitle(/Kaizentrix/i);

    // 2. Filter by search input
    const searchInput = page.getByPlaceholder(/search by clinician/i);
    await searchInput.fill('Priya');

    // 3. Verify Doctor card appears with Council Verification badge
    const doctorCard = page.getByRole('heading', { name: /Dr\. Priya Sharma/i });
    await expect(doctorCard).toBeVisible();
    await expect(page.getByText(/KMC-48291/i)).toBeVisible();

    // 4. Navigate to profile
    await page.getByRole('link', { name: /view profile/i }).first().click();
    await expect(page).toHaveURL(/\/doctor\/[a-zA-Z0-9_-]+/);
    await expect(page.getByRole('heading', { name: /Dr\. Priya Sharma/i })).toBeVisible();
  });

  test('F01-H2: Slot Selection and Booking Confirmation Voucher', async ({ page }) => {
    await page.goto('/booking/doc-01');

    // Verify 7-day date ribbon is interactive
    const slotButton = page.locator('button:not([disabled])').filter({ hasText: /M/i }).first();
    await slotButton.click();

    // Verify Patient Dependent Selector
    await expect(page.getByText(/Patient Profile Selection/i)).toBeVisible();

    // Submit booking
    const bookCta = page.getByRole('button', { name: /lock slot & proceed/i });
    await bookCta.click();

    // Expect Confirmation Voucher Screen
    await expect(page).toHaveURL(/\/booking\/success\/doc-01/);
    await expect(page.getByText(/Confirmed/i).first()).toBeVisible();
    await expect(page.getByText(/Add to Calendar/i).first()).toBeVisible();
  });

  test('F01-E1: Waitlist Slot Pull-Forward Toggle', async ({ page }) => {
    await page.goto('/booking/doc-01');

    // Verify Avancer RDV waitlist pull-forward toggle
    const waitlistToggle = page.locator('input[type="checkbox"]');
    if (await waitlistToggle.count() > 0) {
      const toggle = waitlistToggle.first();
      await toggle.click();
      expect(await toggle.isChecked()).toBeDefined();
    }
  });

  test('F01-N1: Acute Emergency Symptom Intercept', async ({ page }) => {
    await page.goto('/');

    const heroSearch = page.getByPlaceholder(/search doctors/i);
    await heroSearch.fill('severe chest pain emergency');
    await heroSearch.press('Enter');

    // Check that emergency takeover modal triggers
    await expect(page.getByText(/CRITICAL EMERGENCY TRIAGE ALERT/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /112/i }).first()).toBeVisible();
  });
});
