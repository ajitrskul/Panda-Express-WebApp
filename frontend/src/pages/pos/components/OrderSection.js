import React from "react";

function OrderSection({ orderNumber, currentOrder, total, onCheckout, onCancel }) {
  return (
    <div className="order-section">
      <h2>Order #{orderNumber}</h2>
      <div className="order-items">
        {currentOrder.length > 0 ? (
          currentOrder.map((item, index) => (
            <p key={index}>{item.item_name}</p>
          ))
        ) : (
          <p>No items added yet.</p>
        )}
      </div>
      <h3>Total: ${total.toFixed(2)}</h3>
      <div className="order-buttons">
        <button className="checkout-btn" onClick={onCheckout}>
          Checkout
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderSection;