// loader for cart and button
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import CheckoutButton from './components/CheckoutButton';
import Cart from './components/Cart';
import { CartContext } from './components/CartContext';

function KioskOrderLayout() {
  const { cartItems, isCartOpen, toggleCart } = useContext(CartContext);

  // handles total item quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="kiosk-order-layout">
      <CheckoutButton
        orderCount={totalQuantity}
        toggleCart={toggleCart}
        isCartOpen={isCartOpen}
      />
      <Cart isOpen={isCartOpen} toggleCart={toggleCart} cartItems={cartItems} />
      <Outlet />
    </div>
  );
}

export default KioskOrderLayout;
