import { test as base } from '@playwright/test';
import { SidePanel } from '../../pageobjects/components/sidebar-menu/SidePanel';

// Definimos nuestros "superpoderes" personalizados
type MyTestFixtures = {
    sidePanel: SidePanel;
};

// Extendemos el test nativo de Playwright
export const test = base.extend<MyTestFixtures>({
    // Playwright ejecuta esto automáticamente antes de cada prueba
    sidePanel: async ({ page }, use) => {
        const sidePanel = new SidePanel(page);
        await use(sidePanel); // Se lo inyecta a la prueba
    },
});

// Exportamos expect para no tener que importarlo en cada prueba
export { expect } from '@playwright/test';