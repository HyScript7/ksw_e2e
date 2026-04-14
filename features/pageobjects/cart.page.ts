import Page from './page'

/**
 * Page object for the Swag Labs Cart page (/cart.html)
 */
class CartPage extends Page {

    // ─── Header ───────────────────────────────────────────────────────────────

    get headerContainer()       { return $('[data-test="header-container"]') }
    get pageTitle()             { return $('[data-test="title"]') }
    get shoppingCartLink()      { return $('[data-test="shopping-cart-link"]') }
    get shoppingCartBadge()     { return $('[data-test="shopping-cart-badge"]') }

    // ─── Burger Menu ──────────────────────────────────────────────────────────

    get burgerMenuButton()      { return $('#react-burger-menu-btn') }
    get burgerMenuClose()       { return $('#react-burger-cross-btn') }
    get menuAllItems()          { return $('[data-test="inventory-sidebar-link"]') }
    get menuAbout()             { return $('[data-test="about-sidebar-link"]') }
    get menuLogout()            { return $('[data-test="logout-sidebar-link"]') }
    get menuResetAppState()     { return $('[data-test="reset-sidebar-link"]') }

    // ─── Cart List ────────────────────────────────────────────────────────────

    get cartList()              { return $('[data-test="cart-list"]') }
    get cartItems()             { return $$('[data-test="inventory-item"]') }
    get cartQuantityLabel()     { return $('[data-test="cart-quantity-label"]') }
    get cartDescLabel()         { return $('[data-test="cart-desc-label"]') }

    // ─── Footer Buttons ───────────────────────────────────────────────────────

    get continueShoppingButton() { return $('[data-test="continue-shopping"]') }
    get checkoutButton()          { return $('[data-test="checkout"]') }

    // ─── Footer ───────────────────────────────────────────────────────────────

    get footer()                { return $('[data-test="footer"]') }
    get footerCopy()            { return $('[data-test="footer-copy"]') }
    get twitterLink()           { return $('[data-test="social-twitter"]') }
    get facebookLink()          { return $('[data-test="social-facebook"]') }
    get linkedinLink()          { return $('[data-test="social-linkedin"]') }

    // ─── Item Helpers ─────────────────────────────────────────────────────────

    /**
     * Returns the cart item element at the given 0-based index.
     */
    async getCartItem(index: number) {
        const items = await this.cartItems
        return items[index]
    }

    /**
     * Returns all item names currently displayed in the cart.
     */
    async getItemNames(): Promise<string[]> {
        const items = await this.cartItems
        return Promise.all(
            await items.map(item => item.$('[data-test="inventory-item-name"]').getText())
        )
    }

    /**
     * Returns all item prices currently displayed in the cart.
     */
    async getItemPrices(): Promise<string[]> {
        const items = await this.cartItems
        return Promise.all(
            await items.map(item => item.$('[data-test="inventory-item-price"]').getText())
        )
    }

    /**
     * Removes a cart item by its kebab-case product name.
     * e.g. removeItem('sauce-labs-backpack')
     */
    async removeItem(productName: string) {
        await $(`[data-test="remove-${productName}"]`).click()
    }

    /**
     * Returns the numeric badge count on the cart icon, or 0 if absent.
     */
    async getCartBadgeCount(): Promise<number> {
        const badge = await this.shoppingCartBadge
        const exists = await badge.isExisting()
        if (!exists) return 0
        return parseInt(await badge.getText(), 10)
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async openMenu()            { await this.burgerMenuButton.click() }
    async closeMenu()           { await this.burgerMenuClose.click() }
    async continueShopping()    { await this.continueShoppingButton.click() }
    async proceedToCheckout()   { await this.checkoutButton.click() }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public open() {
        return super.open('/cart.html')
    }
}

export default new CartPage()