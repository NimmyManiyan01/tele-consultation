import { test, expect } from '@playwright/test';

test.describe('Flow F04: ABDM National Health ID, FHIR EHR & Rural Spoke', () => {
  test('F04-H1: ABDM National Health ID (ABHA) Aadhaar OTP Verification', async ({ page }) => {
    await page.goto('/auth/national');

    // Input Step
    await expect(page.getByText(/National Health ID Gateway/i)).toBeVisible();
    const otpReqBtn = page.getByRole('button', { name: /Request Aadhaar OTP/i });
    await otpReqBtn.click();

    // OTP Step
    await expect(page.getByText(/Enter Verification Code/i)).toBeVisible();
    const verifyBtn = page.getByRole('button', { name: /Verify & Link ABHA Account/i });
    await verifyBtn.click();

    // Verified Step
    await expect(page.getByText(/ABDM Verified/i)).toBeVisible();
    await expect(page.getByText(/Federated Health Facilities/i)).toBeVisible();
  });

  test('F04-H2: SMART-on-FHIR Embedded Hospital EHR Launch', async ({ page }) => {
    await page.goto('/ehr/embedded');

    // Verify Hospital EHR container header
    await expect(page.getByText(/SmartEHR™ Clinical Workstation/i)).toBeVisible();
    await expect(page.getByText(/FHIR R4 Bridge Connected/i)).toBeVisible();

    // CDS Hooks trigger
    await expect(page.getByText(/CDS Hooks v1\.0/i)).toBeVisible();

    // Commit SOAP note button
    const commitBtn = page.getByRole('button', { name: /Commit SOAP Note to Hospital EHR/i });
    await commitBtn.click();
    await expect(page.getByText(/FHIR R4 Bundle Committed/i)).toBeVisible();
  });

  test('F04-H3: Assisted Rural Spoke Clinic & Bluetooth Sensor Sync', async ({ page }) => {
    await page.goto('/spoke/triage');

    // Verify Spoke Header
    await expect(page.getByText(/Ayushman Arogya Mandir/i)).toBeVisible();
    await expect(page.getByText(/KA-BLR-SPK-014/i)).toBeVisible();

    // Sync Bluetooth sensors
    const syncBtn = page.getByRole('button', { name: /Sync Bluetooth Sensors/i });
    await syncBtn.click();
    await expect(page.getByText(/Hardware Synced/i)).toBeVisible();

    // Generate Dispensary Voucher
    const voucherBtn = page.getByRole('button', { name: /Generate Dispensary Voucher/i });
    await voucherBtn.click();
    await expect(page.getByText(/Govt Sub-Centre Essential Drug Dispensary Voucher/i)).toBeVisible();
  });
});

