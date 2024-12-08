import { useState, useEffect, useRef } from "react";
import api from "../../services/api"; 
import { SidebarManager } from "./components/SidebarManager";
import "../../styles/manager/main.css";
import StatusBadge from "./components/StatusBadge";
import { Modal, Button } from "react-bootstrap";

function ManagerMain() {
  const [orders, setOrders] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [isLoading, setIsLoading] = useState(true); 
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const tableContainerRef = useRef(null); 
  const [inputPage, setInputPage] = useState(1); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [showModal, setShowModal] = useState(false); 

  const fetchOrders = async (page = 1, limit = rowsPerPage) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/manager/orders`, {
        params: { page, limit }, 
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
      setInputPage(response.data.current_page); 
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/manager/orders/${orderId}/details`);
      setSelectedOrder(response.data); 
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };  

  const adjustRowsPerPage = () => {
    if (tableContainerRef.current) {
      const containerHeight = tableContainerRef.current.offsetHeight; 
      const rowHeight = 55; 
      const calculatedRows = Math.floor(containerHeight / rowHeight); 
      setRowsPerPage(calculatedRows); 
      setCurrentPage(1); 
    }
  };

  useEffect(() => {
    if (rowsPerPage > 0) { 
      fetchOrders(currentPage, rowsPerPage);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    adjustRowsPerPage(); 
    window.addEventListener("resize", adjustRowsPerPage); 
    return () => {
      window.removeEventListener("resize", adjustRowsPerPage); 
    };
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) { 
      setInputPage(value ? parseInt(value, 10) : ""); 
    }
  };

  const handleInputBlur = () => {
    if (inputPage > 0 && inputPage <= totalPages) {
      setCurrentPage(inputPage);
    } else {
      setInputPage(currentPage); 
    }
  };

  const handleRowClick = (order) => {
    fetchOrderDetails(order.order_id);
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false); 
    setSelectedOrder(null);
  };

  const toggleStatus = async (order) => {
    if (!order) return;
  
    try {
      const updatedStatus = !order.status; 
      const response = await api.put(`/manager/orders/${order.order_id}/status`, {
        status: updatedStatus,
      });
  
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.order_id === order.order_id ? { ...o, status: updatedStatus } : o
          )
        );
  
        fetchOrderDetails(order.order_id);
      } else {
        console.error("Failed to update order status:", response.data.error);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };  

  return (
    <div className="container-fluid" style={{ paddingRight: "0px" }}>
      <SidebarManager />
      <div
        className="page-background-container orders-section"
        style={{ height: "100vh", paddingRight: '60px'}}
        ref={tableContainerRef}
      >
        <h1>Past Orders</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : orders.length > 0 ? (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} onClick={() => handleRowClick(order)} style={{ cursor: "pointer" }}>
                    <td>{order.order_id}</td>
                    <td>{order.total_price}</td>
                    <td>
                      <StatusBadge status={order.status === false ? "In-Progress" : "Completed"} />
                    </td>
                    <td>{new Date(order.order_date_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page{" "}
                <input
                  type="number"
                  value={inputPage}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  min="1"
                  max={totalPages}
                  style={{
                    width: "60px",
                    textAlign: "center",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />{" "}
                of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>No orders found</div>
        )}
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {"Order Details "}
            {selectedOrder && (
              <StatusBadge
                status={selectedOrder.status === false ? "In-Progress" : "Completed"}
                onClick={() => toggleStatus(selectedOrder)}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            fontFamily: "monospace",
            backgroundColor: "#f9f9f9",
          }}
        >
          {selectedOrder ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h5>Order #{selectedOrder.order_id} Receipt</h5>
                <p>
                  {new Date(selectedOrder.order_date_time).toLocaleString()}
                </p>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th style={{ textAlign: "left", padding: "5px" }}>Item</th>
                      <th style={{ textAlign: "right", padding: "5px" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "5px", textAlign: "left" }}>
                          <strong>{item.item_name}</strong>
                          <ul style={{ margin: "5px 0 0 15px", padding: "0" }}>
                            {item.products.map((product, idx) => (
                              <li key={idx} style={{ fontSize: "0.9em" }}>
                                {product.product_name}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ textAlign: "right", padding: "5px" }}>
                          {item.subtotal_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                {(() => {
                  const subtotalSum = selectedOrder.items.reduce(
                    (sum, item) => sum + parseFloat(item.subtotal_price.replace("$", "")),
                    0
                  );
                  const totalPrice = parseFloat(selectedOrder.total_price.replace("$", ""));
                  const discount = (subtotalSum - totalPrice).toFixed(2);

                  if (discount > 0) {
                    return (
                      <>
                        <h6>
                          <strong>Discount:</strong> -${discount}
                        </h6>
                      </>
                    );
                  }
                })()}
                <h6>
                  <strong>Total:</strong> {selectedOrder.total_price}
                </h6>
              </div>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </Modal.Body>


        <Modal.Footer>
          <Button variant="danger" onClick={closeModal}>
            Delete
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManagerMain;