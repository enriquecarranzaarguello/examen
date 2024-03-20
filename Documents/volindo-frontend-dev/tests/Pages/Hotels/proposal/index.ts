import { Page, Locator } from 'playwright';

class ProposalPage {
  private readonly pageTitle: Locator;

  private readonly hotelTitle: Locator;

  private readonly hotelDetails: Locator;

  private readonly hotelMap: Locator;

  private readonly proposalButton: Locator;

  private readonly proposalSentModal: Locator;

  private readonly checkbox: Locator;

  constructor(page: Page) {
    this.pageTitle = page.getByTestId('hotel-proposal-page-title');
    this.hotelTitle = page.getByTestId('hotel-proposal-title');
    this.hotelDetails = page.getByTestId('hotel-proposal-details');
    this.hotelMap = page.getByTestId('hotel-proposal-map');
    this.proposalButton = page.getByTestId('hotel-proposal-button');
    this.proposalSentModal = page.getByTestId('hotel-proposal-sent-modal');
    this.checkbox = page.getByTestId('hotel-proposal-checkbox');
  }

  /*
  locators
  */
  pageTitleLocator() {
    return this.pageTitle;
  }

  hotelTitleLocator() {
    return this.hotelTitle;
  }

  hotelDetailsLocator() {
    return this.hotelDetails;
  }

  hotelMapLocator() {
    return this.hotelMap;
  }

  proposalButtonLocator() {
    return this.proposalButton;
  }

  proposalSentModalLocator() {
    return this.proposalSentModal;
  }

  checkboxLocator() {
    return this.checkbox;
  }

  /**
   * actions
   */

  clickProposalButton() {
    return this.proposalButton.click();
  }

  clickCheckbox() {
    return this.checkbox.click();
  }
}

export default ProposalPage;
