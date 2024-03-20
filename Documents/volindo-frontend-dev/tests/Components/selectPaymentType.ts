import { Page, Locator } from 'playwright';

class SelectPaymentType {
  private readonly page: Page;

  private readonly paymentTypeContainer: Locator;

  private readonly stripe: Locator;

  private readonly conekta: Locator;

  private readonly mercadoPago: Locator;

  private readonly stripeForm: Locator;

  private readonly mercadoPagoForm: Locator;

  private readonly conektaForm: Locator;

  private readonly monthsSelector: Locator;

  private readonly phoneContainer: Locator;

  private readonly monthsPhoneCode: Locator;

  private readonly monthsPhoneInput: Locator;

  private readonly paymentMonthSelectorOne: Locator;

  private readonly paymentMonthSelectorTwo: Locator;

  private readonly paymentMonthSelectorThree: Locator;

  private readonly packTittleOne: Locator;

  private readonly packPriceOne: Locator;

  private readonly packTittleTwo: Locator;

  private readonly packPriceTwo: Locator;

  private readonly packTittleThree: Locator;

  private readonly packPriceThree: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentTypeContainer = page.getByTestId('payment-methods');
    this.stripe = page.getByTestId('payment-method-stripe');
    this.conekta = page.getByTestId('payment-method-coneckta');
    this.mercadoPago = page.getByTestId('payment-method-mercado');
    this.stripeForm = page.getByTestId('stripe-form');
    this.monthsSelector = page.getByTestId('payments-months');
    this.phoneContainer = page.getByTestId('payments-months-phone');
    this.conektaForm = page.getByTestId('coneckta-form');
    this.mercadoPagoForm = page.getByTestId('mercado-pago-form');
    this.monthsPhoneCode = page.getByTestId('payments-months-phone-code');
    this.monthsPhoneInput = page.getByTestId('payments-months-phone-input');
    this.paymentMonthSelectorOne = page.getByTestId(
      'payments-month-selector-1'
    );
    this.paymentMonthSelectorTwo = page.getByTestId(
      'payments-month-selector-2'
    );
    this.paymentMonthSelectorThree = page.getByTestId(
      'payments-month-selector-3'
    );

    this.packTittleOne = page.getByTestId('package-tittle-1');
    this.packPriceOne = page.getByTestId('package-price-1');
    this.packTittleTwo = page.getByTestId('package-tittle-2');
    this.packPriceTwo = page.getByTestId('package-price-2');
    this.packTittleThree = page.getByTestId('package-tittle-3');
    this.packPriceThree = page.getByTestId('package-price-3');
  }

  /**
   * ocators
   */
  getContainer() {
    return this.paymentTypeContainer;
  }

  getStripe() {
    return this.stripe;
  }

  getConekta() {
    return this.conekta;
  }

  getMercadoPago() {
    return this.mercadoPago;
  }

  getStripeForm() {
    return this.stripeForm;
  }

  getMonthsSelector() {
    return this.monthsSelector;
  }

  getPhoneContainer() {
    return this.phoneContainer;
  }

  getConektaForm() {
    return this.conektaForm;
  }

  getMercadoPagoForm() {
    return this.mercadoPagoForm;
  }

  getMonthsPhoneCode() {
    return this.monthsPhoneCode;
  }

  getMonthsPhoneInput() {
    return this.monthsPhoneInput;
  }

  getFirstPaymentMonthSelector() {
    return this.paymentMonthSelectorOne;
  }

  getSecondPaymentMonthSelector() {
    return this.paymentMonthSelectorTwo;
  }

  getThirdPaymentMonthSelector() {
    return this.paymentMonthSelectorThree;
  }

  getPackTittleOne() {
    return this.packTittleOne;
  }

  getPackPriceOne() {
    return this.packPriceOne;
  }

  getPackTittleTwo() {
    return this.packTittleTwo;
  }

  getPackPriceTwo() {
    return this.packPriceTwo;
  }

  getPackTittleThree() {
    return this.packTittleThree;
  }

  getPackPriceThree() {
    return this.packPriceThree;
  }

  /**
   * Actions
   */

  clickStripe() {
    return this.stripe.click();
  }

  clickConekta() {
    return this.conekta.click();
  }

  clickMercadoPago() {
    return this.mercadoPago.click();
  }
}

export default SelectPaymentType;
