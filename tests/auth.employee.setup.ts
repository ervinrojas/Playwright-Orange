import fs from 'fs';
import { test as setup, expect, chromium, Page } from '@playwright/test';
import { LoginPage } from '../pageobjects/pages/LoginPage';
import { Environment } from '../config/environment';

// Copiamos la misma función auxiliar aquí (En TS no hay herencia múltiple fácil para setups)
async function validateAndRegenerateState(page: Page, role: string, authFilePath: string, loginAction: (loginPage: LoginPage) => Promise<void>, validationAction: (pageToValidate: Page) => Promise<void>) {
    if (fs.existsSync(authFilePath)) {
        console.log(`[Setup] ${role}: Auth file found. Validating session...`);
        const browser = await chromium.launch({ headless: true });
        const tempContext = await browser.newContext({ storageState: authFilePath });
        const tempPage = await tempContext.newPage();
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

setup('Authentication as Employee', async ({ page }) => {
    await validateAndRegenerateState(
        page, 'Employee', '.auth/employee.json',
        (loginPage) => loginPage.login(Environment.EMPLOYEE_USERNAME, Environment.EMPLOYEE_PASSWORD),
        (pg) => expect(pg.getByRole('link', { name: 'Admin' })).toBeHidden()
    );
});