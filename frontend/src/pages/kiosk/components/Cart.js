// Cart.js
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
              <img
                src={
                  item.image ||
                  item.components?.sides[0]?.image ||
                  item.components?.entrees[0]?.image
                }
                alt={item.product_name || item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.product_name || item.name}</p>
                {item.components && (
                  <div className="cart-item-components">
                    {item.components.sides.length > 0 && (
                      <div>
                        <strong>Sides:</strong>
                        <ul>
                          {item.components.sides.map((side, idx) => (
                            <li key={`side-${idx}`}>{side.product_name || side.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.components.entrees.length > 0 && (
                      <div>
                        <strong>Entrees:</strong>
                        <ul>
                          {item.components.entrees.map((entree, idx) => (
                            <li key={`entree-${idx}`}>{entree.product_name || entree.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
              </div>
              <p className="cart-item-price">
                ${ (getItemPrice(item) * item.quantity).toFixed(2) }
              </p>
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

function getItemPrice(item) {
  // Use dummy value if price is not available
  if (item.price) {
    return item.price;
  } else if (item.components) {
    // Sum up the prices of components if available
    const sidesPrice = item.components.sides.reduce((sum, side) => sum + (side.price || 0), 0);
    const entreesPrice = item.components.entrees.reduce((sum, entree) => sum + (entree.price || 0), 0);
    return sidesPrice + entreesPrice;
  } else {
    return item.premium_addition || 0;
  }
}

function calculateSubtotal(cartItems) {
  return cartItems.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
}

function calculateTax(cartItems) {
  const subtotal = calculateSubtotal(cartItems);
  const taxRate = 0.0825; 
  return subtotal * taxRate;
}

function calculateTotal(cartItems) {
  return calculateSubtotal(cartItems) + calculateTax(cartItems);
}

export default Cart;
