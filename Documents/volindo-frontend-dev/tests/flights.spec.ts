import { test, expect } from '@playwright/test';
import { devPage } from './helper-functions';

import NavBar from './Components/navBar';
import VerticalSelector from './Components/verticalSelector';
import FlightsPage from './Pages/Flights';

test('Flights navigation test POM', async ({ page }) => {
  const verticalSelector = new VerticalSelector(page);
  const flightsPage = new FlightsPage(page);
  const navBar = new NavBar(page);

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Flywaytoday/);

  await expect(navBar.getAvatar()).toBeVisible();
  await verticalSelector.clickFlights();
  await expect(flightsPage.getDeparture()).toBeVisible();
});
