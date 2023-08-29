import PaymentSystem from '../PaymentSystem';
import * as creditCardList from './creditcard.data.json';

const testAllCreditCards = test.each(creditCardList.list);

testAllCreditCards('Payment system of credit card with number %s should be %s', (cardNumber, expected) => {
  const result = PaymentSystem.determine(cardNumber);
  expect(result).toBe(expected);
});

test('Payment systems list should be: mir, visa, mastercard, amex, discover, jcb, diners', () => {
  const result = PaymentSystem.list;
  const expected = ['mir', 'visa', 'mastercard', 'amex', 'discover', 'jcb', 'diners'];
  expect(result).toEqual(expected);
});
