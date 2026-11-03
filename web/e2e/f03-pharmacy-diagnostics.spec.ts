import { test, expect } from '@playwright/test';

test.describe('Flow F03: E-Pharmacy Orders & At-Home Diagnostics', () => {
  test('F03-H1: Pharmacy Medicine Browsing and Cart Calculation', async ({ page }) => {
    await page.goto('/pharmacy');

    // Verify Pharmacy Header & CDSCO badge
    await expect(page.getByText(/Kaizentrix Certified E-Pharmacy/i)).toBeVisible();

    // Search for Telmisartan
    const searchInput = page.getByPlaceholder(/search by medicine name/i);
    await searchInput.fill('Telma 40');

    // Add to cart
    const addBtn = page.getByRole('button', { name: /Add/i }).first();
    await addBtn.click();

    // Check cart drawer
    await expect(page.getByText(/Medicine Cart/i)).toBeVisible();
    await expect(page.getByText(/Schedule H/i).first()).toBeVisible();
  });

  test('F03-H2: Prescription Upload & Pharmacist Verification Gate', async ({ page }) => {
    await page.goto('/pharmacy/upload');

    // Verify statutory rule notice
    await expect(page.getByText(/Prescription Verification Gateway/i)).toBeVisible();

    // Select prescription from Health Vault
    const vaultItem = page.getByText(/Digital Health Vault/i);
    await vaultItem.click();

    // Place Order
    const placeOrderBtn = page.getByRole('button', { name: /Place Order/i });
    await placeOrderBtn.click();

    // Confirmation
    await expect(page.getByText(/Prescription Verified & Order Confirmed/i)).toBeVisible();
  });

  test('F03-H3: At-Home Diagnostic Health Checkup Booking', async ({ page }) => {
    await page.goto('/diagnostics');

    // Verify NABL badge and test packages
    await expect(page.getByText(/NABL & CAP Accredited/i)).toBeVisible();
    await expect(page.getByText(/Comprehensive Active Health Shield/i)).toBeVisible();

    // Click Book Home Collection
    const bookBtn = page.getByRole('button', { name: /Book Home Collection/i }).first();
    await bookBtn.click();

    // Modal pops up
    await expect(page.getByText(/Schedule Phlebotomist Visit/i)).toBeVisible();
    await expect(page.getByText(/Morning Slot/i)).toBeVisible();

    // Confirm phlebotomist visit
    const confirmBtn = page.getByRole('button', { name: /Confirm Phlebotomist Visit/i });
    await confirmBtn.click();

    await expect(page.getByText(/Sample Collection Scheduled/i)).toBeVisible();
  });
});
