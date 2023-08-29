function startsWithAny(string, ...args) {
  for (const arg of args) {
    if (Array.isArray(arg)) {
      const range = [];
      for (let i = arg[0]; i <= arg[1]; i += 1) {
        range.push(i);
      }
      if (startsWithAny(string, ...range)) {
        return true;
      }
    } else if (string.startsWith(arg)) {
      return true;
    }
  }
  return false;
}

export const PAYMENT_SYSTEM_LIST = {
  MIR: 'mir',
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMERICAN_EXPRESS: 'amex',
  DISCOVER: 'discover',
  JCB: 'jcb',
  DINERS_CLUB: 'diners',
};

export default class PaymentSystem {
  static get list() {
    const {
      MIR, VISA, MASTERCARD, AMERICAN_EXPRESS, DISCOVER, JCB, DINERS_CLUB,
    } = PAYMENT_SYSTEM_LIST;
    return [MIR, VISA, MASTERCARD, AMERICAN_EXPRESS, DISCOVER, JCB, DINERS_CLUB];
  }

  static determine(cardNumber) {
    const number = cardNumber.toString().replace(/\D/g, '');
    if (number.startsWith(4)) {
      return PAYMENT_SYSTEM_LIST.VISA;
    }
    if (startsWithAny(number, [2200, 2204])) {
      return PAYMENT_SYSTEM_LIST.MIR;
    }
    if (startsWithAny(number, 2131, 1800, [3528, 3589])) {
      return PAYMENT_SYSTEM_LIST.JCB;
    }
    if (startsWithAny(number, 6011, [644, 649], 65)) {
      return PAYMENT_SYSTEM_LIST.DISCOVER;
    }
    if (startsWithAny(number, [300, 305], 36, 38, 39)) {
      return PAYMENT_SYSTEM_LIST.DINERS_CLUB;
    }
    if (startsWithAny(number, [34, 37])) {
      return PAYMENT_SYSTEM_LIST.AMERICAN_EXPRESS;
    }
    if (
      startsWithAny(number, [51, 55], [2221, 2229], [223, 229], [23, 26], 270, 271, 2720)
    ) {
      return PAYMENT_SYSTEM_LIST.MASTERCARD;
    }
    return null;
  }
}
