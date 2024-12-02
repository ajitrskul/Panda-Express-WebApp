import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pos.css";
import MenuSection from "./components/MenuSection";
import OrderSection from "./components/OrderSection";
import Footer from "./components/Footer";

function PosMain() {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderNumber, setOrderNumber] = useState(124298); 
  const [total, setTotal] = useState(0); 
  const navigate = useNavigate();

  const handleAddToOrder = (item) => {
    setCurrentOrder((prevOrder) => [...prevOrder, item]);
    setTotal((prevTotal) => prevTotal + (item.price || 0)); 
  };

  const handleCheckout = () => {
    console.log("Finalized Order:", currentOrder);
    alert(`Order #${orderNumber} finalized!`);
    setCurrentOrder([]);
    setTotal(0); 
    setOrderNumber(orderNumber + 1); 
  };

  return (
    <div className="pos-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Menu Section */}
        <MenuSection
          apiEndpoint="/kiosk/menu"
          onAddToOrder={handleAddToOrder}
          navigate={navigate}
        />

        {/* Order Section */}
        <OrderSection
          orderNumber={orderNumber}
          currentOrder={currentOrder}
          total={total}
          onCheckout={handleCheckout}
          onCancel={() => {
            setCurrentOrder([]);
            setTotal(0);
          }}
        />
      </div>

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default PosMain;