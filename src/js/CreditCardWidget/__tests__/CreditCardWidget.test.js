import * as creditCardList from '../../__tests__/creditcard.data.json';
import CreditCardWidget from '../CreditCardWidget';

function dispatchEvent(el, eventType) {
  const event = new Event(eventType);
  el.dispatchEvent(event);
}

jest.useFakeTimers();
const spyOnSubmit = jest.spyOn(CreditCardWidget.prototype, 'onSubmit');
const spyDeterminePaymentSystem = jest.spyOn(CreditCardWidget.prototype, 'determinePaymentSystem');

const testAllCreditCards = test.each(creditCardList.list);
let creditCardWidget;

beforeAll(() => {
  document.body.innerHTML = '<div class="container"></div>';
  const container = document.querySelector('.container');
  creditCardWidget = new CreditCardWidget(container);
});

test('Should throw an error if container element not found', () => {
  const check = () => new CreditCardWidget();
  expect(check).toThrow();
});

test('Should call onSubmit method when the submit event occurs', () => {
  creditCardWidget.render();
  dispatchEvent(creditCardWidget.formEl, 'submit');
  expect(spyOnSubmit).toHaveBeenCalled();
});

test('Should call onSubmit method when the validate button is clicked', () => {
  creditCardWidget.render();
  creditCardWidget.validateBtnEl.click();
  expect(spyOnSubmit).toHaveBeenCalled();
});

test('Should call determinePaymentSystem method when the input event occurs', () => {
  creditCardWidget.render();
  dispatchEvent(creditCardWidget.inputEl, 'input');
  jest.runOnlyPendingTimers();
  expect(spyDeterminePaymentSystem).toHaveBeenCalled();
});

test('When the input event occurs again, the input delay timer is updated', () => {
  jest.runOnlyPendingTimers();
  creditCardWidget.render();
  creditCardWidget.inputDelayTimer = null;
  dispatchEvent(creditCardWidget.inputEl, 'input');
  expect(creditCardWidget.inputDelayTimer).not.toBeNull();
  const prevTimer = creditCardWidget.inputDelayTimer;
  dispatchEvent(creditCardWidget.inputEl, 'input');
  expect(creditCardWidget.inputDelayTimer).not.toBe(prevTimer);
});

test('Test the addition of the active class to the logo of the payment system whose card number is indicated in the input field', () => {
  creditCardWidget.render();
  const visaLogo = document.querySelector(`${CreditCardWidget.selectorImageLogo}-visa`);
  creditCardWidget.inputEl.value = '4716967102049860';
  creditCardWidget.determinePaymentSystem();
  expect(visaLogo.classList.contains('active')).toBeTruthy();
});

test('If the type of payment system is not determined, all logos are without a class.active', () => {
  creditCardWidget.render();
  const mirLogo = document.querySelector(`${CreditCardWidget.selectorImageLogo}-mir`);
  mirLogo.classList.add('active');
  creditCardWidget.inputEl.value = '8556920655034014';
  creditCardWidget.determinePaymentSystem();
  const activeLogos = document.querySelectorAll(`${CreditCardWidget.selectorImageLogo}.active`);
  expect(activeLogos.length).toBe(0);
});

test('Test invalid card number', () => {
  creditCardWidget.render();
  const mirLogo = document.querySelector(`${CreditCardWidget.selectorImageLogo}-mir`);
  mirLogo.classList.add('active');
  creditCardWidget.inputEl.value = '8556920655034014';
  creditCardWidget.validateBtnEl.click();
  expect(creditCardWidget.inputEl.classList.contains('valid')).toBeFalsy();
  expect(creditCardWidget.inputEl.classList.contains('invalid')).toBeTruthy();
});

describe('CreditCardWidget component test', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div class="container"></div>';
    const container = document.querySelector('.container');
    creditCardWidget = new CreditCardWidget(container);
  });

  testAllCreditCards('Credit card with number %s should be valid and "%s" payment system should be determined', (cardNumber, paymentSystem) => {
    creditCardWidget.render();
    const logoEl = document.querySelector(`${CreditCardWidget.selectorImageLogo}-${paymentSystem}`);
    creditCardWidget.inputEl.value = cardNumber;
    dispatchEvent(creditCardWidget.inputEl, 'input');
    creditCardWidget.validateBtnEl.click();
    jest.runOnlyPendingTimers();
    expect(logoEl.classList.contains('active')).toBeTruthy();
    expect(creditCardWidget.inputEl.classList.contains('valid')).toBeTruthy();
  });
});
