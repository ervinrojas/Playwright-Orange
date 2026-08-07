import { test, expect } from '../../fixtures'; 
import { SidePanel, SideMenuOptions } from '../../../pageobjects/components/sidebar-menu/SidePanel';

test.describe('Employee Side-Panel Options', () => {
    
    test('Should validate all expected menus are visible for Employee', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.waitForLoaded();

        const visibleMenus = await sidePanel.getAllVisibleTexts();

        const expectedEmployeeMenus = [
            SideMenuOptions.LEAVE, 
            SideMenuOptions.TIME, 
            SideMenuOptions.MY_INFO, 
            SideMenuOptions.PERFORMANCE, 
            SideMenuOptions.DASHBOARD, 
            SideMenuOptions.DIRECTORY, 
            SideMenuOptions.CLAIM, 
            SideMenuOptions.BUZZ
        ];

        // 3. Validación
        for (const expectedMenu of expectedEmployeeMenus) {
            expect(visibleMenus).toContain(expectedMenu);
        }
    });

    test('Should navigate to Leave module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.LEAVE);
        await expect(page).toHaveURL(/\/leave\/viewMyLeaveList/);
    });

    test('Should navigate to Time module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.TIME);
        await expect(page).toHaveURL(/\/time\/viewMyTimesheet/);
    });

    test('Should navigate to My Info module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.MY_INFO);
        await expect(page).toHaveURL(/\/viewPersonalDetails\/empNumber/);
    });
    
    test('Should navigate to Performance module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.PERFORMANCE);
        await expect(page).toHaveURL(/\/performance\/myPerformanceReview/);
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
        await expect(page).toHaveURL(/\/claim\/viewClaim/);
    });

    test('Should navigate to Buzz module', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.clickMenu(SideMenuOptions.BUZZ);
        await expect(page).toHaveURL(/\/buzz\/viewBuzz/);
    });

});