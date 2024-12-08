import { useState, useEffect, useRef } from "react";
import api from "../../services/api"; 
import { SidebarManager } from "./components/SidebarManager";
import "../../styles/manager/main.css";
import StatusBadge from "./components/StatusBadge";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState(null); 
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const handleEmailReceipt = async () => {
    if (!selectedOrder || !recipientEmail) {
      toast.error("Please select an order and provide a valid email address.");
      return;
    }

    setEmailSending(true);
    try {
      const response = await api.post(`/manager/orders/${selectedOrder.order_id}/email`, { email: recipientEmail });
      if (response.status === 200) {
        toast.success("Receipt emailed successfully!");
        setRecipientEmail("");
      } 
      else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email.");
    } 
    finally {
      setEmailSending(false);
    }
  };

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
    setConfirmDeleteOrderId(null);
    setRecipientEmail("");
  };

  const areProductsEqual = (products1, products2) => {
    if (products1.length !== products2.length) return false;

    return products1.every((product, index) => {
      return (
        product.product_name === products2[index].product_name &&
        product.product_id === products2[index].product_id
      );
    });
  };

  const toggleStatus = async (order) => {
    if (!order) return;
  
    setUpdatingOrderId(order.order_id);
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
    } finally {
      setUpdatingOrderId(null); 
    }
  };

  const handleDeleteClick = async (orderId) => {
    if (confirmDeleteOrderId === orderId) {
      try {
        const response = await api.delete(`/manager/orders/${orderId}`);
        if (response.status === 200) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.order_id !== orderId)
          );
          await fetchOrders(currentPage, rowsPerPage); 
        }
      } 
      catch (error) {
        console.error("Error deleting order:", error);
      } 
      finally {
        closeModal();
        setConfirmDeleteOrderId(null);
      }
    } else {
      setConfirmDeleteOrderId(orderId);
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
                      <StatusBadge status={order.status} />
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
                status={selectedOrder.status}
                isLoading={updatingOrderId === selectedOrder.order_id}
                onClick={() => toggleStatus(selectedOrder)}
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
              <div style={{ textAlign: "center", marginTop: '15px' }}>
                <h4>Order #{selectedOrder.order_id} Receipt</h4>
                <p style={{marginBottom: "15px"}}>
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
                    {(() => {
                      const groupedItems = selectedOrder.items.reduce((acc, item) => {
                        const existingItem = acc.find(
                          (groupedItem) =>
                            groupedItem.item_name === item.item_name &&
                            areProductsEqual(groupedItem.products, item.products)
                        );
                        if (existingItem) {
                          existingItem.quantity += 1;
                          existingItem.subtotal_price += parseFloat(
                            item.subtotal_price.replace("$", "")
                          );
                        } else {
                          acc.push({
                            ...item,
                            quantity: 1,
                            subtotal_price: parseFloat(item.subtotal_price.replace("$", "")),
                          });
                        }
                        return acc;
                      }, []);

                      return groupedItems.map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: "5px", textAlign: "left" }}>
                            <strong style={{ fontSize: "0.95em" }}>{`${item.quantity} ${item.item_name}`}</strong>
                            <ul style={{ margin: "5px 0 0 15px", padding: "0" }}>
                              {item.products.map((product, idx) => (
                                <li key={idx} style={{ fontSize: "0.75em" }}>
                                  {product.product_name}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td style={{ textAlign: "right", padding: "5px" }}>
                            ${item.subtotal_price.toFixed(2)}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              <div style={{ borderBottom: "1px solid #ddd" }}></div>

              <div style={{ textAlign: "right", marginTop: "10px", fontSize: "1.1em" }}>
                {(() => {
                  const subtotalSum = selectedOrder.items.reduce(
                    (sum, item) => sum + parseFloat(item.subtotal_price.replace("$", "")),
                    0
                  );

                  const totalPrice = parseFloat(selectedOrder.total_price.replace("$", ""));
                  const taxRate = 0.0825;
                  const taxAmount = Math.round(subtotalSum * taxRate * 100) / 100;
                  const discountPercentage = Math.round(
                    ((1 - totalPrice / (subtotalSum + taxAmount)) * 100)
                  );
                  const discountAmount = Math.round(
                    (subtotalSum + taxAmount) * (discountPercentage / 100) * 100
                  ) / 100;

                  return (
                    <div style={{ display: "inline-block", textAlign: "right" }}>
                      <div style={{ marginBottom: "5px", fontSize: "0.9em" }}>
                        <span style={{ fontWeight: "bold" }}>Subtotal:</span>{" "}
                        ${subtotalSum.toFixed(2)}
                      </div>
                      <div style={{ marginBottom: "5px", fontSize: "0.9em" }}>
                        <span style={{ fontWeight: "bold" }}>Tax:</span> ${taxAmount.toFixed(2)}
                      </div>
                      {discountPercentage > 0 && (
                        <div style={{ marginBottom: "5px", color: "green", fontSize: "0.9em" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Discount ({discountPercentage}%):
                          </span>{" "}
                          -${discountAmount.toFixed(2)}
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: "10px",
                          fontWeight: "bold",
                          fontSize: "1.2em",
                          borderTop: "1px solid #ddd",
                          paddingTop: "5px",
                        }}
                      >
                        <span>Total:</span> ${totalPrice.toFixed(2)}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div style={{ flexGrow: 1 }}>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter email"
              style={{
                width: "100%",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <Button variant="primary" onClick={handleEmailReceipt} disabled={emailSending || !recipientEmail}>
            {emailSending ? "Sending..." : <i class="bi bi-envelope"></i>}
          </Button>
          <Button
            variant={
              selectedOrder && confirmDeleteOrderId === selectedOrder.order_id
                ? "danger"
                : "warning"
            }
            onClick={() => selectedOrder && handleDeleteClick(selectedOrder.order_id)}
          >
            {selectedOrder && confirmDeleteOrderId === selectedOrder.order_id
              ? "Confirm Delete"
              : "Delete Order"}
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ManagerMain;