import { test, expect } from '@playwright/test';
import { devPage, hotelMenuUrl, proposalPageUrl } from './helper-functions';

import NavBar from './Components/navBar';
import HotelsSearch from './Components/hotelsSearch';

import HotelMenu from './Pages/Hotels/menu';

import RoomSelectionPage from './Pages/Hotels/rooms';

import ProposalPage from './Pages/Hotels/proposal';

import HotelMockServer from './Mocks/hotelMockServer';

test.beforeAll(() => {
  new HotelMockServer(3001);
});

test('Fill hotels search and submit succesfuly', async ({ page }) => {
  const navBar = new NavBar(page);
  const hotelsSearch = new HotelsSearch(page);
  const hotelMenu = new HotelMenu(page);
  const roomSelect = new RoomSelectionPage(page);
  const proposalPage = new ProposalPage(page);

  const destinations = 'Miami';

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Flywaytoday/);

  await expect(navBar.getAvatar()).toBeVisible();
  await expect(hotelsSearch.getDestinations()).toBeVisible();
  await hotelsSearch.clickDestinations();
  const inputSelector = '.rs-picker-search-input';

  await page.fill(inputSelector, destinations);
  const firstDestinationItem = await page
    .getByTestId('hotel-search-destination-item')
    .first();
  await expect(firstDestinationItem).toBeVisible();
  await page.keyboard.press('Enter');
  await page.click('.DateRangePickerInput_calendarIcon');

  //  change the date to run the test day,(DD, NU, MMM)
  const partialAriaLabel = 'We, 7 Feb';
  const lastDay = 'We, 28 Feb';

  await page.click('#startDate');
  await page.fill('#startDate', partialAriaLabel);
  await page.click('#endDate');
  await page.fill('#endDate', lastDay);

  await hotelsSearch.clickSearchButton();

  await expect(hotelMenu.resultsContainerLocator()).toBeVisible();

  await expect(hotelMenu.firsResultCard()).toBeVisible();

  await expect(hotelMenu.getFirstResultCardPrice()).toBeVisible();

  await hotelMenu.clickResultCardButton();

  //room selection
  await page.goto(hotelMenuUrl());

  await expect(navBar.getAvatar()).toBeVisible();

  await expect(roomSelect.getMainContainer()).toBeVisible();
  await expect(roomSelect.getAbout()).toBeVisible();
  await expect(roomSelect.getFirstRoomCard()).toBeVisible();
  await expect(roomSelect.getFirstCardButton()).toBeVisible();
  await roomSelect.clickFirstCardButton();

  // proposal page
  await page.goto(proposalPageUrl());

  await expect(page.getByTestId('dropdown-avatar-secondary')).toBeVisible();

  await expect(proposalPage.pageTitleLocator()).toBeVisible();
});
