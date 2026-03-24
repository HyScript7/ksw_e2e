import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals'

import LoginPage from '../pageobjects/login.page.js';

const pages = {
    login: LoginPage
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

Then(/^I should see a flash message saying (.*)?$/, async (message) => {
    if (message === undefined || message === null || message === "") return;
    await expect(LoginPage.flashAlert).toBeExisting();
    await expect(LoginPage.flashAlert).toHaveText(expect.stringContaining(message));
});
