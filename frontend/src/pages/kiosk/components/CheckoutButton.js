import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import '../../../styles/kiosk/checkoutButton.css';

function CheckoutButton({ orderCount, toggleCart, isCartOpen }) {
  return (
    <button className={`checkout-button ${isCartOpen ? 'rolling' : ''}`} onClick={toggleCart}>
      <FaShoppingCart className="cart-icon" />
      {orderCount > 0 && <span className="order-count-badge">{orderCount}</span>}
    </button>
  );
}

export default CheckoutButton;
