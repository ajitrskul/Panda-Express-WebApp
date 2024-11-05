// App.js (or MainPageComponent.js)
import React, { useState } from 'react';
import CartButton from './components/CartButton';
import Cart from './components/Cart';

const Test = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); 

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <div>
      <CartButton toggleCart={toggleCart} />
      <Cart isOpen={isCartOpen} toggleCart={toggleCart} cartItems={cartItems} />
    </div>
  );
};

export default Test;
