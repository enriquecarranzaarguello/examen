import { Page, Locator } from 'playwright';

class RoomSelectionPage {
  private readonly title: Locator;

  private readonly ameneties: Locator;

  private readonly container: Locator;

  private readonly about: Locator;

  private readonly firstRoomCard: Locator;

  private readonly firstCardButton: Locator;

  private readonly roomsContainer: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('chosen-hotel-title');
    this.container = page.getByTestId('chosen-hotel-details');
    this.about = page.getByTestId('chosen-hotel-details-about');
    this.ameneties = page.getByTestId('chosen-hotel-details-amenities');

    this.roomsContainer = page.getByTestId('chosen-hotel-rooms-container');
    this.firstRoomCard = page.getByTestId('chosen-hotel-room-card-0');
    this.firstCardButton = page.getByTestId('chosen-hotel-room-card-button-0');
  }

  /*
    - locators
  */

  getTitle() {
    return this.title;
  }

  getAmeneties() {
    return this.ameneties;
  }

  getMainContainer() {
    return this.container;
  }

  getAbout() {
    return this.about;
  }

  getFirstRoomCard() {
    return this.firstRoomCard;
  }

  getFirstCardButton() {
    return this.firstCardButton;
  }

  /*
    - actions
  */

  clickFirstCardButton() {
    return this.firstCardButton.click();
  }
}

export default RoomSelectionPage;
