import {expect, test} from '../../fixtures';
import {Claim} from '../../../pageobjects/components/claim-section/Claim';

test.describe('Claim Section', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/web/index.php/claim/viewAssignClaim');
        await expect(page).toHaveURL(/\/claim\/viewAssignClaim/);
    });

    test('Should retrieve all claim IDs from the claims table', async ({page}) => {
        const claim = new Claim(page);
        await claim.waitForLoaded();
        const claimIDs = await claim.getAllClaimIDs();

        let total=0;
        for (const amount of claimIDs) {
            total += amount;
        }
        console.log('Total of all claim amounts:', total);
    });
});