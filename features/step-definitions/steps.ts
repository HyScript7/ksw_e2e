import { When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import InventoryPage from '../pageobjects/inventory.page.js';

// ── Navigation / Page Load ────────────────────────────────────────────────────

Then(/^the inventory page should be loaded$/, async () => {
    await InventoryPage.waitForPageLoad();
    await expect(InventoryPage.inventoryContainer).toBeDisplayed();
});

Then(/^the page title should be "([^"]*)"$/, async (title: string) => {
    await expect(InventoryPage.pageTitle).toHaveText(title);
});

// ── Burger Menu ───────────────────────────────────────────────────────────────

When(/^I open the burger menu$/, async () => {
    await InventoryPage.openBurgerMenu();
});

When(/^I close the burger menu$/, async () => {
    await InventoryPage.closeBurgerMenu();
});

When(/^I click the "([^"]*)" menu item$/, async (item: string) => {
    const menuItems: Record<string, () => Promise<void>> = {
        'All Items':         async () => InventoryPage.allItemsLink.click(),
        'About':             async () => InventoryPage.aboutLink.click(),
        'Logout':            async () => InventoryPage.logoutLink.click(),
        'Reset App State':   async () => InventoryPage.resetAppStateLink.click(),
    };

    const action = menuItems[item];
    if (!action) throw new Error(`Unknown menu item: "${item}"`);
    await action();
});

When(/^I logout via the menu$/, async () => {
    await InventoryPage.logout();
});

When(/^I reset the app state$/, async () => {
    await InventoryPage.resetAppState();
});

Then(/^the burger menu should be (open|closed)$/, async (state: string) => {
    if (state === 'open') {
        await expect(InventoryPage.burgerMenuWrap).toBeDisplayed();
    } else {
        await expect(InventoryPage.burgerMenuWrap).not.toBeDisplayed();
    }
});

// ── Sorting ───────────────────────────────────────────────────────────────────

When(/^I sort products by "([^"]*)"$/, async (option: string) => {
    const sortMap: Record<string, 'az' | 'za' | 'lohi' | 'hilo'> = {
        'Name (A to Z)':        'az',
        'Name (Z to A)':        'za',
        'Price (low to high)':  'lohi',
        'Price (high to low)':  'hilo',
    };

    const value = sortMap[option];
    if (!value) throw new Error(`Unknown sort option: "${option}"`);
    await InventoryPage.sortProducts(value);
});

Then(/^the active sort option should be "([^"]*)"$/, async (option: string) => {
    await expect(InventoryPage.activeOption).toHaveText(option);
});

Then(/^the products should be sorted by name ascending$/, async () => {
    const names = await InventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
});

Then(/^the products should be sorted by name descending$/, async () => {
    const names = await InventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
});

Then(/^the products should be sorted by price ascending$/, async () => {
    const prices = await InventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
});

Then(/^the products should be sorted by price descending$/, async () => {
    const prices = await InventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
});

// ── Inventory Items ───────────────────────────────────────────────────────────

Then(/^I should see (\d+) products?$/, async (count: string) => {
    const items = InventoryPage.inventoryItems;
    expect(items).toHaveLength(parseInt(count, 10));
});

Then(/^I should see a product named "([^"]*)"$/, async (name: string) => {
    const item = await InventoryPage.getItemByName(name);
    await expect(item).toBeDisplayed();
});

Then(/^the product "([^"]*)" should have price "([^"]*)"$/, async (name: string, price: string) => {
    const item = await InventoryPage.getItemByName(name);
    const priceEl = item.$('[data-test="inventory-item-price"]');
    await expect(priceEl).toHaveText(price);
});

// ── Cart ──────────────────────────────────────────────────────────────────────

When(/^I add "([^"]*)" to the cart$/, async (name: string) => {
    await InventoryPage.addItemToCart(name);
});

When(/^I click on the image of "([^"]*)"$/, async (name: string) => {
    await InventoryPage.clickItemImage(name);
});

When(/^I click on the title of "([^"]*)"$/, async (name: string) => {
    await InventoryPage.clickItemTitle(name);
});

When(/^I go to the shopping cart$/, async () => {
    await InventoryPage.clickShoppingCart();
});

Then(/^the cart badge should show (\d+) items?$/, async (count: string) => {
    const actual = await InventoryPage.getShoppingCartCount();
    expect(actual).toBe(parseInt(count, 10));
});

Then(/^the cart badge should not be visible$/, async () => {
    const count = await InventoryPage.getShoppingCartCount();
    expect(count).toBe(0);
});

// ── Footer ────────────────────────────────────────────────────────────────────

Then(/^the footer should be displayed$/, async () => {
    await expect(InventoryPage.footer).toBeDisplayed();
});

Then(/^the footer should contain "([^"]*)"$/, async (text: string) => {
    await expect(InventoryPage.footerCopy).toHaveText(expect.stringContaining(text));
});
