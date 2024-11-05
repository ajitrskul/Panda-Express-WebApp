import React from 'react';
import '../../../styles/kiosk.css';
import { FaShoppingCart } from 'react-icons/fa';

const CheckoutButton = ({ orderCount = 0, toggleCart, isCartOpen }) => {
  return (
    <button
      className={`checkout-button ${isCartOpen ? 'rolling' : ''}`}
      onClick={toggleCart}
    >
      <FaShoppingCart className="cart-icon" />
      {orderCount > 0 && <span className="order-count-badge">{orderCount}</span>}
    </button>
  );
};

export default CheckoutButton;
