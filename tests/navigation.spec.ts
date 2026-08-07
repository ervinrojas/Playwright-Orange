import {test, expect} from '@playwright/test';
import { LoginPage } from '../pageobjects/pages/LoginPage';
import { SideMenuOptions, SidePanel } from '../pageobjects/components/sidebar-menu/SidePanel';
import { TopBarMenu } from '../components/top-bar-menu/TopBarMenu';

test('Check left menu options', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.doLogin('admin', 'admin123')

    const sidePanel = new SidePanel(page)
    const actualOptions = await sidePanel.getMenuOptions()
    console.log('Left menu options:', actualOptions)
    expect(actualOptions).toEqual(SidePanel.EXPECTED_MENU_ITEMS)        
})

test('Navigate through left menu', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.doLogin('admin', 'admin123')

    const sidePanel = new SidePanel(page)
    const menuOptions = await sidePanel.getMenuOptions()
    await sidePanel.navigateToMenuOption(menuOptions)
})


test('Click SidePanel options', async ({ page }) => {
    await page.goto('/web/index.php/dashboard/index')
    
    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)
    await sidePanel.clickMenuOption(SideMenuOptions.PIM)
    await sidePanel.clickMenuOption(SideMenuOptions.LEAVE)
    await sidePanel.clickMenuOption(SideMenuOptions.TIME)
    await sidePanel.clickMenuOption(SideMenuOptions.RECRUITMENT)
    await sidePanel.clickMenuOption(SideMenuOptions.MY_INFO)
    await sidePanel.clickMenuOption(SideMenuOptions.PERFORMANCE)
    await sidePanel.clickMenuOption(SideMenuOptions.DASHBOARD)
    await sidePanel.clickMenuOption(SideMenuOptions.DIRECTORY)
    await sidePanel.clickMenuOption(SideMenuOptions.MAINTENANCE)
    await page.goBack() // Navigate back to the previous page before clicking the next option
    await expect(page.getByRole('link', {name: 'Maintenance'})).toBeVisible() // Ensure the Maintenance link is visible before clicking the next option
    await sidePanel.clickMenuOption(SideMenuOptions.CLAIM)
    await sidePanel.clickMenuOption(SideMenuOptions.BUZZ)
})

test('Search bar in SidePanel', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.doLogin('admin', 'admin123')

    const sidePanel = new SidePanel(page)
    await sidePanel.fillSearchInput(SideMenuOptions.ADMIN)
    await sidePanel.getVisibleMenuItems(SideMenuOptions.ADMIN)
})

test('Check all the Qualification links', async ({ page }) => {
    const expectedPages  = [
        {menu: 'Skills', url: '/web/index.php/admin/viewSkills'},
        {menu: 'Education', url: '/web/index.php/admin/viewEducation'},
        {menu: 'Licenses', url: '/web/index.php/admin/viewLicenses'},
        {menu: 'Languages', url: '/web/index.php/admin/viewLanguages'},
        {menu: 'Memberships', url: '/web/index.php/admin/membership'}
    ]

    const loginPage = new LoginPage(page)
    await loginPage.doLogin('admin', 'admin123')

    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()
    await page.getByRole('link', {name: 'Admin'}).click()   

    await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('Qualifications').click()

    const qualificationOptions = page.getByRole('menu').locator('li')

    for(let expectedPage of expectedPages) {
        const menuOption = qualificationOptions.filter({hasText: expectedPage.menu})
        await menuOption.click()
        await expect(page).toHaveURL(new RegExp(expectedPage.url))

        await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('Qualifications').click()
    }
})

test('Check all the Organization links', async ({ page }) => {
    const expectedPages  = [
        {menu: 'General Information', url: '/web/index.php/admin/viewOrganizationGeneralInformation'},
        {menu: 'Locations', url: '/web/index.php/admin/viewLocations'},
        {menu: 'Structure', url: '/web/index.php/admin/viewCompanyStructure'}
    ]

    const loginPage = new LoginPage(page)
    await loginPage.doLogin('admin', 'admin123')

    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()
    await page.getByRole('link', {name: 'Admin'}).click()   

    await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('Organization').click()

    const qualificationOptions = page.getByRole('menu').locator('li')

    for(let expectedPage of expectedPages) {
        const menuOption = qualificationOptions.filter({hasText: expectedPage.menu})
        await menuOption.click()
        await expect(page).toHaveURL(new RegExp(expectedPage.url))

        await page.getByRole('navigation', {name: 'Topbar menu'}).getByText('Organization').click()
    }
})

test('Test Topbar Menu', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickMenuOption(SideMenuOptions.ADMIN)

    const topBarMenu = new TopBarMenu(page)
    await topBarMenu.job.clickJobTitles()
    await topBarMenu.job.clickPayGrades()

    await topBarMenu.userManagement.clickUsers()

    await topBarMenu.qualifications.clickSkills()
    await topBarMenu.qualifications.clickEducation()
    await topBarMenu.qualifications.clickLicenses()
    await topBarMenu.qualifications.clickLanguages()
    await topBarMenu.qualifications.clickMemberships()
})