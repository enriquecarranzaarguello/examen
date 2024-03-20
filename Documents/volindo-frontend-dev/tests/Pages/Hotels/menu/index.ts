import { Page, Locator } from 'playwright';

class HotelMenu {
  private readonly filtersContainer: Locator;

  private readonly resultsContainer: Locator;

  private readonly resultCard: Locator;

  private readonly resultItem: Locator;

  private readonly mapButton: Locator;

  private readonly resultCardButton: Locator;

  private readonly firstResultCardPrice: Locator;

  constructor(page: Page) {
    this.resultsContainer = page.getByTestId('hotel-results-container');
    this.filtersContainer = page.getByTestId('hotel-results-filters');
    this.resultItem = page.getByTestId('hotel-results-container');
    this.mapButton = page.getByTestId('hotel-results-container');

    this.resultCard = page.getByTestId('hotel-result-card-0');
    this.firstResultCardPrice = page.getByTestId('hotel-result-card-price-0');
    this.resultCardButton = page.getByTestId('hotel-result-card-button-0');
  }

  /*
  locators
  */

  getFirstResultCardPrice() {
    return this.firstResultCardPrice;
  }

  firsResultCardButton() {
    return this.resultCardButton;
  }

  firsResultCard() {
    return this.resultCard;
  }

  resultsContainerLocator() {
    return this.resultsContainer;
  }

  showMap() {
    return this.mapButton.click();
  }

  /*
   - Actions
  */

  clickResultCardButton() {
    return this.resultCardButton.first().click();
  }
}

export default HotelMenu;
