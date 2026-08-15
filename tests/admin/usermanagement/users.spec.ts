import { expect, test } from '../../fixtures';
import { roleDropdownOption, statusDropdownOption, UserManagement } from '../../../pageobjects/components/admin-section/UserManagement';
import { UsersTable } from '../../../pageobjects/components/admin-section/UsersTable';
import { UserFactory } from '../../../factory/UserFactory'

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
        
        const addUser = new UserManagement(page);
        await addUser.waitForLoaded();

        const ESSUser = UserFactory.createEmployeeESS({
            role: 'ESS'
        })

        await addUser.AddNewUser(ESSUser)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')

    });

    test('Add new Admin user', async ({ page }) => {

        const userManagement = new UserManagement(page);
        await userManagement.waitForLoaded();

        const adminUser = UserFactory.createAdmin({
            role: 'Admin'
        })

        await userManagement.AddNewUser(adminUser)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    });

    test('Add new ESS user Password do not match', async ({ page }) => {

        const userManagement = new UserManagement(page);
        await userManagement.waitForLoaded();

        const ESSUser = UserFactory.createEmployeeESS({
            confirmpassword: 'PasswordDoNotMatch'
        })

        await userManagement.AddNewUser(ESSUser)
        await expect(page.locator('span.oxd-input-field-error-message')).toHaveText('Passwords do not match')
    });

    test('Add new ESS user - Disabled status', async ({ page }) => {

        const userManagement = new UserManagement(page);
        await userManagement.waitForLoaded();

        const ESSUser = UserFactory.createEmployeeESS({
            status: 'Disabled'
        })

        await userManagement.AddNewUser(ESSUser)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    });

    test('Add new Admin user - with Admin employee', async ({ page }) => {

        const addUser = new UsersTable(page);
        await addUser.editFirstAdminOnTheTable()

        const addNewUserPage = new UserManagement(page)
        const fullUserToSearch = await addNewUserPage.getEmployeeName()

        const Adminser = UserFactory.createAdmin({
            employee: fullUserToSearch
        })

        await page.goBack()
        await addNewUserPage.AddNewUser(Adminser)
        await expect(page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    });



});
