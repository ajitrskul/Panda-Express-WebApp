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
  const [menuEndpoint, setMenuEndpoint] = useState("/pos/menu");
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const navigate = useNavigate();

  const generateWorkflowSteps = (item) => {
    const steps = [];
    for (let i = 0; i < item.max_sides; i++) steps.push("/pos/sides");
    for (let i = 0; i < item.max_entrees; i++) steps.push("/pos/entrees");
    return steps;
  };

  const handleAddToOrder = (item) => {
    const itemName = item.item_name || ""; 

    if (itemName === "drinks") {
      setCurrentWorkflow({ name: itemName, steps: ["/pos/drinks"] });
      setWorkflowStep(0);
      setMenuEndpoint("/pos/drinks");
    } 
    else if (itemName === "appetizerSmall") {
      setCurrentWorkflow({ name: itemName, steps: ["/pos/apps-and-more"] });
      setWorkflowStep(0);
      setMenuEndpoint("/pos/apps-and-more");
    } 
    else if (itemName === "aLaCarteSideMedium") {
      setCurrentWorkflow({ name: itemName, steps: ["/pos/apps-and-more"] });
      setWorkflowStep(0);
      setMenuEndpoint("/pos/a-la-carte");
    } 
    else if (item.max_sides || item.max_entrees) {
      const workflowSteps = generateWorkflowSteps(item);
      setCurrentWorkflow({ name: itemName, steps: workflowSteps });
      setWorkflowStep(0);
      setMenuEndpoint(workflowSteps[0]);
    } 
    else if (currentWorkflow) {
      const currentSteps = currentWorkflow?.steps || [];
      if (workflowStep < currentSteps.length - 1) {
        setWorkflowStep(workflowStep + 1);
        setMenuEndpoint(currentSteps[workflowStep + 1]); 
      } 
      else {
        setCurrentWorkflow(null);
        setWorkflowStep(0);
        setMenuEndpoint("/pos/menu"); 
      }
    } 
    else {
      setCurrentOrder((prevOrder) => [...prevOrder, item]);
      setTotal((prevTotal) => prevTotal + (item.price || 0)); 
    }
  };

  const handleCheckout = () => {
    console.log("Finalized Order:", currentOrder);
    alert(`Order #${orderNumber} finalized!`);
    setCurrentOrder([]);
    setTotal(0);
    setOrderNumber(orderNumber + 1);
    setMenuEndpoint("/pos/menu");
    setCurrentWorkflow(null);
    setWorkflowStep(0);
  };

  return (
    <div className="pos-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Menu Section */}
        <MenuSection
          apiEndpoint={menuEndpoint}
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
            setMenuEndpoint("/pos/menu");
            setCurrentWorkflow(null);
            setWorkflowStep(0);
          }}
        />
      </div>

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default PosMain;