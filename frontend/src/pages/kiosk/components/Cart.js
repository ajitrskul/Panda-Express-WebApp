import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';

const Cart = ({ isOpen, toggleCart, cartItems }) => {
  return (
    <div className={`cart-offcanvas ${isOpen ? 'open' : ''}`}>
      <OffcanvasHeader toggle={toggleCart}>Your Cart</OffcanvasHeader>
      <OffcanvasBody>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <h5>{item.name}</h5>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </OffcanvasBody>
    </div>
  );
};

export default Cart;
