import React from "react";

function OrderSection({ orderNumber, currentOrder, total, onCheckout, onCancel, formatItemName }) {
  return (
    <div className="order-section">
      <h2 style={{marginBottom: '0px', textAlign: 'center'}}>Order #{orderNumber}</h2>
      <hr></hr>
      <div className="order-items">
        {currentOrder.length > 0 ? (
          currentOrder.map((item, index) => (
            <div key={index} className="order-item">
              <p>
                <strong>{item.name.toUpperCase()}</strong>{" "}
                <span>${item.price.toFixed(2)}</span>
              </p>
              {item.subitems && (
                <ul>
                  {item.subitems.map((subitem, subIndex) => (
                    <li key={subIndex} className="order-subitem">
                      {formatItemName(subitem)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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