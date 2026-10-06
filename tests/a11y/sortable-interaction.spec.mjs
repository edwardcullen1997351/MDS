import { test, expect } from '@playwright/test';

for (const activationKey of ['Enter', 'Space']) {
  test(`SortableCollection reorders with ${activationKey}`, async ({ page }) => {
    await page.goto('/iframe.html?id=composites-sortablecollection--default&viewMode=story');

    const collection = page.getByRole('list', { name: 'Sequence' });
    const items = collection.locator('.ds-sortable-item');
    const firstHandle = items.first().getByRole('button', { name: /Reorder OP-10/ });

    await firstHandle.focus();
    await page.keyboard.press(activationKey);
    await expect(items.first()).toHaveAttribute('aria-grabbed', 'true');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press(activationKey);

    await expect(items.first()).toContainText('OP-20');
    await expect(items.nth(1)).toContainText('OP-10');
    await expect(items.nth(1)).toHaveAttribute('aria-grabbed', 'false');
  });
}
