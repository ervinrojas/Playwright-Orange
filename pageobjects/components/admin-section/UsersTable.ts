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

    private async getFirstAdminFromTable(): Promise<Locator> {
        const currentAdminRows = this.getAdminRows()
        const firstAdminToSearch = currentAdminRows.nth(0)
        await expect(firstAdminToSearch, 'No admin users found in the table').toHaveCount(1)
        return firstAdminToSearch
    }

    async editFirstAdminOnTheTable(){
        const firstAdminToEdit = await this.getFirstAdminFromTable()
        await firstAdminToEdit
            .locator('button')
            .filter({has: this.page.locator('i.bi-pencil-fill')}).click()
    }

    async deleteAdminOnTheTable(username:string){
        const allBodyRows = this.getAllBodyRows()
        const filteredRowsByUsername = allBodyRows.filter({
            has: this.page.getByRole('cell').nth(1).getByText(username)
        })
        expect(filteredRowsByUsername, 'No rows contain username: ${username} were found').toHaveCount(1)

        await filteredRowsByUsername
            .locator('button')
            .filter({has: this.page.locator('i.bi-trash')}).click()
    }

    async acceptDeleteUser(){
        await this.page.getByRole('button', {name: /Yes, Delete/}).click()
    }

    async clickCancelDeletion(){
        await this.page.getByRole('button', {name: /No, Cancel/}).click()
    }

    async verifyUserDoesNotExist(username: string) {
        console.log(`Verifying that user '${username}' is NO LONGER in the table...`)
        const userRow = this.getAllBodyRows().filter({
            has: this.page.getByRole('cell').nth(1).getByText(username)
        });
        await expect(userRow, `User '${username}' was not deleted but should have been`).toHaveCount(0);
        console.log(`Verification Successful: User '${username}' was successfully deleted from the table`)
    }
    
    async verifyUserExists(username: string) {
        console.log(`Verifying that user '${username}' is still in the table...`)
        const userRow = this.getAllBodyRows().filter({
            has: this.page.getByRole('cell').nth(1).getByText(username)
        });
        
        // Asegura que haya exactamente 1 fila con ese usuario
        await expect(userRow, `User '${username}' was deleted but should still exist`).toHaveCount(1);
        console.log(`Verification Successful: User '${username}' was not deleted from the table`)
    }

}