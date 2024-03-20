import { Page, Locator } from 'playwright';

class GeneralModal {
  private readonly page: Page;

  private readonly container: Locator;

  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('general-modal');
    this.closeButton = page.getByTestId('general-modal-close');
  }

  /*
   * locator
   */

  getContainer() {
    return this.container;
  }

  getCloseButton() {
    return this.closeButton;
  }

  /*
   * action
   */

  close() {
    this.closeButton.click();
  }
}

export default GeneralModal;
