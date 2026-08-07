import { test, expect } from '../../fixtures';
import { SidePanel, SideMenuOptions } from '../../../pageobjects/components/sidebar-menu/SidePanel';

test.describe('Admin Side-Panel Options', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index');
        await expect(page).toHaveURL(/\/dashboard\/index/);
    });

    test('Should validate all expected menus are visible for Admin', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.waitForLoaded();

        const visibleMenus = await sidePanel.getAllVisibleTexts();

        const expectedAdminMenus = [
            SideMenuOptions.ADMIN,
            SideMenuOptions.PIM,
            SideMenuOptions.LEAVE,
            SideMenuOptions.TIME,
            SideMenuOptions.RECRUITMENT,
            SideMenuOptions.MY_INFO,
            SideMenuOptions.PERFORMANCE,
            SideMenuOptions.DASHBOARD,
            SideMenuOptions.DIRECTORY,
            SideMenuOptions.MAINTENANCE,
            SideMenuOptions.CLAIM,
            SideMenuOptions.BUZZ,
        ];

        for (const expectedMenu of expectedAdminMenus) {
            expect(visibleMenus).toContain(expectedMenu);
        }
    });

    test('Should navigate to Leave module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.LEAVE);
        await expect(page).toHaveURL(/\/leave\/viewLeaveList/);
    });

    test('Should navigate to Time module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.TIME);
        await expect(page).toHaveURL(/\/time\/viewEmployeeTimesheet/);
    });

    test('Should navigate to My Info module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.MY_INFO);
        await expect(page).toHaveURL(/\/(pim\/)?viewPersonalDetails\/empNumber/);
    });

    test('Should navigate to Performance module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.PERFORMANCE);
        await expect(page).toHaveURL(/\/performance\/searchEvaluatePerformanceReview/);
    });

    test('Should navigate to Dashboard module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.DASHBOARD);
        await expect(page).toHaveURL(/\/dashboard\/index/);
    });

    test('Should navigate to Directory module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.DIRECTORY);
        await expect(page).toHaveURL(/\/directory\/viewDirectory/);
    });

    test('Should navigate to Claim module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.CLAIM);
        await expect(page).toHaveURL(/\/claim\/viewAssignClaim/);
    });

    test('Should navigate to Buzz module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.BUZZ);
        await expect(page).toHaveURL(/\/buzz\/viewBuzz/);
    });
});