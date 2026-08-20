import {test, expect} from '@playwright/test';
import { LoginPage } from '../pageobjects/pages/LoginPage';
import { SideMenuOptions, SidePanel } from '../pageobjects/components/sidebar-menu/SidePanel';
import { request } from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs';


test('Get all usernames registered', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('admin', 'admin123')

  await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()
  await page.getByRole('link', {name: 'Admin'}).click()

  await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('User Management').click()
  await page.getByRole('menuitem', {name: 'Users'}).click()

  const tableBody = page.locator('.oxd-table-body')
  await expect(tableBody.locator('.oxd-table-row').first()).toBeVisible()

  const rows = tableBody.locator('.oxd-table-row')
  //const rows = page.getByRole('table').getByRole('row')
  const usernames: string[] = []
  const empnames: string[] = []
  const rowCount = await rows.count()

  for (let i = 0; i < rowCount; i++) {
    const cell = rows.nth(i).locator('.oxd-table-cell').nth(1)
    const cellemp = rows.nth(i).locator('.oxd-table-cell').nth(3)
    const username = (await cell.innerText()).trim() 
    const empname = (await cellemp.innerText()).trim()
    if (username) {
      usernames.push(username)
    }
    if (empname) {
      empnames.push(empname)
    }
  }
  console.log('Usernames', usernames, 'Employee Name:', empnames)
  console.log(`Total usernames found: ${usernames.length}`)
})

test('Select specific user for edition', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.login('admin', 'admin123')

    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()
    await page.getByRole('link', {name: 'Admin'}).click()

    await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('User Management').click()
    await page.getByRole('menuitem', {name: 'Users'}).click()   

    await expect(page.locator('.oxd-table-body .oxd-table-row').first()).toBeVisible()

    const allRows = page.locator('.oxd-table-body .oxd-table-row')
    const rowCount = await allRows.count()
    const validUsers : {index: number, username: string}[] = []

    for (let i = 0; i < rowCount; i++) {
        const usernameText = (await allRows.nth(i).locator('.oxd-table-cell').nth(1).innerText()).trim()
        if (usernameText && usernameText !== 'Admin') {
            validUsers.push({index: i, username: usernameText})
        }
    }

    expect(validUsers.length).toBeGreaterThan(0)

    const randomIndex = Math.floor(Math.random() * validUsers.length)
    const selectedUser = validUsers[randomIndex]
    console.log(`Selected user for edition: ${selectedUser.username} at index ${selectedUser.index}`)
    
    const pencilToEdit = page
        .getByRole('table')
        .getByRole('row')
        .nth(selectedUser.index)
        .locator('button')
        .filter({has: page.locator('i.bi-pencil-fill')})

        await pencilToEdit.click()

        await expect(page.locator(".oxd-form")).toBeVisible()

        const randomUsername = `EditedUser_${Math.floor(Math.random() * 10000)}`
        await page.locator("//label[contains(.,'Username')]/parent::div/following-sibling::div/input").fill(randomUsername)
        await page.getByRole('button', {name: 'Save'}).click()

        try {
            await expect(page.getByText('Successfully Updated')).toBeVisible({timeout: 5000})
            console.log(`Toast message after saving: Success`)

            await expect(page.locator('.oxd-table-body .oxd-table-row').first()).toBeVisible()
            await expect(page.getByRole('table')).toBeVisible()
        }catch (error) {
            const errorMessage = await page.locator('.oxd-text.oxd-text--p.oxd-text--toast-message').textContent().catch(() => 'No error message found')
            console.error(`Error while saving the user: ${error}`)
            throw error
        }

        //const currentUsername = await page.locator("//label[contains(.,'Username')]/parent::div/following-sibling::div/input").inputValue()
    
        //await expect(currentUsername).toEqual(userForEdition)

})

test('Check user role options', async ({ page }) => {
  
    const expectedRoleOption = ['-- Select --', 'Admin', 'ESS']
  
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)

    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    console.log('Current User Role Options:', currentUserRoleOptions)

    expect(currentUserRoleOptions).toEqual(expectedRoleOption)

})

test('User role options do not match', async ({ page }) => {
  
    const expectedRoleOption = ['-- Select --', 'Admin', 'ESS','Pepe']
  
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)

    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    console.log('Current User Role Options:', currentUserRoleOptions)

    expect(currentUserRoleOptions, 'The options displayed in the user role dropdown do not match the espected options').toEqual(expectedRoleOption)

})

test('Check user status options', async ({ page }) => {
  
    const expectedUserStatusOptions = ['-- Select --', 'Enabled', 'Disabled']
  
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)

    await page.locator("//label[contains(.,'Status')]/parent::div/following-sibling::div").click()
    const currentUserStatusOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()
    console.log('Current User Status Options:', currentUserStatusOptions)

    expect(currentUserStatusOptions).toEqual(expectedUserStatusOptions)

})

test('Filter by user admin', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')

    await expect(allBodyRows.first()).toBeVisible()
    
    const rowCount = await allBodyRows.count()
    let expectedAdminCount = 0
    for (let i=0; i < rowCount; i++){
      const text = await allBodyRows.nth(i).getByRole('cell').nth(2).textContent()
      if (text?.trim().includes('Admin')) expectedAdminCount++
    }
    
    console.log('Admin users before filtering: ', expectedAdminCount)

    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    await page.getByRole("listbox").getByRole("option", {name: 'Admin'}).click()
    await page.getByRole('button', {name: 'Search'}).click()

    await expect(allBodyRows).toHaveCount(expectedAdminCount)

    for(let i=0; i<expectedAdminCount; i++){
      await expect(allBodyRows.nth(i).getByRole('cell').nth(2)).toContainText('Admin')
    }
})


