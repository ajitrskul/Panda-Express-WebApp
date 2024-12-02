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

  const formatItemName = (item) => {
    if (!item) return "Unknown Item"; // Handle undefined or null items

    const name = item.item_name || item.product_name || item.name || "Unknown Item";
    let formattedName = name.replace(/Small|Medium|Side/g, ""); 
    if (formattedName.toLowerCase() === "appetizer") {
      return "Appetizers & More";
    }
    formattedName = formattedName.replace(/([A-Z])/g, " $1").trim(); 
    return formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  };

  const generateWorkflowSteps = (item) => {
    const steps = [];
    for (let i = 0; i < item.max_sides; i++) steps.push("sides");
    for (let i = 0; i < item.max_entrees; i++) steps.push("entrees");
    return steps;
  };

  const handleAddToOrder = (item) => {
    if (item.item_name === "drinks") {
      setCurrentWorkflow({ name: item.item_name, steps: ["/pos/drinks"], subitems: [] });
      setMenuEndpoint("/pos/drinks");
    } 
    else if (item.item_name === "appetizerSmall") {
      setCurrentWorkflow({ name: item.item_name, steps: ["/pos/apps-and-more"], subitems: [] });
      setMenuEndpoint("/pos/apps-and-more");
    } 
    else if (item.max_sides || item.max_entrees) {
      const workflowSteps = generateWorkflowSteps(item);
      setCurrentWorkflow({ name: item.item_name, steps: workflowSteps, subitems: [] });
      setWorkflowStep(0);
      setMenuEndpoint(`/pos/${workflowSteps[0]}`); 
    } 
    else if (currentWorkflow) {
      const currentSteps = currentWorkflow.steps || [];
      const subitems = [...currentWorkflow.subitems];

      if (item.product_id) {
        subitems.push({
          name: item.product_name || `Product ${item.product_id}`,
          price: item.price || 0,
        });
      } else if (item.item_name) {
        subitems.push({
          name: item.item_name,
          price: item.price || 0,
        });
      }

      if (workflowStep < currentSteps.length - 1) {
        setCurrentWorkflow({ ...currentWorkflow, subitems });
        setWorkflowStep(workflowStep + 1);
        setMenuEndpoint(`/pos/${currentSteps[workflowStep + 1]}`);
      } 
      else {
        const finalizedItem = {
          name: currentWorkflow.name,
          subitems,
          price: subitems.reduce((sum, subitem) => sum + subitem.price, 0),
        };
        setCurrentOrder((prevOrder) => [...prevOrder, finalizedItem]);
        setTotal((prevTotal) => prevTotal + finalizedItem.price);
        setCurrentWorkflow(null);
        setWorkflowStep(0);
        setMenuEndpoint("/pos/menu");
      }
    } 
    else {
      setCurrentOrder((prevOrder) => [
        ...prevOrder,
        {
          name: item.item_name || `Product ${item.product_id}`,
          price: item.price || 0,
          subitems: [],
        },
      ]);
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
      <div className="main-content">
        <MenuSection
          apiEndpoint={menuEndpoint}
          onAddToOrder={handleAddToOrder}
          navigate={navigate}
          formatItemName={formatItemName}
        />
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
          formatItemName={formatItemName}
        />
      </div>
      <Footer navigate={navigate} />
    </div>
  );
}

export default PosMain;