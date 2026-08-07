import { test, expect } from '../../fixtures';
import { SidePanel, SideMenuOptions } from '../../../pageobjects/components/sidebar-menu/SidePanel';

test.describe('Employee Side-Panel Options', () => {
    const expectedEmployeeMenus = [
        SideMenuOptions.LEAVE,
        SideMenuOptions.TIME,
        SideMenuOptions.MY_INFO,
        SideMenuOptions.PERFORMANCE,
        SideMenuOptions.DASHBOARD,
        SideMenuOptions.DIRECTORY,
        SideMenuOptions.CLAIM,
        SideMenuOptions.BUZZ,
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index');
        await expect(page).toHaveURL(/\/dashboard\/index/);
    });

    test('Should validate all expected menus are visible for Employee', async ({ page }) => {
        const sidePanel = new SidePanel(page);
        await sidePanel.waitForLoaded();

        const visibleMenus = await sidePanel.getAllVisibleTexts();
        expect(visibleMenus).toEqual(expect.arrayContaining(expectedEmployeeMenus));
    });

    const menuCases = [
        { option: SideMenuOptions.LEAVE, route: /\/leave\/viewMyLeaveList/ },
        { option: SideMenuOptions.TIME, route: /\/time\/viewMyTimesheet/ },
        { option: SideMenuOptions.MY_INFO, route: /\/pim\/viewPersonalDetails\/empNumber/ },
        { option: SideMenuOptions.PERFORMANCE, route: /\/performance\/myPerformanceReview/ },
        { option: SideMenuOptions.DASHBOARD, route: /\/dashboard\/index/ },
        { option: SideMenuOptions.DIRECTORY, route: /\/directory\/viewDirectory/ },
        { option: SideMenuOptions.CLAIM, route: /\/claim\/viewClaim/ },
        { option: SideMenuOptions.BUZZ, route: /\/buzz\/viewBuzz/ },
    ];

    for (const { option, route } of menuCases) {
        test(`Should navigate to ${option} module`, async ({ page }) => {
            const sidePanel = new SidePanel(page);
            await sidePanel.clickMenu(option);
            await page.waitForURL(route, { timeout: 20000 });
            await expect(page).toHaveURL(route);
        });
    }
});