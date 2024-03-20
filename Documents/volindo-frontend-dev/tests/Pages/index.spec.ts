import { Page } from '@playwright/test';

class LandingPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Define a method for each element you want to interact with.
  async navigate() {
    await this.page.goto(`${process.env.TEST_URL}/login`);
  }

  async getTitle() {
    return this.page.title();
  }

  // Add more methods for other elements on the page.
}

export default LandingPage;
