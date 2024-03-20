import { test, expect } from '@playwright/test';

import { devPage } from './helper-functions';

test('checking flights logged in flow ', async ({ page }) => {
  // Create a locators\

  const clickFlights = page.getByTestId('vertical-flights');
  const departureOrigin = page.getByTestId('flight-departure-origin');

  const bestFilter = page.getByTestId('flight-filter-best-button');
  const cehapestFilter = page.getByTestId('flight-filter-best-button');
  const fastesttFilter = page.getByTestId('flight-filter-best-button');

  const locationResult = page.getByTestId('location-results').first();

  // const arriveResult = page.getByTestId('airport-1');

  /*
  ================================================================
  - Start login flow 
  - local enviroment need to be runing
  - you can modify this on helpers-functions.ts
  */

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Volindo/);

  /* ============================================================== */
  /*
   - flights flow
  */

  await clickFlights.click();

  await expect(departureOrigin).toBeVisible({ timeout: 30000 });

  await page.click('[data-testid="flight-departure-origin"]');
  await page.fill('[data-testid="departure-input-origin"]', 'lax');
  await expect(locationResult).toBeVisible({ timeout: 30000 });
  await page.keyboard.press('Enter');

  await page.click('[data-testid="flight-departure-destination"]');
  await page.fill('[data-testid="departure-input-destination"]', 'new york');
  // await expect(arriveResult).toBeVisible({ timeout: 50000 });
  await page.keyboard.press('Enter');

  await page.waitForTimeout(1000);

  await page.click('.DateRangePickerInput_calendarIcon');
  //  change the date to run the test day,(DD, NU, MMM)
  const partialAriaLabel = 'We, 15 Nov';
  const lastDay = 'We, 22 Nov';

  await page.click('#startDate');
  await page.fill('#startDate', partialAriaLabel);

  await page.click('#endDate');
  await page.fill('#endDate', lastDay);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await page.waitForTimeout(2000);

  await bestFilter.click();
  await cehapestFilter.click();
  await fastesttFilter.click();

  await page.pause();
});
