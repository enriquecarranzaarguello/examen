import { test, expect } from '@playwright/test';

import { devPage } from './helper-functions';

import NavBar from './Components/navBar';

import PaymentPage from './Pages/Payment';

import FlywayPlanCard from './Components/flywayPlanCard';

import GeneralModal from './Components/general-modal';

import SelectPaymentType from './Components/selectPaymentType';

// test.beforeAll(() => {
//   new HotelMockServer(3001);
// });

test('Test packages for flyway including pricing :', async ({ page }) => {
  const navBar = new NavBar(page);
  const paymentPage = new PaymentPage(page);
  const flywayPlanCard = new FlywayPlanCard(page);

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Flywaytoday/);

  await expect(navBar.getAvatar()).toBeVisible();
  await navBar.clickAvatar();
  await expect(navBar.getPayment()).toBeVisible();
  await navBar.clickPayment();
  await expect(paymentPage.pageTitleLocator()).toBeVisible();

  // check first card content
  await expect(flywayPlanCard.getCardOne()).toBeVisible();
  await expect(flywayPlanCard.getTitleOne()).toBeVisible();
  await expect(flywayPlanCard.getPriceOne()).toBeVisible();
  await expect(flywayPlanCard.getButtonOne()).toBeVisible();
  await expect(flywayPlanCard.getPerksOne()).toBeVisible();

  const priceElement = await flywayPlanCard.getPriceOne();
  const innerText = await priceElement.innerText();

  await expect(priceElement).toBeVisible();
  await expect(innerText).toEqual('2100');

  // check second card content
  await expect(flywayPlanCard.getCardTwo()).toBeVisible();
  await expect(flywayPlanCard.getTitleTwo()).toBeVisible();
  await expect(flywayPlanCard.getPriceTwo()).toBeVisible();
  await expect(flywayPlanCard.getButtonTwo()).toBeVisible();
  await expect(flywayPlanCard.getPerksTwo()).toBeVisible();

  const priceElement2 = await flywayPlanCard.getPriceTwo();
  const innerText2 = await priceElement2.innerText();

  await expect(priceElement2).toBeVisible();
  await expect(innerText2).toEqual('6000');

  // check third card content
  await expect(flywayPlanCard.getCardThree()).toBeVisible();
  await expect(flywayPlanCard.getTitleThree()).toBeVisible();
  await expect(flywayPlanCard.getPriceThree()).toBeVisible();
  await expect(flywayPlanCard.getButtonThree()).toBeVisible();
  await expect(flywayPlanCard.getPerksThree()).toBeVisible();

  const priceElement3 = await flywayPlanCard.getPriceThree();
  const innerText3 = await priceElement3.innerText();

  await expect(priceElement3).toBeVisible();
  await expect(innerText3).toEqual('10800');

  // check fourth card content
  await expect(flywayPlanCard.getCardFour()).toBeVisible();
  await expect(flywayPlanCard.getTitleFour()).toBeVisible();
  await expect(flywayPlanCard.getPriceFour()).toBeVisible();
  await expect(flywayPlanCard.getButtonFour()).toBeVisible();
  await expect(flywayPlanCard.getPerksFour()).toBeVisible();

  const priceElement4 = await flywayPlanCard.getPriceFour();
  const innerText4 = await priceElement4.innerText();

  await expect(priceElement4).toBeVisible();
  await expect(innerText4).toEqual('19200');
});

test('test that plans open payment modal and its options work :', async ({
  page,
}) => {
  const navBar = new NavBar(page);
  const paymentPage = new PaymentPage(page);
  const flywayPlanCard = new FlywayPlanCard(page);
  const generalModal = new GeneralModal(page);
  const selectPaymentType = new SelectPaymentType(page);

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Flywaytoday/);

  await expect(navBar.getAvatar()).toBeVisible();
  await navBar.clickAvatar();
  await expect(navBar.getPayment()).toBeVisible();
  await navBar.clickPayment();
  await expect(paymentPage.pageTitleLocator()).toBeVisible();

  // test plans payment modal
  await flywayPlanCard.clickButtonOne();
  await expect(generalModal.getContainer()).toBeVisible();
  await expect(generalModal.getCloseButton()).toBeVisible();
  await expect(selectPaymentType.getContainer()).toBeVisible();

  await selectPaymentType.clickStripe();
  await expect(selectPaymentType.getStripeForm()).toBeVisible();

  await selectPaymentType.clickConekta();
  await expect(selectPaymentType.getMonthsSelector()).toBeVisible();
  await expect(selectPaymentType.getPhoneContainer()).toBeVisible();
  await expect(selectPaymentType.getMonthsPhoneCode()).toBeVisible();
  await expect(selectPaymentType.getFirstPaymentMonthSelector()).toBeVisible();
  await expect(selectPaymentType.getSecondPaymentMonthSelector()).toBeVisible();
  await expect(selectPaymentType.getThirdPaymentMonthSelector()).toBeVisible();

  await selectPaymentType.clickMercadoPago();
  await expect(selectPaymentType.getMercadoPagoForm()).toBeVisible();
});

test('test coneckta payment quantity shown depending on plan', async ({
  page,
}) => {
  const navBar = new NavBar(page);
  const paymentPage = new PaymentPage(page);
  const flywayPlanCard = new FlywayPlanCard(page);
  const generalModal = new GeneralModal(page);
  const selectPaymentType = new SelectPaymentType(page);

  await page.goto(devPage());
  await expect(page).toHaveTitle(/Dashboard | Flywaytoday/);

  await expect(navBar.getAvatar()).toBeVisible();
  await navBar.clickAvatar();
  await expect(navBar.getPayment()).toBeVisible();
  await navBar.clickPayment();
  await expect(paymentPage.pageTitleLocator()).toBeVisible();

  await flywayPlanCard.clickButtonOne();
  await expect(generalModal.getContainer()).toBeVisible();
  await selectPaymentType.clickConekta();
  await expect(selectPaymentType.getMonthsSelector()).toBeVisible();
  await expect(selectPaymentType.getPackPriceOne()).toBeVisible();
  const priceElement1 = await selectPaymentType.getPackPriceOne();
  const innerText1 = await priceElement1.innerText();
  await expect(priceElement1).toBeVisible();
  await expect(innerText1).toEqual('$ 2100 MXN');
  const priceElement2 = await selectPaymentType.getPackPriceTwo();
  const innerText2 = await priceElement2.innerText();
  await expect(priceElement2).toBeVisible();
  await expect(innerText2).toEqual('$ 700 MXN');
  const priceElement3 = await selectPaymentType.getPackPriceThree();
  const innerText3 = await priceElement3.innerText();
  await expect(priceElement3).toBeVisible();
  await expect(innerText3).toEqual('$ 350 MXN');

  await generalModal.close();

  await flywayPlanCard.clickButtonTwo();
  await expect(generalModal.getContainer()).toBeVisible();
  await selectPaymentType.clickConekta();
  await expect(selectPaymentType.getMonthsSelector()).toBeVisible();
  await expect(selectPaymentType.getPackPriceOne()).toBeVisible();
  const element1 = await selectPaymentType.getPackPriceOne();
  const inner1 = await element1.innerText();
  await expect(element1).toBeVisible();
  await expect(inner1).toEqual('$ 6000 MXN');
  const element2 = await selectPaymentType.getPackPriceTwo();
  const inner2 = await element2.innerText();
  await expect(element2).toBeVisible();
  await expect(inner2).toEqual('$ 2000 MXN');
  const element3 = await selectPaymentType.getPackPriceThree();
  const inner3 = await element3.innerText();
  await expect(element3).toBeVisible();
  await expect(inner3).toEqual('$ 1000 MXN');

  await generalModal.close();

  await flywayPlanCard.clickButtonThree();
  await expect(generalModal.getContainer()).toBeVisible();
  await selectPaymentType.clickConekta();
  await expect(selectPaymentType.getMonthsSelector()).toBeVisible();
  await expect(selectPaymentType.getPackPriceOne()).toBeVisible();

  const cardThree = await selectPaymentType.getPackPriceOne();
  const inCard3 = await cardThree.innerText();
  await expect(cardThree).toBeVisible();
  await expect(inCard3).toEqual('$ 10800 MXN');

  const lastTestEle = await selectPaymentType.getPackPriceTwo();
  const actualText = await lastTestEle.innerText();
  await expect(lastTestEle).toBeVisible();
  await expect(actualText).toEqual('$ 3600 MXN');

  const secondLast = await selectPaymentType.getPackPriceThree();
  const actual2 = await secondLast.innerText();
  await expect(secondLast).toBeVisible();
  await expect(actual2).toEqual('$ 1800 MXN');

  await generalModal.close();

  await flywayPlanCard.clickButtonFour();
  await expect(generalModal.getContainer()).toBeVisible();
  await selectPaymentType.clickConekta();
  await expect(selectPaymentType.getMonthsSelector()).toBeVisible();
  await expect(selectPaymentType.getPackPriceOne()).toBeVisible();

  const planOne = await selectPaymentType.getPackPriceOne();
  const cardTextOne = await planOne.innerText();
  await expect(planOne).toBeVisible();
  await expect(cardTextOne).toEqual('$ 19200 MXN');

  const planTwo = await selectPaymentType.getPackPriceTwo();
  const cardTextTwo = await planTwo.innerText();
  await expect(planTwo).toBeVisible();
  await expect(cardTextTwo).toEqual('$ 6400 MXN');

  const planThree = await selectPaymentType.getPackPriceThree();
  const cardTextThree = await planThree.innerText();
  await expect(planThree).toBeVisible();
  await expect(cardTextThree).toEqual('$ 3200 MXN');
});
