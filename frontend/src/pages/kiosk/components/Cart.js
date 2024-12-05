// Cart.js
import React, { useState, useContext, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import '../../../styles/kiosk/cart.css';
import ConfirmDialog from './ConfirmDialog';
import { CartContext } from './CartContext';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

import { AccountContext } from '../../auth/components/AccountContext';

function Cart({ isOpen, toggleCart, cartItems }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayClass, setOverlayClass] = useState('');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { setCartItems } = useContext(CartContext);

  const { customer, setCustomer } = useContext(AccountContext);
  
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const orderData = {
        total_price: calculateTotal(cartItems).toFixed(2),
        cart_items: cartItems,
      };
  
      // Include customer_id if the customer is signed in
      if (customer && customer.isSignedIn) {
        orderData.customer_id = customer.customer_id;
      }
  
      // Send the order data to the backend
      const response = await api.post('/kiosk/orders', orderData);
  
      if (response.status === 201) {
        // Order created successfully
        console.log('Order created:', response.data);
  
        // Clear the cart
        setCartItems([]);
        toggleCart();
  
        // Fetch updated customer data if logged in
        if (customer && customer.isSignedIn) {
          try {
            // Fetch the updated customer data
            const customerResponse = await api.get(`/auth/login/customer/info/${customer.customer_id}`);
            if (customerResponse.status === 200 && customerResponse.data.success) {
              // Update the customer context with new beast_points
              setCustomer(prevCustomer => ({
                ...prevCustomer,
                beast_points: customerResponse.data.data.beast_points,
              }));
            }
          } catch (err) {
            console.error('Error fetching updated customer data:', err);
          }
        }
  
        // Show order confirmation
        setShowOrderConfirmation(true);
  
        // Navigate to the kiosk option after a short delay
        setTimeout(() => {
          navigate('/kiosk');
        }, 2000);
      } else {
        // Handle unexpected responses
        console.error('Unexpected response:', response);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle error, show a message to the user
      setErrorMessage('Unable to process your order. Please try again.');
    }
  };
  

  useEffect(() => {
    if (isOpen) {
      setShowOverlay(true);
      setTimeout(() => {
        setOverlayClass('fade-in');
      }, 10);
    } else {
      setOverlayClass('fade-out');
      setTimeout(() => {
        setShowOverlay(false);
        setOverlayClass('');
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

  const closeOrderConfirmation = () => {
    setShowOrderConfirmation(false);
  };

  const closeErrorMessage = () => {
    setErrorMessage('');
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
                  <p className="cart-item-name">
                    {formatProductName(item.product_name || item.name)}
                    {item.size && ` (${item.size.display_name})`}
                  </p>
                  {item.components && (
                    <div className="cart-item-components">
                      {item.components.sides.length > 0 && (
                        <div>
                          <strong>Sides:</strong>
                          <ul>
                            {item.components.sides.map((side, idx) => (
                              <li key={`side-${idx}`}>{formatProductName(side.product_name || side.name)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.components.entrees.length > 0 && (
                        <div>
                          <strong>Entrees:</strong>
                          <ul>
                            {item.components.entrees.map((entree, idx) => (
                              <li key={`entree-${idx}`}>{formatProductName(entree.product_name || entree.name)}</li>
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
          <button className="checkout-footer-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>

        {/* Confirmation Dialog for Removing Items */}
        {showConfirmDialog && (
          <ConfirmDialog
            message={`Are you sure you want to remove "${
              formatProductName(itemToRemove.item.product_name || itemToRemove.item.name)
            }${itemToRemove.item.size ? ` (${itemToRemove.item.size.display_name})` : ''}" from your cart?`}
            onConfirm={confirmRemoveItem}
            onCancel={cancelRemoveItem}
          />
        )}
      </div>

      {/* Order Confirmation Dialog */}
      {showOrderConfirmation && (
        <div className="order-confirmation-overlay">
          <div className="order-confirmation-dialog">
            <p>Your order has been placed successfully!</p>
            <button className="close-confirmation-button" onClick={closeOrderConfirmation}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Message Dialog */}
      {errorMessage && (
        <div className="order-error-overlay">
          <div className="order-error-dialog">
            <p>{errorMessage}</p>
            <button className="close-error-button" onClick={closeErrorMessage}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function getItemImage(item) {
  // Return the main item's image if available
  if (item.image) {
    return item.image;
  } else {
    // Fallback to a placeholder image
    return '/path/to/placeholder-image.png';
  }
}

function formatProductName(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
}

function getItemPrice(item) {
  if (item.basePrice !== undefined && item.premiumMultiplier !== undefined) {
    // Complex item (e.g., Bowl, Plate, Drink)
    const basePrice = parseFloat(item.basePrice) || 0;
    const premiumMultiplier = parseFloat(item.premiumMultiplier) || 1;
    let totalPremiumAddition = 0;

    // For drinks and fountain drinks
    if (item.is_premium) {
      const premiumAddition = parseFloat(item.premium_addition) || 0;
      totalPremiumAddition += premiumAddition;
    }

    // Process components if they exist
    if (item.components) {
      // Sum premium additions for sides
      if (item.components.sides && item.components.sides.length > 0) {
        item.components.sides.forEach(side => {
          let isPremium = side.is_premium;
          if (typeof isPremium === 'string') {
            isPremium = isPremium.toLowerCase() === 'true';
          }
          if (isPremium) {
            const premiumAddition = parseFloat(side.premium_addition) || 0;
            totalPremiumAddition += premiumAddition;
          }
        });
      }

      // Sum premium additions for entrees
      if (item.components.entrees && item.components.entrees.length > 0) {
        item.components.entrees.forEach(entree => {
          let isPremium = entree.is_premium;
          if (typeof isPremium === 'string') {
            isPremium = isPremium.toLowerCase() === 'true';
          }
          if (isPremium) {
            const premiumAddition = parseFloat(entree.premium_addition) || 0;
            totalPremiumAddition += premiumAddition;
          }
        });
      }
    }

    const totalPrice = basePrice + premiumMultiplier * totalPremiumAddition;
    return totalPrice;
  } else if (item.price !== undefined) {
    // Simple item with a direct price
    return parseFloat(item.price) || 0;
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
