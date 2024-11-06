import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../../styles/kiosk/cart.css';

function Cart({ isOpen, toggleCart, cartItems }) {
  return (
    <div className={`cart-offcanvas ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-button" onClick={toggleCart}>
          <FaTimes />
        </button>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
              </div>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="cart-totals">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>${calculateSubtotal(cartItems).toFixed(2)}</span>
          </div>
          <div className="cart-tax">
            <span>Tax</span>
            <span>${calculateTax(cartItems).toFixed(2)}</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <span>${calculateTotal(cartItems).toFixed(2)}</span>
          </div>
        </div>
        <button className="checkout-footer-button">Checkout</button>
      </div>
    </div>
  );
}

function calculateSubtotal(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function calculateTax(cartItems) {
  const subtotal = calculateSubtotal(cartItems);
  const taxRate = 0.08; // Adjust according to your local tax rate
  return subtotal * taxRate;
}

function calculateTotal(cartItems) {
  return calculateSubtotal(cartItems) + calculateTax(cartItems);
}

export default Cart;
