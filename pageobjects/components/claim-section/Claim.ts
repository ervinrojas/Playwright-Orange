import {Locator, Page} from "@playwright/test";

export class Claim {
    private readonly page: Page;
    private readonly allBodyRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');

    }

    async waitForLoaded() {
        await this.allBodyRows.first().waitFor({state: 'visible'});
    }

    async getAllClaimIDs(): Promise<number[]> {
        const amounts: number[] = [];
        const rowCount = await this.allBodyRows.count();
        for (let i = 0; i < rowCount; i++) {
            const amountCell = await this.allBodyRows.nth(i).getByRole('cell').nth(7);
            const amountText = await amountCell.textContent();
            console.log(`Row ${i + 1} Amount:`, amountText);

            if (amountText === null) {
                console.warn(`Row ${i + 1} has no amount text.`);
                continue;
            }
            const convertedAmount = parseFloat(amountText.replace(/[^0-9.-]+/g, '').trim());

            if (!isNaN(convertedAmount)) {
                amounts.push(convertedAmount);
            } else {
                console.warn(`Row ${i + 1} has an invalid amount:`, amountText);
            }
        }
        return amounts;
    }
}
