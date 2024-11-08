import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function KitchenMain() {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from /api/kitchen/orders
  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/kitchen/orders");
      setOrders(response.data); // Assuming response.data is an array of orders
    } catch (error) {
      setError("Error fetching kitchen orders.");
      console.error("Error fetching kitchen orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component load
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container-fluid">
      <h1>Kitchen Display System</h1>
      {loading ? (
        <p>Loading...</p> // Show loading text while data is being fetched
      ) : error ? (
        <p>{error}</p> // Display error if any
      ) : (
        <div className="orders-container">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="order-card">
                <h3>Order #{order.id}</h3>
                <p><strong>Customer:</strong> {order.customerName || 'N/A'}</p>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} - {item.quantity} {item.specialInstructions ? `(Notes: ${item.specialInstructions})` : ''}
                    </li>
                  ))}
                </ul>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            ))
          ) : (
            <p>No orders to display.</p> // Message if no orders available
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenMain;
