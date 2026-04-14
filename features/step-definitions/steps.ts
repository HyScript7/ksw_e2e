import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals'

import LoginPage from '../pageobjects/login.page.js';
import InventoryPage from "../pageobjects/inventory.page.ts";
import CartPage from "../pageobjects/cart.page.ts";
import CheckoutStepOnePage from "../pageobjects/checkoutstep1.page.ts";
import CheckoutStepTwoPage from "../pageobjects/checkoutstep2.page.ts";
import CheckoutCompletePage from "../pageobjects/thankyou.page.ts";

const pages = {
    login: LoginPage,
    inventory: InventoryPage,
    cart: CartPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    // @ts-ignore
    await pages[page].open()
});

When(/^I login with (\w+)? and (.+)?$/, async (username, password) => {
    if (username === undefined || username === null) username = "";
    if (password === undefined || password === null) password = "";
    await LoginPage.login(username, password)
});

Then(/^I should see a flash message saying "(.*)?"$/, async (message) => {
    if (message === undefined || message === null || message === "") return;
    await expect(LoginPage.flashAlert).toBeExisting();
    await expect(LoginPage.flashAlert).toHaveText(message);
});

// ── Navigation / Page Load ────────────────────────────────────────────────────

Then(/^the inventory page should be loaded$/, async () => {
    await InventoryPage.waitForPageLoad();
    await expect(InventoryPage.inventoryContainer).toBeDisplayed();
});

Then(/^the cart page should be loaded$/, async () => {

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

// ─── Cart Contents ────────────────────────────────────────────────────────────

Then('the cart should contain {int} item(s)', async (expectedCount: number) => {
    const items = CartPage.cartItems
    expect(items).toHaveLength(expectedCount)
})

Then('the cart badge should show {int}', async (expectedCount: number) => {
    expect(await CartPage.getCartBadgeCount()).toBe(expectedCount)
})

Then('the cart badge should not be visible', async () => {
    await expect(CartPage.shoppingCartBadge).not.toBeExisting()
})

Then('the cart should contain a product named {string}', async (productName: string) => {
    const names = await CartPage.getItemNames()
    expect(names).toContain(productName)
})

Then('the cart should not contain a product named {string}', async (productName: string) => {
    const names = await CartPage.getItemNames()
    expect(names).not.toContain(productName)
})

Then('the product {string} should have a price of {string}', async (productName: string, expectedPrice: string) => {
    const items = CartPage.cartItems
    for (const item of items) {
        const name = await item.$('[data-test="inventory-item-name"]').getText()
        if (name === productName) {
            const price = await item.$('[data-test="inventory-item-price"]').getText()
            expect(price).toBe(expectedPrice)
            return
        }
    }
    throw new Error(`Product "${productName}" not found in cart`)
})

Then('the cart should be empty', async () => {
    const items = CartPage.cartItems
    expect(items).toHaveLength(0)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

When('I remove {string} from the cart', async (productSlug: string) => {
    await CartPage.removeItem(productSlug)
})

When('I click Continue Shopping', async () => {
    await CartPage.continueShopping()
})

When('I click Checkout', async () => {
    await CartPage.proceedToCheckout()
})

Then('I should be on the cart page', async () => {
    await expect(CartPage.pageTitle).toHaveText('Your Cart')
})

// ── Footer ────────────────────────────────────────────────────────────────────

Then(/^the footer should be displayed$/, async () => {
    await expect(InventoryPage.footer).toBeDisplayed();
});

Then(/^the footer should contain "([^"]*)"$/, async (text: string) => {
    await expect(InventoryPage.footerCopy).toHaveText(expect.stringContaining(text));
});

// ─── Navigation ───────────────────────────────────────────────────────────────

Given('I am on the checkout information page', async () => {
    await CheckoutStepOnePage.open()
})

Then('I should be on the checkout information page', async () => {
    await expect(await CheckoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information')
})

// ─── Form Filling ─────────────────────────────────────────────────────────────

When('I enter {string} as the first name', async (firstName: string) => {
    await CheckoutStepOnePage.firstNameInput.setValue(firstName)
})

When('I enter {string} as the last name', async (lastName: string) => {
    await CheckoutStepOnePage.lastNameInput.setValue(lastName)
})

When('I enter {string} as the postal code', async (postalCode: string) => {
    await CheckoutStepOnePage.postalCodeInput.setValue(postalCode)
})

When('I fill in the checkout form with {string}, {string} and {string}',
    async (firstName: string, lastName: string, postalCode: string) => {
        await CheckoutStepOnePage.fillForm(firstName, lastName, postalCode)
    }
)

When('I clear the checkout form', async () => {
    await CheckoutStepOnePage.clearForm()
})

// ─── Actions ──────────────────────────────────────────────────────────────────

When('I click Continue on the checkout information page', async () => {
    await CheckoutStepOnePage.submitForm()
})

When('I click Cancel on the checkout information page', async () => {
    await CheckoutStepOnePage.cancel()
})

// ─── Assertions ───────────────────────────────────────────────────────────────

Then('the first name field should be empty', async () => {
    await expect(await CheckoutStepOnePage.firstNameInput).toHaveValue('')
})

Then('the last name field should be empty', async () => {
    await expect(await CheckoutStepOnePage.lastNameInput).toHaveValue('')
})

Then('the postal code field should be empty', async () => {
    await expect(await CheckoutStepOnePage.postalCodeInput).toHaveValue('')
})

Then('an error message should be displayed on the checkout information page', async () => {
    const error = await CheckoutStepOnePage.getErrorMessage()
    expect(error).not.toBeNull()
    expect(error).not.toBe('')
})

Then('the checkout information error should contain {string}', async (expectedMessage: string) => {
    const error = await CheckoutStepOnePage.getErrorMessage()
    expect(error).toContain(expectedMessage)
})

Then('no error message should be displayed on the checkout information page', async () => {
    const error = await CheckoutStepOnePage.getErrorMessage()
    expect(error).toBeNull()
})

// ─── Navigation ───────────────────────────────────────────────────────────────

Given('I am on the checkout overview page', async () => {
    await CheckoutStepTwoPage.open()
})

Then('I should be on the checkout overview page', async () => {
    await expect(await CheckoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview')
})

// ─── Order Items ──────────────────────────────────────────────────────────────

Then('the order summary should contain {int} item(s)', async (expectedCount: number) => {
    const items = await CheckoutStepTwoPage.cartItems
    await expect(items).toHaveLength(expectedCount)
})

Then('the order summary should contain a product named {string}', async (productName: string) => {
    const names = await CheckoutStepTwoPage.getItemNames()
    expect(names).toContain(productName)
})

Then('the overview product {string} should have a price of {string}',
    async (productName: string, expectedPrice: string) => {
        const items = await CheckoutStepTwoPage.cartItems
        for (const item of items) {
            const name = await item.$('[data-test="inventory-item-name"]').getText()
            if (name === productName) {
                const price = await item.$('[data-test="inventory-item-price"]').getText()
                expect(price).toBe(expectedPrice)
                return
            }
        }
        throw new Error(`Product "${productName}" not found in order summary`)
    }
)

// ─── Summary Info ─────────────────────────────────────────────────────────────

Then('the payment information should be {string}', async (expectedValue: string) => {
    await expect(await CheckoutStepTwoPage.paymentInfoValue).toHaveText(expectedValue)
})

Then('the shipping information should be {string}', async (expectedValue: string) => {
    await expect(await CheckoutStepTwoPage.shippingInfoValue).toHaveText(expectedValue)
})

Then('the subtotal should be {string}', async (expectedSubtotal: string) => {
    await expect(await CheckoutStepTwoPage.subtotalLabel).toHaveText(expectedSubtotal)
})

Then('the tax should be {string}', async (expectedTax: string) => {
    await expect(await CheckoutStepTwoPage.taxLabel).toHaveText(expectedTax)
})

Then('the order total should be {string}', async (expectedTotal: string) => {
    await expect(await CheckoutStepTwoPage.totalLabel).toHaveText(expectedTotal)
})

Then('the numeric order total should equal the subtotal plus tax', async () => {
    const subtotal = await CheckoutStepTwoPage.getSubtotalAmount()
    const tax = await CheckoutStepTwoPage.getTaxAmount()
    const total = await CheckoutStepTwoPage.getTotalAmount()
    expect(total).toBeCloseTo(subtotal + tax, 2)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

When('I click Finish on the checkout overview page', async () => {
    await CheckoutStepTwoPage.finish()
})

When('I click Cancel on the checkout overview page', async () => {
    await CheckoutStepTwoPage.cancel()
})

// ─── Navigation ───────────────────────────────────────────────────────────────

Given('I am on the checkout complete page', async () => {
    await CheckoutCompletePage.open()
})

Then('I should be on the checkout complete page', async () => {
    await expect(await CheckoutCompletePage.pageTitle).toHaveText('Checkout: Complete!')
})

// ─── Confirmation Content ─────────────────────────────────────────────────────

Then('the order confirmation header should be displayed', async () => {
    await expect(await CheckoutCompletePage.completeHeader).toBeDisplayed()
})

Then('the order confirmation header should say {string}', async (expectedText: string) => {
    await expect(await CheckoutCompletePage.completeHeader).toHaveText(expectedText)
})

Then('the order confirmation text should be displayed', async () => {
    await expect(await CheckoutCompletePage.completeText).toBeDisplayed()
})

Then('the order confirmation text should say {string}', async (expectedText: string) => {
    await expect(await CheckoutCompletePage.completeText).toHaveText(expectedText)
})

Then('the pony express image should be displayed', async () => {
    await expect(await CheckoutCompletePage.ponyExpressImage).toBeDisplayed()
})

Then('the cart should be empty after checkout', async () => {
    const isEmpty = await CheckoutCompletePage.isCartEmpty()
    expect(isEmpty).toBe(true)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

When('I click Back Home', async () => {
    await CheckoutCompletePage.backHome()
})
