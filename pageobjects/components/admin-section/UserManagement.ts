import { Locator, Page } from '@playwright/test';

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

    constructor(page: Page) {
        this.page = page;
        this.userManagementContainer = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management');
        this.userOption = page.getByRole('menuitem', { name: 'Users' });
        this.usersTable = page.getByRole('table');
        this.userRoleDropdown = page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div");
        this.roleOptions = page.getByRole('listbox').getByRole('option')
    }

    async waitForLoaded() {
        await this.userManagementContainer.waitFor({ state: 'visible' });
    }

    async clickUserManagement() {
        await this.userManagementContainer.waitFor({ state: 'visible' });
        await this.userManagementContainer.click();
    }

    async clickUserOption() {
        await this.userOption.waitFor({ state: 'visible' });
        await this.userOption.click();
    }

    async clickUserRoleDropdown() {
        await this.userRoleDropdown.waitFor({ state: 'visible' });
        await this.userRoleDropdown.click();
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
}