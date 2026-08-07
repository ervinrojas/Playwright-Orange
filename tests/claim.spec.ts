import {test, expect} from '@playwright/test'

test('Capture all amounts', async ({ page}) =>{
    await page.goto('/web/index.php/claim/viewAssignClaim')

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    await expect(allBodyRows.first()).toBeVisible()
    const amounts: number[] = []

    const rowCount = await allBodyRows.count()
    console.log('Number of rows: ', rowCount)

    for(let i=0; i<rowCount; i++){
        const amountCell = allBodyRows.nth(i).getByRole('cell').nth(7)
        const amountText = await amountCell.textContent()
        console.log('This is the amount in text: ', amountText)

        if(amountText === null){
            continue
        }

        const convertedNumber = parseFloat(amountText?.replace(/,/g,'').trim())
        amounts.push(convertedNumber)
    }
    console.log(amounts)

    let total = 0
    
    for(let amount of amounts){
        total += amount
    }

    
    console.log('Total is: ', total)

})