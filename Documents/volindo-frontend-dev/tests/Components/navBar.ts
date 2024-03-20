import { Page, Locator } from 'playwright';

class NavBar {
  private readonly page: Page;

  private readonly profileLink: Locator;

  private readonly marketingLink: Locator;

  private readonly avatarImage: Locator;

  private readonly paymentLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileLink = page.getByTestId('profile-header-link');
    this.marketingLink = page.getByTestId('marketing-header-link');
    this.avatarImage = page.getByTestId('dropdown-avatar');
    this.paymentLink = page.getByTestId('dropdown-payment');
  }

  /**
   * ocators
   */

  getAvatar() {
    return this.avatarImage;
  }

  getPayment() {
    return this.paymentLink;
  }
  /**
   * Actions
   */

  clickAvatar() {
    this.avatarImage.click();
  }

  clickMarketing() {
    return this.marketingLink.click();
  }

  clickProfile() {
    return this.profileLink.click();
  }

  clickPayment() {
    return this.paymentLink.click();
  }
}

export default NavBar;
