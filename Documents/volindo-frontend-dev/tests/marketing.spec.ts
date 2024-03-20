import { test, expect } from '@playwright/test';
import { devPage } from './helper-functions';

import NavBar from './Components/navBar';
import MarketingPage from './Pages/Marketing';

test('Marketing page POM :', async ({ page }) => {
  await page.goto(devPage());

  const navBar = new NavBar(page);
  const marketingPage = new MarketingPage(page);

  // check avatar exist to verify we are logged in
  await expect(navBar.getAvatar()).toBeVisible();

  navBar.clickMarketing();

  await expect(marketingPage.checkTitle()).toBeVisible();
  await expect(marketingPage.getLinksBar()).toBeVisible();
});
