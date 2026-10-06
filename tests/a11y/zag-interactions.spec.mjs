import { test, expect } from '@playwright/test';

test('Select updates its displayed value after choosing an option', async ({ page }) => {
  await page.goto('/iframe.html?id=components-forms-select--interactive-selection&viewMode=story');

  const trigger = page.getByRole('combobox', { name: 'Active Toolholder Profile' });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.getByRole('option', { name: 'Inconel 718 Superalloy' }).click();
  await expect(trigger).toContainText('Inconel 718 Superalloy');
});

test('Dialog opens and closes through its close trigger', async ({ page }) => {
  await page.goto('/iframe.html?id=components-feedback-dialog--confirmation-dialog&viewMode=story');

  await page.getByRole('button', { name: 'Open Calibration Confirmation' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Confirm Metrology Calibration' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(dialog).toHaveCount(0);
});
