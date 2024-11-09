// IS THE LOADER FOR CART AND CHECKOUT BUTTON
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import CheckoutButton from './components/CheckoutButton';
import Cart from './components/Cart';
import { CartContext } from './components/CartContext';

function KioskOrderLayout() {
  const { cartItems, isCartOpen, toggleCart } = useContext(CartContext);

  return (
    <div className="kiosk-order-layout">
      <CheckoutButton
        orderCount={cartItems.length}
        toggleCart={toggleCart}
        isCartOpen={isCartOpen}
      />
      <Cart isOpen={isCartOpen} toggleCart={toggleCart} cartItems={cartItems} />
      <Outlet />
    </div>
  );
}

export default KioskOrderLayout;
