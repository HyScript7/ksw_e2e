import { $ } from '@wdio/globals'
import Page from './page'

/**
 * Page object for the Swag Labs Checkout Step 1 page (/checkout-step-one.html)
 */
class CheckoutStepOnePage extends Page {

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

    // ─── Form Fields ──────────────────────────────────────────────────────────

    get firstNameInput()        { return $('[data-test="firstName"]') }
    get lastNameInput()         { return $('[data-test="lastName"]') }
    get postalCodeInput()       { return $('[data-test="postalCode"]') }
    get errorMessageContainer() { return $('.error-message-container') }

    // ─── Buttons ──────────────────────────────────────────────────────────────

    get cancelButton()          { return $('[data-test="cancel"]') }
    get continueButton()        { return $('[data-test="continue"]') }

    // ─── Footer ───────────────────────────────────────────────────────────────

    get footer()                { return $('[data-test="footer"]') }
    get footerCopy()            { return $('[data-test="footer-copy"]') }
    get twitterLink()           { return $('[data-test="social-twitter"]') }
    get facebookLink()          { return $('[data-test="social-facebook"]') }
    get linkedinLink()          { return $('[data-test="social-linkedin"]') }

    // ─── Actions ──────────────────────────────────────────────────────────────

    async fillForm(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.setValue(firstName)
        await this.lastNameInput.setValue(lastName)
        await this.postalCodeInput.setValue(postalCode)
    }

    async clearForm() {
        await this.firstNameInput.clearValue()
        await this.lastNameInput.clearValue()
        await this.postalCodeInput.clearValue()
    }

    async submitForm() {
        await this.continueButton.click()
    }

    async cancel() {
        await this.cancelButton.click()
    }

    async openMenu()            { await this.burgerMenuButton.click() }
    async closeMenu()           { await this.burgerMenuClose.click() }

    /**
     * Returns the error message text if visible, otherwise null.
     */
    async getErrorMessage(): Promise<string | null> {
        const container = await this.errorMessageContainer
        const isDisplayed = await container.isDisplayed()
        if (!isDisplayed) return null
        return container.getText()
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public open() {
        return super.open('/checkout-step-one.html')
    }
}

export default new CheckoutStepOnePage()