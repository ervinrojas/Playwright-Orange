import { Locator, Page } from '@playwright/test';

export enum SideMenuOptions {
    ADMIN = 'Admin',
    PIM = 'PIM',
    LEAVE = 'Leave',
    TIME = 'Time',
    RECRUITMENT = 'Recruitment',
    MY_INFO = 'My Info',
    PERFORMANCE = 'Performance',
    DASHBOARD = 'Dashboard',
    DIRECTORY = 'Directory',
    MAINTENANCE = 'Maintenance',
    CLAIM = 'Claim',
    BUZZ = 'Buzz'
}

export class SidePanel {

    readonly page: Page;
    private readonly container: Locator;
    private readonly searchInput: Locator;
    private readonly menuItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('.oxd-sidepanel-body');
        this.searchInput = page.getByRole('textbox', {name: 'Search'});
        this.menuItems = this.container.locator('.oxd-main-menu-item');
        //this.visibleMenuItem = this.menuItems.filter({visible: true});
    }

    async waitForLoaded() {
        await this.container.waitFor({state: 'visible'});
        await this.menuItems.first().waitFor({state: 'visible'});
    }

    async clickMenu(option: SideMenuOptions) {
        await this.menuItems.getByRole('link', {name: option, exact: true}).click();
    }

    async getAllVisibleTexts(): Promise<string[]> {
        await this.waitForLoaded();
        const rawTexts = await this.menuItems.allInnerTexts();
        return rawTexts.map((text) => text.trim()).filter((text) => text.length > 0);
    }

    async searchOption(option: SideMenuOptions): Promise<Locator> {
        await this.searchInput.fill(option);
        const filteredItems = this.menuItems.filter({hasText: option}).first();
        await filteredItems.waitFor({state: 'visible'});
        return filteredItems; // Wait for the search results to update
    }
    /*static readonly EXPECTED_MENU_ITEMS = [
        'Admin',
        'PIM',
        'Leave',
        'Time',
        'Recruitment',
        'My Info',
        'Performance',
        'Dashboard',
        'Directory',
        'Maintenance',
        'Claim',
        'Buzz'
    ];

    async getMenuOptions(): Promise<string[]> {
        const menuItems = this.page.locator('.oxd-main-menu-item');
        await menuItems.first().waitFor({state: 'visible'});
        const rawText = await this.allMenuItems.allInnerTexts();
        return rawText.map((text) => text.trim()).filter((text => text.length > 0));
    }

    async navigateToMenuOption(options: string[]): Promise<void> {
        for (const option of options) {
            console.log(`Navigating to menu option: ${option}`);
            const urlBeforeClick = this.page.url();
            const itemToClick = this.allMenuItems.filter({hasText: option}).first();
            await itemToClick.click();

            const urlAfterClick = this.page.url();
            console.log(`URL after click: ${urlAfterClick}`);
            if (urlBeforeClick !== urlAfterClick) {
                await this.page.goBack();
                await this.allMenuItems.first().waitFor({state: 'visible'});
            }else {
                console.log(`No navigation occurred for option: ${option}`);
            }
        }
    }

    private menuOption(option: SideMenuOptions): Locator {
        return this.page.getByRole('link', {name: option})
    }

    async clickMenuOption(option: SideMenuOptions) {
        await this.menuOption(option).click()
    }

    async fillSearchInput(option: SideMenuOptions) {
        await this.searchInput.fill(option)
        return this.menuOption(option)
    }

    async getVisibleMenuItems(expectedTest: string){
        const visibleCount = await this.visibleMenuItem.count();
        expect(visibleCount).toBeGreaterThan(0);

        for (let i = 0; i < visibleCount; i++) {    
            const itemText = (await this.visibleMenuItem.nth(i).innerText()).trim();
            expect(itemText).toContain(expectedTest);
            console.log(`Visible menu item: ${itemText} contains expected text: ${expectedTest}`);
        }
    }*/

}
