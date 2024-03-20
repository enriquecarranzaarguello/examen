import { test, expect } from '@playwright/test';

import { devPage } from './helper-functions';

test('checking profile in diferent page old profile', async ({ page }) => {
  // Create a locator.
  const clickprofile = page.getByTestId('profile-header-link');
  const profileImage = page.getByTestId('profile-personal-info');

  await page.goto(devPage());
  await clickprofile.click();
  await page.waitForSelector('data-testid="profile-personal-info"');
  await expect(profileImage).toBeVisible();
});
