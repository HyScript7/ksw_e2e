import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * subpage containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('#user');
    }

    public get inputPassword () {
        return $('#pass');
    }

    public get btnSubmit () {
        return $('#send');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('#/auth/');
    }
}

export default new LoginPage();
