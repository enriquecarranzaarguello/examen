import { Page } from 'playwright';
import NavBar from 'tests/Components/navBar';

import VerticalSelector from 'tests/Components/verticalSelector';

import HotelsSearch from 'tests/Components/hotelsSearch';

class Home {
  private readonly page: Page;

  private readonly navBar: NavBar;

  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
  }

  getNavBar() {
    return this.navBar;
  }

  async getTitle() {
    return this.page.title();
  }
}

export default Home;
