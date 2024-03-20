import { Page, Locator } from 'playwright';

class FlywayPlanCard {
  private readonly page: Page;

  private readonly cardOne: Locator;

  private readonly titleOne: Locator;

  private readonly priceOne: Locator;

  private readonly buttonOne: Locator;

  private readonly perksOne: Locator;

  private readonly cardTwo: Locator;

  private readonly titleTwo: Locator;

  private readonly priceTwo: Locator;

  private readonly buttonTwo: Locator;

  private readonly perksTwo: Locator;

  private readonly cardThree: Locator;

  private readonly titleThree: Locator;

  private readonly priceThree: Locator;

  private readonly buttonThree: Locator;

  private readonly perksThree: Locator;

  private readonly cardFour: Locator;

  private readonly titleFour: Locator;

  private readonly priceFour: Locator;

  private readonly buttonFour: Locator;

  private readonly perksFour: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardOne = page.getByTestId('flyway-plan-card-0');
    this.titleOne = page.getByTestId('flyway-plan-card-title-0');
    this.priceOne = page.getByTestId('flyway-plan-card-price-0');
    this.buttonOne = page.getByTestId('flyway-plan-card-button-0');
    this.perksOne = page.getByTestId('flyway-plan-card-perks-0');

    this.cardTwo = page.getByTestId('flyway-plan-card-1');
    this.titleTwo = page.getByTestId('flyway-plan-card-title-1');
    this.priceTwo = page.getByTestId('flyway-plan-card-price-1');
    this.buttonTwo = page.getByTestId('flyway-plan-card-button-1');
    this.perksTwo = page.getByTestId('flyway-plan-card-perks-1');

    this.cardThree = page.getByTestId('flyway-plan-card-2');
    this.titleThree = page.getByTestId('flyway-plan-card-title-2');
    this.priceThree = page.getByTestId('flyway-plan-card-price-2');
    this.buttonThree = page.getByTestId('flyway-plan-card-button-2');
    this.perksThree = page.getByTestId('flyway-plan-card-perks-2');

    this.cardFour = page.getByTestId('flyway-plan-card-3');
    this.titleFour = page.getByTestId('flyway-plan-card-title-3');
    this.priceFour = page.getByTestId('flyway-plan-card-price-3');
    this.buttonFour = page.getByTestId('flyway-plan-card-button-3');
    this.perksFour = page.getByTestId('flyway-plan-card-perks-3');
  }

  /**
   * locators
   */

  getCardOne() {
    return this.cardOne;
  }

  getTitleOne() {
    return this.titleOne;
  }

  getPriceOne() {
    return this.priceOne;
  }

  getButtonOne() {
    return this.buttonOne;
  }

  getPerksOne() {
    return this.perksOne;
  }

  getCardTwo() {
    return this.cardTwo;
  }

  getTitleTwo() {
    return this.titleTwo;
  }

  getPriceTwo() {
    return this.priceTwo;
  }

  getButtonTwo() {
    return this.buttonTwo;
  }

  getPerksTwo() {
    return this.perksTwo;
  }

  getCardThree() {
    return this.cardThree;
  }

  getTitleThree() {
    return this.titleThree;
  }

  getPriceThree() {
    return this.priceThree;
  }

  getButtonThree() {
    return this.buttonThree;
  }

  getPerksThree() {
    return this.perksThree;
  }

  getCardFour() {
    return this.cardFour;
  }

  getTitleFour() {
    return this.titleFour;
  }

  getPriceFour() {
    return this.priceFour;
  }

  getButtonFour() {
    return this.buttonFour;
  }

  getPerksFour() {
    return this.perksFour;
  }

  /**
   * Actions
   */
  clickButtonOne() {
    return this.buttonOne.click();
  }

  clickButtonTwo() {
    return this.buttonTwo.click();
  }

  clickButtonThree() {
    return this.buttonThree.click();
  }

  clickButtonFour() {
    return this.buttonFour.click();
  }
}

export default FlywayPlanCard;
