import { expect, test } from '../../fixtures';
import { roleDropdownOption, UserManagement } from '../../../pageobjects/components/admin-section/UserManagement';

test.describe('Admin User Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/admin/viewSystemUsers');
        await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);
    });

    test('Should retrieve all registered usernames from the users table', async ({ page }) => {
        const userManagement = new UserManagement(page);
        await userManagement.waitForLoaded();

        const usernames = await userManagement.getAllUsernames();

        console.log('Registered usernames:', usernames);
        expect(usernames.length).toBeGreaterThan(0);
        expect(usernames).toContain('Admin');
    });

    test('Check user role options', async ({ page }) => {
        const roleDropdown = new UserManagement(page);
        await roleDropdown.waitForLoaded();

        await roleDropdown.clickUserRoleDropdown();

        const currentUserRoleOptions = await roleDropdown.getUserRoleOptions();
        console.log('Current User Role Options:', currentUserRoleOptions);

        expect(currentUserRoleOptions).toEqual(Object.values(roleDropdownOption));

    });
});
