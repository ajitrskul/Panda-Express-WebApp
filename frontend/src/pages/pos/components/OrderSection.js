import React from "react";

function OrderSection({ 
  orderNumber, 
  currentOrder, 
  total, 
  onCheckout, 
  onCancel, 
  onIncreaseQuantity, 
  onDecreaseQuantity, 
  onChangeQuantity,
  disableActions 
}) {
  const taxAmount = parseFloat(total) * 0.0625;
  const totalWithTax = parseFloat(total) + taxAmount;

  const formatOrderNames = (item) => {
    const name = item.item_name || item.product_name || item.name || "Unknown Item";
    let formattedName = name.replace(/Side|Entree/g, "");
    formattedName = formattedName.replace(/([A-Z])/g, " $1").trim();
    formattedName = formattedName.replace(/\b(Small|Medium|Large)\b/gi, "($1)");
    return formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="order-section">
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
                marginBottom: "10px",
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
                  color: "#f9f9f9",
                }}
              >
                {formatOrderNames(item)}
                <span style={{ float: "right", color: "white" }}>
                  ${parseFloat(item.price * item.quantity).toFixed(2)}
                </span>
              </p>
              {item.subitems && (
                <ul
                  style={{
                    paddingLeft: "15px",
                    marginTop: "5px",
                    color: "#bbb",
                    fontSize: "0.8rem",
                  }}
                >
                  {item.subitems.map((subitem, subIndex) => (
                    <li key={subIndex}>
                      {formatOrderNames(subitem)} 
                      {subitem.quantity === 0.5 && " (1/2)"}
                      {subitem.is_premium && " *"}
                    </li>
                  ))}
                </ul>
              )}
              <div
                className="quantity-controls"
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  className="quantity-btn"
                  onClick={() => onDecreaseQuantity(index)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => onChangeQuantity(index, parseInt(e.target.value))}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => onIncreaseQuantity(index)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}>
            No items added yet.
          </p>
        )}
      </div>
      <hr style={{ margin: "10px 0", borderColor: "#555" }} />
      <div
        style={{
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
      <hr style={{ margin: "10px 0", borderColor: "#555" }} />
      <div className="order-buttons">
      <button
          className="checkout-btn"
          style={{
            backgroundColor: disableActions ? "#6c757d" : "#28a745",
            cursor: disableActions ? "not-allowed" : "pointer",
            opacity: disableActions ? 0.6 : 1,
          }}
          onClick={onCheckout}
          disabled={disableActions}
        >
          Checkout
        </button>
        <button
          className="cancel-btn"
          style={{
            backgroundColor: currentOrder.length === 0 ? "#6c757d" : "#dc3545",
            cursor: currentOrder.length === 0 ? "not-allowed" : "pointer",
            opacity: currentOrder.length === 0 ? 0.6 : 1,
          }}
          onClick={onCancel}
          disabled={currentOrder.length === 0}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderSection;