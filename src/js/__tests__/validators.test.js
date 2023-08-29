import validateCreditCardNumber from '../validators';
import * as creditCardList from './creditcard.data.json';

const testAllCreditCards = test.each(creditCardList.list);

testAllCreditCards('Credit card with number %s should be valid.', (cardNumber, paymentSystem) => {
  const result = validateCreditCardNumber(cardNumber);
  expect(result).toBe(paymentSystem !== null);
});
