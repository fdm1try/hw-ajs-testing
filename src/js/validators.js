export default function validateCreditCardNumber(cardNumber) {
  const number = cardNumber.toString().replace(/\D/g, '');
  let sum = 0;
  let odd = false;
  for (let i = number.length - 1; i >= 0; i -= 1) {
    const digit = parseInt(number[i], 10);
    if (!odd) {
      sum += digit;
    } else {
      sum += digit * 2 - (digit > 4 ? 9 : 0);
    }
    odd = !odd;
  }
  return sum !== 0 && sum % 10 === 0;
}
