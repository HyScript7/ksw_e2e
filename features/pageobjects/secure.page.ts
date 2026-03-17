import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * subpage containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get flashAlert () {
        return $('.alert').$('span');
    }

    public get accountMenu () {
        return $('#account-menu');
    }

    public get logoutButton () {
        return $("#cm-logout");
    }

    public get confirmLogoutButton() {
        return $(".modal-action .btn-primary");
    }

    public async logout() {
        await this.accountMenu.click();
        await this.logoutButton.click();
        await this.confirmLogoutButton.click();
    }
}

export default new SecurePage();
