import { Page, Locator } from 'playwright';

class HotelsSearch {
  private readonly page: Page;

  private readonly destinationsInput: Locator;

  private readonly startDate: Locator;

  private readonly endDate: Locator;

  // private readonly travelers: Locator;

  private readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.destinationsInput = page.getByTestId('hotel-search-destination');
    this.startDate = page.locator('#startDate');
    this.endDate = page.locator('#endDate');
    this.searchButton = page.getByTestId('hotel-search-submit');
  }

  /*
  locators
  */

  getSearchButton() {
    return this.searchButton;
  }

  getDestinations() {
    return this.destinationsInput;
  }

  getCalendar() {
    return this.page.getByTestId('hotel-search-calendar');
  }

  /*
   - Actions
  */

  clicStartDate() {
    return this.startDate.click();
  }

  clicEndDate() {
    return this.endDate.click();
  }

  clickSearchButton() {
    return this.searchButton.click();
  }

  clickDestinations() {
    return this.destinationsInput.click();
  }
}

export default HotelsSearch;
