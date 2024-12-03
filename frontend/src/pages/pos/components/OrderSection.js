import React from "react";

function OrderSection({ orderNumber, currentOrder, total, onCheckout, onCancel, formatNames }) {
  const taxAmount = parseFloat(total) * 0.0625;
  const totalWithTax = parseFloat(total) + taxAmount; 

  return (
    <div
      className="order-section"
      style={{
        padding: "20px",
        backgroundColor: "#2b2b2b",
        color: "#fff",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
          textAlign: "center",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Order #{orderNumber}
      </h2>
      <hr style={{ margin: "10px 0", borderColor: "#555" }} />
      <div className="order-items">
        {currentOrder.length > 0 ? (
          currentOrder.map((item, index) => (
            <div
              key={index}
              className="order-item"
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #444",
                borderRadius: "5px",
                backgroundColor: "#333",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  margin: "5px 0",
                  color: "#f9f9f9",
                }}
              >
                {formatNames(item)}
                <span style={{ float: "right", color: "#aaa" }}>
                  ${parseFloat(item.price).toFixed(2)}
                </span>
              </p>
              {item.subitems && (
                <ul
                  style={{
                    paddingLeft: "15px",
                    marginTop: "5px",
                    color: "#bbb",
                    fontSize: "0.9rem",
                  }}
                >
                  {item.subitems.map((subitem, subIndex) => (
                    <li key={subIndex}>{formatNames(subitem)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}>
            No items added yet.
          </p>
        )}
      </div>
      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        <div style={{ marginBottom: "5px", color: "#ccc" }}>
          Subtotal: <span style={{ fontWeight: "bold" }}>${parseFloat(total).toFixed(2)}</span>
        </div>
        <div style={{ marginBottom: "10px", color: "#aaa" }}>
          Tax: <span style={{ fontWeight: "bold" }}>${taxAmount.toFixed(2)}</span>
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ff4c4c" }}>
          Total: <span>${totalWithTax.toFixed(2)}</span>
        </div>
      </div>
      <div
        className="order-buttons"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          className="checkout-btn"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            width: "120px",
          }}
          onClick={onCheckout}
        >
          Checkout
        </button>
        <button
          className="cancel-btn"
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            width: "120px",
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderSection;
