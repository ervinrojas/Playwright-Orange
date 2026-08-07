import fs from 'fs';
import { test as setup, expect, chromium, Page } from '@playwright/test';
import { LoginPage } from '../pageobjects/pages/LoginPage';
import { Environment } from '../config/environment';

async function validateAndRegenerateState(page: Page, role: string, authFilePath: string, loginAction: (loginPage: LoginPage) => Promise<void>, validationAction: (pageToValidate: Page) => Promise<void>) {
    fs.mkdirSync('.auth', { recursive: true });

    if (fs.existsSync(authFilePath)) {
        console.log(`[Setup] ${role}: Auth file found. Validating session...`);
        const browser = await chromium.launch({ headless: true });
        const tempContext = await browser.newContext({ storageState: authFilePath });
        const tempPage = await tempContext.newPage();

        // Aumentamos el timeout solo para esta validación en segundo plano
        await tempPage.goto(`${Environment.BASE_URL}/web/index.php/dashboard/index`, { timeout: 60000 });

        if (!tempPage.url().includes('auth/login')) {
            console.log(`[Setup] ${role}: Session is still VALID. Skipping login.`);
            await browser.close();
            return;
        }
        console.log(`[Setup] ${role}: Session EXPIRED. Deleting old file...`);
        await browser.close();
        fs.unlinkSync(authFilePath);
    }

    console.log(`[Setup] ${role}: Performing login...`);
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginAction(loginPage);
    await validationAction(page);
    await page.context().storageState({ path: authFilePath });
    console.log(`[Setup] ${role}: Auth file regenerated successfully.`);
}

setup('Authentication as Admin', async ({ page }) => {
    await validateAndRegenerateState(
        page, 'Admin', '.auth/admin.json',
        (loginPage) => loginPage.login(Environment.ADMIN_USERNAME, Environment.ADMIN_PASSWORD),
        (pg) => expect(pg.getByRole('link', { name: 'Admin' })).toBeVisible()
    );
});