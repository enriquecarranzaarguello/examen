import { expect, chromium, Browser, Page } from '@playwright/test';

import { devPage, userEmail, password } from './tests/helper-functions';

const globalSetup = async () => {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  /*
    - set up browser and page
  */

  // const browser: Browser = await chromium.launch({ headless: true });
  // const context = await browser.newContext();
  // const page: Page = await context.newPage();

  const loginBtn = page.getByTestId('login');
  const emailInput = page.getByTestId('email');
  const passwordInput = page.getByTestId('password');
  const submitLoginBtn = page.getByTestId('submit-login');
  const flightClickable = page.getByTestId('vertical-flights');

  /*
  ================================================================
  - Start login flow 
  - local enviroment need to be runing
  - you can modify this on helpers-functions.ts
  */

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Volindo/);
  await loginBtn.click();

  await emailInput.fill(userEmail());
  await passwordInput.fill(password());
  await submitLoginBtn.click();

  await expect(flightClickable).toBeVisible({ timeout: 30000 });

  /*
   - save state of login
   - create json file to save state of login
   - and close the browser
  */

  await page.context().storageState({ path: 'login-state.json' });
  await browser.close();
};

export default globalSetup;
