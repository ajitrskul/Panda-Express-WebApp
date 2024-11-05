import React from 'react';
import '../../../styles/kiosk.css';
import { FaShoppingCart } from 'react-icons/fa'; // Import shopping cart icon from react-icons

const CheckoutButton = ({ orderCount = 0, toggleCart }) => {
  return (
    <button className="checkout-button" onClick={toggleCart}>
      <FaShoppingCart className="cart-icon" />
      {orderCount > 0 && <span className="order-count-badge">{orderCount}</span>}
    </button>
  );
};

export default CheckoutButton;
