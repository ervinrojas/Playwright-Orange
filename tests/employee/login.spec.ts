import { test, expect } from '@playwright/test';

test('Successful Login as Employee', async ({ page }) => {
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(page.getByRole('link', { name: 'Admin' })).toBeHidden();
});