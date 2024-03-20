import { test, expect } from '@playwright/test';
// import Home from './Pages/Home';

import { devPage } from './helper-functions';
// import MarketingActions from './Sections/marketingAction';

test('Clicking and revising marketing page', async ({ page }) => {
  const clickMarketing = page.getByTestId('marketing-header-link');
  const marketingTitle = page.getByTestId('marketing-title');

  // const marketingTitle = MarketingActions.marketingTitle();

  await page.goto(devPage());
  await clickMarketing.click();
  // TODO check assertions only passing when on debug mode
  await expect(marketingTitle).toBeVisible({ timeout: 30000 });
});
