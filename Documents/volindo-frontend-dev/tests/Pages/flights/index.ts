import { Page, Locator } from '@playwright/test';

class FlightsPage {
  private readonly page: Page;

  private readonly search: Locator;

  private readonly departure: Locator;

  private readonly destination: Locator;

  private readonly calendar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.search = page.getByTestId('flight-search-container');
    this.departure = page.getByTestId('flight-departure-origin');
    this.destination = page.getByTestId('flight-departure-destination');
    this.calendar = page.getByTestId('flight-departure-calendar');
  }

  getFlightsSearch = () => this.search;

  getDeparture = () => this.departure;

  getDestination = () => this.destination;

  getCalendar = () => this.calendar;
}

export default FlightsPage;
