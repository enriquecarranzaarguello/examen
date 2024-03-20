import { Page, Locator } from 'playwright';

// import { marketingLanding } from '../../helper-functions';

export default class MarketingPage {
  page: Page;

  linksBar: Locator;

  button: Locator;

  title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linksBar = page.getByTestId('marketing-bar');
    this.button = page.getByTestId('marketing-bar-button');
    this.title = page.getByTestId('marketing-title');
  }

  // could create a  separate comp

  getLinksBar() {
    return this.linksBar;
  }

  checkButton() {
    return this.button;
  }

  checkTitle() {
    return this.title;
  }
}
