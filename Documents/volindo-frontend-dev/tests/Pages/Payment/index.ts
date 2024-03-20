import { Page, Locator } from '@playwright/test';

class PaymentPage {
  private readonly page: Page;

  private readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('payment-title');
  }

  /**
   * locators
   */

  pageTitleLocator() {
    return this.title;
  }
}

export default PaymentPage;
