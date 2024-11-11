import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
   const [cartItems, setCartItems] = useState([]);
   const [isCartOpen, setIsCartOpen] = useState(false);

   const toggleCart = () => {
     setIsCartOpen(!isCartOpen);
   };

   return (
     <CartContext.Provider value={{ cartItems, setCartItems, isCartOpen, toggleCart }}>
       {children}
     </CartContext.Provider>
   );
};
