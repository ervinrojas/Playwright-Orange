import { Locator, Page } from '@playwright/test';

export class UserManagement {
    private readonly page: Page;
    private readonly userManagementContainer: Locator;
    private readonly userOption: Locator;
    private readonly usersTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userManagementContainer = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management');
        this.userOption = page.getByRole('menuitem', { name: 'Users' });
        this.usersTable = page.getByRole('table');
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
}