import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageobjects/pages/LoginPage';

test('Failure Login Test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login('wrong_user', 'wrong_password');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
});