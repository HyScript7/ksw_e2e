import { browser } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a subpage of the page
    * @param path path of the subpage (e.g. /path/to/page.html)
    */
    public open (path: string) {
        try {
            return browser.url(`https://apps.projnull.eu/memopad/${path}`)
        } finally {
            browser.refresh()
        }
    }
}
