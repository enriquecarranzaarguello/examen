import { test, expect } from '@playwright/test';
import { devPage } from './helper-functions';

import Profile from './Pages/Profile';
import NavBar from './Components/navBar';

test('Test switching tabs within profile/wallet ', async ({ page }) => {
  await page.goto(devPage());

  const navBar = new NavBar(page);
  const profile = new Profile(page);

  await expect(navBar.getAvatar()).toBeVisible();

  navBar.clickProfile();
  await expect(profile.getTabControls()).toBeVisible();

  await profile.clickAgentSlelector();
  await expect(profile.getAboutSection()).toBeVisible();
  await expect(profile.getUserName()).toBeVisible();
  await expect(profile.getUserEmail()).toBeVisible();

  await profile.clickWalletSelector();
  await expect(profile.getWalletAbout()).toBeVisible();
  await expect(profile.getWalletWithdraw()).toBeVisible();
});

test('Test share modal and its content, also close', async ({ page }) => {
  await page.goto(devPage());

  const navBar = new NavBar(page);
  const profile = new Profile(page);

  await expect(navBar.getAvatar()).toBeVisible();

  navBar.clickProfile();

  await profile.clickShareButton();

  await expect(profile.getShareModal()).toBeVisible();

  await expect(profile.getShareModalComp().getTitle()).toBeVisible();

  await expect(profile.getShareModalComp().getLink()).toBeVisible();

  await expect(profile.getShareModalComp().getCopyButton()).toBeVisible();

  profile.getShareModalComp().clickClose();

  await expect(profile.getShareModal()).not.toBeVisible();
});

test("Test edeting fields in agent's profile", async ({ page }) => {
  const profileInfo = {
    name: 'tester name',
    adress: 'fake address, 35 at laundry state',
  };

  const { name, adress } = profileInfo;

  const navBar = new NavBar(page);
  const profile = new Profile(page);

  await page.goto(devPage());

  await expect(navBar.getAvatar()).toBeVisible();

  navBar.clickProfile();

  profile.clickEditProfile();

  await expect(profile.getEditModal().getTitle()).toBeVisible();

  await expect(profile.getEditModal().getSubmitButton()).toBeVisible();

  await page.fill('[data-testid="edit-modal-name"]', name);

  await page.fill('[data-testid="edit-modal-address"]', adress);

  await profile.getEditModal().clickSubmit();

  await expect(profile.getEditModal().getConfirmModalTitle()).toBeVisible();

  await profile.getEditModal().clickConfirmButton();

  await expect(profile.getUserName()).toHaveText(name);
});
