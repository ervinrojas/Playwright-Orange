import { expect, Locator, Page } from "@playwright/test";

export class UsersTable {

    private readonly page: Page;
   
    constructor(page: Page){
        this.page = page
    }

    private getAllBodyRows(): Locator {
        return this.page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    }

    private getAdminRows(): Locator {
        const allBodyRows = this.getAllBodyRows()
        const currentAdminRows = allBodyRows.filter({
            has: this.page.getByRole('cell').nth(2).getByText('Admin')
        })
        return currentAdminRows
    }

    private async getgetFirstAdminFromTable(): Promise<Locator> {
        const currentAdminRows = this.getAdminRows()
        const firstAdminToSearch = currentAdminRows.nth(0)
        await expect(firstAdminToSearch, 'No admin users found in the table').toHaveCount(1)
        return firstAdminToSearch
    }

    async editFirstAdminOnTheTable(){
        const firstAdminToEdit = await this.getgetFirstAdminFromTable()
        await firstAdminToEdit
            .locator('button')
            .filter({has: this.page.locator('i.bi-pencil-fill')}).click()
    }


}