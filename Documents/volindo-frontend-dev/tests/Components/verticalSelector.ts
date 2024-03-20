import { Page, Locator, ElementHandle } from 'playwright';

class VerticalSelector {
  private readonly page: Page;

  private readonly flightSelector: Locator;

  private readonly hotelSelector: Locator;

  private readonly supplierSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.flightSelector = page.getByTestId('vertical-flights');
    this.hotelSelector = page.getByTestId('vertical-stays');
    this.supplierSelector = page.getByTestId('vertical-suppliers');
  }

  // Locators

  // Actions
  clickFlights() {
    return this.flightSelector.click();
  }

  async selectHotel(): Promise<ElementHandle<Element> | null> {
    const locator = this.hotelSelector;
    return locator.elementHandle();
  }

  async selectSupplier(): Promise<ElementHandle<Element> | null> {
    const locator = this.supplierSelector;
    return locator.elementHandle();
  }
}

export default VerticalSelector;
