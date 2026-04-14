import { $ } from '@wdio/globals'
import Page from './page'

/**
 * Page object for the Swag Labs Checkout Complete page (/checkout-complete.html)
 */
class CheckoutCompletePage extends Page {

    // ─── Header ───────────────────────────────────────────────────────────────

    get headerContainer()       { return $('[data-test="header-container"]') }
    get pageTitle()             { return $('[data-test="title"]') }
    get shoppingCartLink()      { return $('[data-test="shopping-cart-link"]') }

    // ─── Burger Menu ──────────────────────────────────────────────────────────

    get burgerMenuButton()      { return $('#react-burger-menu-btn') }
    get burgerMenuClose()       { return $('#react-burger-cross-btn') }
    get menuAllItems()          { return $('[data-test="inventory-sidebar-link"]') }
    get menuAbout()             { return $('[data-test="about-sidebar-link"]') }
    get menuLogout()            { return $('[data-test="logout-sidebar-link"]') }
    get menuResetAppState()     { return $('[data-test="reset-sidebar-link"]') }

    // ─── Confirmation Content ─────────────────────────────────────────────────

    get completeContainer()     { return $('[data-test="checkout-complete-container"]') }
    get ponyExpressImage()      { return $('[data-test="pony-express"]') }
    get completeHeader()        { return $('[data-test="complete-header"]') }
    get completeText()          { return $('[data-test="complete-text"]') }
    get backHomeButton()        { return $('[data-test="back-to-products"]') }

    // ─── Footer ───────────────────────────────────────────────────────────────

    get footer()                { return $('[data-test="footer"]') }
    get footerCopy()            { return $('[data-test="footer-copy"]') }
    get twitterLink()           { return $('[data-test="social-twitter"]') }
    get facebookLink()          { return $('[data-test="social-facebook"]') }
    get linkedinLink()          { return $('[data-test="social-linkedin"]') }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async backHome()            { await this.backHomeButton.click() }
    async openMenu()            { await this.burgerMenuButton.click() }
    async closeMenu()           { await this.burgerMenuClose.click() }

    /**
     * Returns true if the cart badge is absent, confirming the cart was cleared.
     */
    async isCartEmpty(): Promise<boolean> {
        return !(await this.shoppingCartLink.$('.shopping_cart_badge').isExisting())
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public open() {
        return super.open('/checkout-complete.html')
    }
}

export default new CheckoutCompletePage()