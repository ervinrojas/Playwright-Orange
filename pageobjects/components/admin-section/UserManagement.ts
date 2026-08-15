import { expect, Locator, Page } from '@playwright/test';
import { UserModel } from '../../../models/UserModel';

export enum roleDropdownOption {
    SELECT = '-- Select --',
    ADMIN = 'Admin',
    ESS = 'ESS'
}

export enum statusDropdownOption {
    SELECT = '-- Select --',
    ADMIN = 'Enabled',
    ESS = 'Disabled'
}


export class UserManagement {
    private readonly page: Page;
    private readonly userManagementContainer: Locator;
    private readonly userOption: Locator;
    private readonly usersTable: Locator;
    private readonly userRoleDropdown: Locator;
    private readonly roleOptions: Locator;
    private readonly userStatusDropdown: Locator;
    private readonly statusOptions: Locator;
    private readonly addUserButton: Locator;
    private readonly userRoleDropdownOption: Locator;
    private readonly employeeNameInput: Locator;
    private readonly userStatusDropdownOption: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly cpasswordInput: Locator;
    private readonly saveButton: Locator;
    private readonly passwordDontMatch: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userManagementContainer = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management');
        this.userOption = page.getByRole('menuitem', { name: 'Users' });
        this.usersTable = page.getByRole('table');
        this.userRoleDropdown = page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div");
        this.roleOptions = page.getByRole('listbox').getByRole('option');
        this.userStatusDropdown = page.locator("//label[contains(.,'Status')]/parent::div/following-sibling::div");
        this.statusOptions = page.getByRole('listbox').getByRole('option');
        this.addUserButton = page.getByText('Add');
        this.userRoleDropdownOption = page.locator('div.oxd-grid-item--gutters').filter({ has: page.getByText('User Role') }).locator('div.oxd-select-text-input');
        
        this.employeeNameInput = page.getByRole('textbox', {name: 'Type for hints...'});
        
        this.userStatusDropdownOption = page.locator('div.oxd-grid-item--gutters').filter({ has: page.getByText('Status', {exact:true}) }).locator('div.oxd-select-text-input');
        
        this.usernameInput = page.locator('div.oxd-grid-item--gutters').filter({ has: page.getByText('Username', {exact: true}) }).getByRole('textbox');
        this.passwordInput = page.locator('div.oxd-grid-item--gutters').filter({ has: page.getByText('Password', {exact: true}) }).getByRole('textbox');
        this.cpasswordInput = page.locator('div.oxd-grid-item--gutters').filter({ has: page.getByText('Confirm Password', {exact: true}) }).getByRole('textbox');
        this.saveButton = page.getByRole('button', {name: 'Save'});
        this.passwordDontMatch = page.locator('span.oxd-input-field-error-message').getByText('Passwords do not match', {exact:true});
    }

    async waitForLoaded() {
        await this.userManagementContainer.waitFor({ state: 'visible' });
    }

    async clickUserManagement() {
        await this.userManagementContainer.click();
    }

    async clickUserOption() {
        await this.userOption.click();
    }

    async clickUserRoleDropdown() {
        await this.userRoleDropdown.click();
    }

    async clickUserStatusDropdown() {
        await this.userStatusDropdown.click();
    }

    async getAllUsernames(): Promise<string[]> {
        const rows = this.usersTable.getByRole('row');
        await rows.first().waitFor({ state: 'visible' });

        const usernames: string[] = [];
        const rowCount = await rows.count();

        for (let i = 1; i < rowCount; i++) {
            const cell = rows.nth(i).getByRole('cell').nth(1);
            const username = await cell.textContent();
            if (username && username.trim().length > 0) {
                usernames.push(username.trim());
                console.log(`Username: ${username.trim()}`);
            }
        }

        return usernames;
    }

    async getUserRoleOptions(): Promise<string[]> {
        await this.roleOptions.first().waitFor({ state: 'visible' });
        const count = await this.roleOptions.count();
        const options: string[] = [];

        for (let i = 0; i < count; i++) {
            const optionText = await this.roleOptions.nth(i).textContent();
            if (optionText && optionText.trim().length > 0) {
                options.push(optionText.trim());
            }
        }

        return options;
    }

    async getUserStatusOptions(): Promise<string[]> {
        await this.statusOptions.first().waitFor({ state: 'visible' });
        const count = await this.statusOptions.count();
        const options: string[] = [];

        for (let i = 0; i < count; i++) {
            const optionText = await this.statusOptions.nth(i).textContent();
            if (optionText && optionText.trim().length > 0) {
                options.push(optionText.trim());
            }
        }

        return options;
    }
    
    async clickAddUserButton() {
        await this.addUserButton.click();
    }

    async selectUserRole(userRole: string){
        await this.userRoleDropdownOption.click();
        await this.page.getByRole('option', {name: userRole}).click();
    }

    async fillEmployeeToSearch(name: string){
        await this.employeeNameInput.click();
        await this.employeeNameInput.fill(name);
        await this.page.getByText(name, {exact:true}).click();
    }

    async fillUserStatusEnabled(status: string){
        await this.userStatusDropdownOption.click();
        await this.page.getByText(status, {exact:true}).click();
    }

    async fillUsernameInput(username: string){
        await this.usernameInput.fill(username);
    }

    async fillPasswordInput(password: string){
        await this.passwordInput.fill(password);
    }

    async fillConfirmPasswordInput(password: string){
        await this.cpasswordInput.fill(password);
    }

    async clickSaveButton(){
        await this.saveButton.click();
    }

    async AddNewUser(user: UserModel){
        await this.clickAddUserButton();
        await this.selectUserRole(user.role);
        await this.fillEmployeeToSearch(user.employee);
        await this.fillUserStatusEnabled(user.status);
        await this.fillUsernameInput(user.username);
        await this.fillPasswordInput(user.password);
        await this.fillConfirmPasswordInput(user.confirmpassword);
        await this.clickSaveButton();
    }

    async getEmployeeName(): Promise<string>{
        const employeeInput = await this.page.getByRole('textbox', {name: 'Type for hints...'})
        await expect(employeeInput).not.toBeEmpty()
        const fullUserToSearch = await employeeInput.inputValue();
        console.log(`User to search ${fullUserToSearch}`)
        return fullUserToSearch
    }

}