import validateCreditCardNumber from '../validators';
import PaymentSystem from '../PaymentSystem';

export default class CreditCardWidget {
  static get markup() {
    return `
      <div class="credit-card-widget-img-list">
        <div class="credit-card-widget-img credit-card-widget-img-mir"></div>
        <div class="credit-card-widget-img credit-card-widget-img-visa"></div>
        <div class="credit-card-widget-img credit-card-widget-img-mastercard"></div>
        <div class="credit-card-widget-img credit-card-widget-img-amex"></div>
        <div class="credit-card-widget-img credit-card-widget-img-discover"></div>
        <div class="credit-card-widget-img credit-card-widget-img-jcb"></div>
        <div class="credit-card-widget-img credit-card-widget-img-diners"></div>
      </div>
      <form class="credit-card-widget-form">
        <input type="text" class="credit-card-widget-number_input">
        <button type="submit" class="credit-card-widget-validate_btn">Click to Validate</button>
      </form>
    `;
  }

  static get selectorImageLogo() {
    return '.credit-card-widget-img';
  }

  static get selectorForm() {
    return '.credit-card-widget-form';
  }

  static get selectorInput() {
    return '.credit-card-widget-number_input';
  }

  static get selectorValidateBtn() {
    return '.credit-card-widget-validate_btn';
  }

  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Container element not found!');
    }
    this.container = container;
    this.determinePaymentSystem = this.determinePaymentSystem.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this.inputTimeout = 400;
  }

  get cardNumber() {
    return this.inputEl.value.replace(/\D/g, '');
  }

  render() {
    this.container.innerHTML = CreditCardWidget.markup;
    this.formEl = document.querySelector(CreditCardWidget.selectorForm);
    this.inputEl = document.querySelector(CreditCardWidget.selectorInput);
    this.validateBtnEl = document.querySelector(CreditCardWidget.selectorValidateBtn);
    this.registerEventListeners();
  }

  registerEventListeners() {
    this.formEl.addEventListener('submit', this.onSubmit);
    this.inputEl.addEventListener('input', this.onInput);
  }

  onSubmit(event) {
    event.preventDefault();
    let [toAdd, toRemove] = ['invalid', 'valid'];
    if (validateCreditCardNumber(this.cardNumber)) {
      [toAdd, toRemove] = [toRemove, toAdd];
    }
    this.inputEl.classList.add(toAdd);
    this.inputEl.classList.remove(toRemove);
  }

  onInput() {
    if (this.inputDelayTimer) {
      clearTimeout(this.inputDelayTimer);
      this.inputDelayTimer = null;
    }
    this.inputEl.classList.remove('valid', 'invalid');
    this.inputDelayTimer = setTimeout(this.determinePaymentSystem, this.inputTimeout);
  }

  determinePaymentSystem() {
    document.querySelectorAll(`${CreditCardWidget.selectorImageLogo}.active`).forEach((node) => {
      node.classList.remove('active');
    });
    const number = this.cardNumber;
    if (number.length > 5) {
      const paymentSystem = PaymentSystem.determine(number);
      if (paymentSystem) {
        const logoEl = document.querySelector(`${CreditCardWidget.selectorImageLogo}-${paymentSystem}`);
        logoEl.classList.add('active');
      }
    }
  }
}
