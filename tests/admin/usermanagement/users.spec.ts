import { expect, test } from '../../fixtures';
import { roleDropdownOption, statusDropdownOption, UserManagement } from '../../../pageobjects/components/admin-section/UserManagement';
import { UserModel } from '../../../models/UserModel';

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

    test('Check user status options', async ({ page }) => {
        const statusDropdown = new UserManagement(page);
        await statusDropdown.waitForLoaded();

        await statusDropdown.clickUserStatusDropdown();

        const currentUserStatusOptions = await statusDropdown.getUserStatusOptions();
        console.log('Current User Status Options:', currentUserStatusOptions);

        expect(currentUserStatusOptions).toEqual(Object.values(statusDropdownOption));

    });

    test('Add new ESS user', async ({ page }) => {
        
        const randomUsername = 'User' + crypto.randomUUID();
        const password = 'R4nD0m45..*';
        const employeeToSearch = 'Qwerty LName';
        
        const addUser = new UserManagement(page);
        await addUser.waitForLoaded();

        const userToAdd:UserModel = {
            username: randomUsername,
            employee: employeeToSearch,
            password: password,
            confirmpassword: password,
        }

        await addUser.AddNewESSUser(userToAdd)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')

    });

    test('Add new Admin user', async ({ page }) => {
        
        const randomUsername = 'User' + crypto.randomUUID();
        const password = 'R4nD0m45..*';
        const employeeToSearch = 'Qwerty LName';

        const userManagement = new UserManagement(page);
        await userManagement.waitForLoaded();

        const userToAdd:UserModel = {
            username: randomUsername,
            employee: employeeToSearch,
            password: password,
            confirmpassword: password,
        }

        await userManagement.AddNewAdminUser(userToAdd)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    });
});
