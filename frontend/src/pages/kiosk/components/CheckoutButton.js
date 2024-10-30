import React from 'react';
import '../../../styles/kiosk.css';

const CheckoutButton = ({ price = "$XXX.XX" }) => {
  return (
    <button className="checkout-button">
      <span className="checkout-text">CHECKOUT</span>
      <span className="checkout-price">{price}</span>
    </button>
  );
};

export default CheckoutButton;
