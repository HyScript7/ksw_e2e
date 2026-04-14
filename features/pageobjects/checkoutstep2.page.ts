import { $ } from '@wdio/globals'
import Page from './page'

/**
 * Page object for the Swag Labs Checkout Step 2 page (/checkout-step-two.html)
 */
class CheckoutStepTwoPage extends Page {

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

    // ─── Order Items ──────────────────────────────────────────────────────────

    get cartList()              { return $('[data-test="cart-list"]') }
    get cartItems()             { return $$('[data-test="inventory-item"]') }

    // ─── Summary Info ─────────────────────────────────────────────────────────

    get summaryContainer()      { return $('[data-test="checkout-summary-container"]') }
    get paymentInfoLabel()      { return $('[data-test="payment-info-label"]') }
    get paymentInfoValue()      { return $('[data-test="payment-info-value"]') }
    get shippingInfoLabel()     { return $('[data-test="shipping-info-label"]') }
    get shippingInfoValue()     { return $('[data-test="shipping-info-value"]') }
    get totalInfoLabel()        { return $('[data-test="total-info-label"]') }
    get subtotalLabel()         { return $('[data-test="subtotal-label"]') }
    get taxLabel()              { return $('[data-test="tax-label"]') }
    get totalLabel()            { return $('[data-test="total-label"]') }

    // ─── Buttons ──────────────────────────────────────────────────────────────

    get cancelButton()          { return $('[data-test="cancel"]') }
    get finishButton()          { return $('[data-test="finish"]') }

    // ─── Footer ───────────────────────────────────────────────────────────────

    get footer()                { return $('[data-test="footer"]') }
    get footerCopy()            { return $('[data-test="footer-copy"]') }
    get twitterLink()           { return $('[data-test="social-twitter"]') }
    get facebookLink()          { return $('[data-test="social-facebook"]') }
    get linkedinLink()          { return $('[data-test="social-linkedin"]') }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns all item names displayed in the order summary.
     */
    async getItemNames(): Promise<string[]> {
        const items = await this.cartItems
        return Promise.all(
            await items.map(item => item.$('[data-test="inventory-item-name"]').getText())
        )
    }

    /**
     * Returns all item prices displayed in the order summary.
     */
    async getItemPrices(): Promise<string[]> {
        const items = await this.cartItems
        return Promise.all(
            await items.map(item => item.$('[data-test="inventory-item-price"]').getText())
        )
    }

    /**
     * Parses and returns the numeric subtotal (e.g. 45.98 from "Item total: $45.98").
     */
    async getSubtotalAmount(): Promise<number> {
        const text = await this.subtotalLabel.getText()
        return parseFloat(text.replace(/[^0-9.]/g, ''))
    }

    /**
     * Parses and returns the numeric tax amount (e.g. 3.68 from "Tax: $3.68").
     */
    async getTaxAmount(): Promise<number> {
        const text = await this.taxLabel.getText()
        return parseFloat(text.replace(/[^0-9.]/g, ''))
    }

    /**
     * Parses and returns the numeric total (e.g. 49.66 from "Total: $49.66").
     */
    async getTotalAmount(): Promise<number> {
        const text = await this.totalLabel.getText()
        return parseFloat(text.replace(/[^0-9.]/g, ''))
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async finish()              { await this.finishButton.click() }
    async cancel()              { await this.cancelButton.click() }
    async openMenu()            { await this.burgerMenuButton.click() }
    async closeMenu()           { await this.burgerMenuClose.click() }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public open() {
        return super.open('/checkout-step-two.html')
    }
}

export default new CheckoutStepTwoPage()