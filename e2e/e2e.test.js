import puppetteer from 'puppeteer';
//import { CreditCardWidget } from '../src/js/CreditCardWidget/CreditCardWidget.js'
import { fork } from 'child_process';

jest.setTimeout(300000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const creditCards = [
    ['MasterCard', '5527330087282947', 'mastercard'],
    ['Visa', '4929593411029055', 'visa'],
    ['МИР', '2202151765051068', 'mir'],
    ['JCB', '3557116335023060', 'jcb'],
    ['Discover', '6011570607428253', 'discover'],
    ['Diners club', '38191379843199', 'diners'],
    ['American Express', '374012461119425', 'amex'],
    //['MasterCard', '855692065503401', null],
  ];

  const testMultipleCards = test.each(creditCards);
  
  const baseUrl = 'http://localhost:9000';
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: false,
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  testMultipleCards('Test card numnber validation and payment system highlight for %s credit card', async (_, number, paymentSystem) => {
    await page.goto(baseUrl);
    const input = await page.waitForSelector('.credit-card-widget-number_input');
    const validateBtn = await page.waitForSelector('.credit-card-widget-validate_btn');
    await input.type(number);
    await validateBtn.click();
    await page.waitForSelector('.credit-card-widget-number_input.valid');
    await delay(400);
    await page.waitForSelector(`.credit-card-widget-img-${paymentSystem}.active`);
    input.dispose();
    validateBtn.dispose();
  });

  test('Test invalid credit card number', async () => {
    await page.goto(baseUrl);
    const input = await page.waitForSelector('.credit-card-widget-number_input');
    const validateBtn = await page.waitForSelector('.credit-card-widget-validate_btn');
    await input.type('855692065503401');
    await validateBtn.click();
    await delay(400);
    await page.$('.credit-card-widget-number_input.invalid');
    const activeLogo = await page.$(`.credit-card-widget-img.active`);
    expect(activeLogo).toBeNull();
    input.dispose();
    validateBtn.dispose();
  });
});