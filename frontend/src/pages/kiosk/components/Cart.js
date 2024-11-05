import React from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import '../../../styles/kiosk.css';

const Cart = ({ isOpen, toggleCart, cartItems }) => {
  return (
    <Offcanvas isOpen={isOpen} direction="end" toggle={toggleCart} className="cart-offcanvas">
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
    </Offcanvas>
  );
};

export default Cart;
