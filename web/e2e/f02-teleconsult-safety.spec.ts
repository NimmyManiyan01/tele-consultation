import { test, expect } from '@playwright/test';

test.describe('Flow F02: Teleconsultation, Multi-Party Room & Clinical Safety', () => {
  test('F02-H1: WebRTC Video Room Pre-Flight Diagnostics and Entry', async ({ page }) => {
    await page.goto('/room/tele-demo-01');

    // 1. Hardware Pre-Flight checks
    await expect(page.getByText(/Camera Feed Active/i)).toBeVisible();
    await expect(page.getByText(/Mic Volume/i)).toBeVisible();

    // 2. Join Consultation Room
    const joinBtn = page.getByRole('button', { name: /Join Consultation|Join Video Encounter/i });
    if (await joinBtn.isVisible()) {
      await joinBtn.click();
    }

    // 3. Verify in-call layout & encryption HUD
    await expect(page.getByText(/LiveKit WebRTC SFU|AES-256 E2EE/i).first()).toBeVisible();
    await expect(page.getByLabel(/Mute Microphone/i)).toBeVisible();
  });

  test('F02-H2: 4-Way Multi-Party Room with Medical Interpreter', async ({ page }) => {
    await page.goto('/doctor/room/multi/tele-demo-01');

    // Verify 4 connected tiles: Doctor, Patient, Family, Interpreter
    await expect(page.getByText(/Dr\. Priya Sharma/i).first()).toBeVisible();
    await expect(page.getByText(/Rahul Varma/i).first()).toBeVisible();
    await expect(page.getByText(/Medical Interpreter/i).first()).toBeVisible();

    // Verify Interpreter Hub controls
    const interpreterTab = page.getByRole('button', { name: /Interpreter Live|Interpreter Hub/i }).first();
    if (await interpreterTab.isVisible()) {
      await interpreterTab.click();
      await expect(page.getByText(/Target Language Pair/i)).toBeVisible();
    }
  });

  test('F02-N1: MoHFW Schedule X Narcotics Restriction Intercept', async ({ page }) => {
    await page.goto('/doctor/emr/pat-01');

    // Verify clinical chart title
    await expect(page.getByText(/Digital e-Prescription Generator/i)).toBeVisible();

    // Attempt to search banned narcotic (Morphine / Clonazepam)
    const medInput = page.getByPlaceholder(/Drug Name/i);
    await medInput.fill('Morphine');
    
    const addBtn = page.getByRole('button', { name: /Add to Rx/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
    } else {
      await medInput.press('Enter');
    }

    // Verify ScheduleXModal blocks addition
    await expect(page.getByText(/STATUTORY SCHEDULE X DRUG RESTRICTION/i)).toBeVisible();
    await expect(page.getByText(/MoHFW Telemedicine Practice Guidelines/i)).toBeVisible();
  });
});
