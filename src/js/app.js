import CreditCardWidget from './CreditCardWidget/CreditCardWidget';
import './CreditCardWidget/CreditCardWidget.css';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container.credit-card-widget');
  const widget = new CreditCardWidget(container);
  widget.render();
});
