import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import '../../../styles/kiosk/cart.css';
import ConfirmDialog from './ConfirmDialog'; 
import { CartContext } from './CartContext';

function Cart({ isOpen, toggleCart, cartItems }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayClass, setOverlayClass] = useState(''); // FADE CLASS THINGY

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const { setCartItems } = useContext(CartContext);


  useEffect(() => {
    if (isOpen) {
      setShowOverlay(true);
      setOverlayClass('fade-in');
    } else {
      setOverlayClass('fade-out')
      setTimeout(() => {
        setShowOverlay(false);
      }, 300);
    }
  }, [isOpen]);
  
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('cart-overlay')) {
      toggleCart();
    }
  };

  const handleIncrement = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity += 1;
    setCartItems(updatedCartItems);
  };

  const handleDecrement = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity -= 1;
      setCartItems(updatedCartItems);
    } else {
      // If quantity is 1, prompt for removal confirmation
      setItemToRemove({ index, item: updatedCartItems[index] });
      setShowConfirmDialog(true);
    }
  };

  const handleRemove = (index) => {
    // Prompt for removal confirmation
    setItemToRemove({ index, item: cartItems[index] });
    setShowConfirmDialog(true);
  };

  const confirmRemoveItem = () => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(itemToRemove.index, 1);
    setCartItems(updatedCartItems);
    setShowConfirmDialog(false);
    setItemToRemove(null);
  };

  const cancelRemoveItem = () => {
    setShowConfirmDialog(false);
    setItemToRemove(null);
  };

  return (
    <>
      {showOverlay && (
        <div
          className={`cart-overlay ${overlayClass}`}
          onClick={handleOverlayClick}
        ></div>
      )}
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
                <button className="remove-item-button" onClick={() => handleRemove(index)}>
                  <FaTimes />
                </button>
                <img
                  src={
                    getItemImage(item) ||
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
                  <div className="cart-item-quantity-controls">
                    <button className="quantity-button" onClick={() => handleDecrement(index)}>
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button className="quantity-button" onClick={() => handleIncrement(index)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <p className="cart-item-price">
                  ${(getItemPrice(item) * item.quantity).toFixed(2)}
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

        {showConfirmDialog && (
          <ConfirmDialog
            message={`Are you sure you want to remove "${
              itemToRemove.item.product_name || itemToRemove.item.name
            }" from your cart?`}
            onConfirm={confirmRemoveItem}
            onCancel={cancelRemoveItem}
          />
        )}
      </div>
    </>
  );
}

function getItemImage(item) {
  // Return the main item's image if available
  if (item.image) {
    return item.image;
  // } else if (item.name) {
  //   // Fallback to a default image based on item name
  //   return getDefaultImageForItem(item.name);
  } else {
    // Fallback to a placeholder image
    return '/path/to/placeholder-image.png';
  }
}

// function getDefaultImageForItem(itemName) {
//   // Map item names to their corresponding images
//   const imageMap = {
//     Bowl: require('../../../assets/bowl.png'),
//     Plate: require('../../../assets/plate.png'),
//     'Bigger Plate': require('../../../assets/bigger-plate.png'),
//     // Add mappings for other items as needed
//   };

//   return imageMap[itemName] || require('../../../assets/placeholder-image.png');
// }

function getItemPrice(item) {
  if (item.basePrice !== undefined && item.premiumMultiplier !== undefined && item.components) {
    // Complex item (e.g., Bowl, Plate)
    const { basePrice, premiumMultiplier, components } = item;

    // Sum up premium additions for premium subitems
    let totalPremiumAddition = 0;

    // Sum premium additions for sides
    if (components.sides && components.sides.length > 0) {
      components.sides.forEach(side => {
        if (side.is_premium) {
          totalPremiumAddition += side.premium_addition || 0;
        }
      });
    }

    // Sum premium additions for entrees
    if (components.entrees && components.entrees.length > 0) {
      components.entrees.forEach(entree => {
        if (entree.is_premium) {
          totalPremiumAddition += entree.premium_addition || 0;
        }
      });
    }

    const totalPrice = basePrice + premiumMultiplier * totalPremiumAddition;
    return totalPrice;
  } else if (item.price !== undefined) {
    // Simple item with a direct price
      return item.price;
  } else if (item.premium_addition !== undefined) {
    // For individual products like drinks or appetizers
      return item.premium_addition || 0;
  } else {
      return 0;
  }
}

function calculateSubtotal(cartItems) {
  return cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * item.quantity,
    0
  );
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
