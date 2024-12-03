import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/pos.css";
import MenuSection from "./components/MenuSection";
import OrderSection from "./components/OrderSection";
import Footer from "./components/Footer";
import SizeSelection from "./components/SizeSelection";

function PosMain() {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderNumber, setOrderNumber] = useState(124298);
  const [total, setTotal] = useState(0);
  const [menuEndpoint, setMenuEndpoint] = useState("/pos/menu");
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [currentSubitemType, setCurrentSubitemType] = useState(null);
  const navigate = useNavigate();

  const resetCurrentWorkflow = () => {
    setCurrentWorkflow(null);
    setWorkflowStep(0);
    setMenuEndpoint("/pos/menu");
    setCurrentSubitemType(null);
  };

  const formatNames = (item) => {
    let formattedName = item.replace(/Small|Medium|Side|Entree/g, "");
    formattedName = formattedName.replace(/([A-Z])/g, " $1").trim(); 
    return formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join("")
      .toLowerCase();
  };

  const generateWorkflowSteps = (item) => {
    const steps = [];
    for (let i = 0; i < item.max_sides; i++) steps.push("sides");
    for (let i = 0; i < item.max_entrees; i++) steps.push("entrees");
    return steps;
  };

  const handleAddToOrder = (item) => {
    const itemType = formatNames(item.item_name);
    let steps;
    
    if (["drink", "appetizer", "alacarte"].includes(itemType)) {
      steps = [`${itemType}`];
    } else {
      steps = generateWorkflowSteps(item);
    }
  
    setCurrentWorkflow({
      quantity: 1,
      name: item.item_name,
      price: parseFloat(item.menu_item_base_price) || 0,
      multiplier: parseFloat(item.premium_multiplier),
      steps: steps,
      subitems: [],
    });
  
    setWorkflowStep(0);
    setMenuEndpoint(`/pos/${steps[0]}`);
  };

  const handleSubitemSelect = (subitem) => {
    console.log("here", currentWorkflow);
    const subitems = [...currentWorkflow.subitems, subitem];

    if (
      ["fountaindrink", "dessert", "appetizer"].includes(formatNames(subitem.type)) ||
      (currentWorkflow.name === "aLaCarteSideMedium" && ["entree", "side"].includes(subitem.type))
    ) {
      setCurrentWorkflow({ ...currentWorkflow, subitems });
      currentWorkflow.steps.push("size-selection");
      setWorkflowStep(1);
      setCurrentSubitemType(subitem.type);
      setMenuEndpoint("/pos/size-selection");
    } 
    else {
      const currentSteps = currentWorkflow.steps || [];
  
      if (workflowStep < currentSteps.length - 1) {
        setCurrentWorkflow({ ...currentWorkflow, subitems });
        setWorkflowStep(workflowStep + 1);
        setMenuEndpoint(`/pos/${currentSteps[workflowStep + 1]}`);
      } 
      else {
        const finalizedItem = {
          quantity: 1,
          name: currentWorkflow.name,
          subitems,
          price:
            parseFloat(currentWorkflow.price) +
            subitems.reduce((sum, si) => sum + (parseFloat(si.premium_addition) || 0), 0),
        };
  
        setCurrentOrder((prevOrder) => [...prevOrder, finalizedItem]);
        setTotal((prevTotal) => prevTotal + finalizedItem.price);
        resetCurrentWorkflow();
      }
    }
  };

  const handleSizeSelect = async (size) => {
    try {
      console.log(currentWorkflow.name);
      let endpointBase = currentWorkflow.name.replace(/Small|Medium|Side/g, "");
      if (endpointBase === "aLaCarte") {
        endpointBase += size.type.charAt(0).toUpperCase() + size.type.slice(1);
      }
      else if (size.type === "dessert") endpointBase = size.type;
      const response = await api.get(`/pos/size/${endpointBase}/${size.name}`);

      setCurrentWorkflow({
        ...currentWorkflow,
        name: response.data.name,
        price: response.data.price,
        multiplier: response.data.multiplier,
      });

      const finalizedItem = {
        name: response.data.name,
        multiplier: response.data.multiplier,
        price: response.data.price + (parseFloat(currentWorkflow.subitems[0].premium_addition) * parseFloat(response.data.multiplier)),
        subitems: currentWorkflow.subitems,
      };

      setCurrentOrder((prevOrder) => [...prevOrder, finalizedItem]);
      setTotal((prevTotal) => prevTotal + finalizedItem.price);
      resetCurrentWorkflow();
    } 
    catch (error) {
      console.error(`Failed to fetch size pricing:`, error);
      alert(`Error fetching size pricing. Please try again.`);
    }
  };

  const handleCheckout = () => {
    console.log("Finalized Order:", currentOrder);
    alert(`Order #${orderNumber} finalized!`);
    setCurrentOrder([]);
    setTotal(0);
    setOrderNumber(orderNumber + 1);
    resetCurrentWorkflow();
  };

  return (
    <div className="pos-container p-2 bg-black">
      <div className="main-content">
        {menuEndpoint === "/pos/size-selection" ? (
          <SizeSelection 
          onSizeSelect={handleSizeSelect}
          itemType={currentSubitemType}
          />
        ) : (
          <MenuSection
            apiEndpoint={menuEndpoint}
            onAddToOrder={handleAddToOrder}
            onSubitemSelect={handleSubitemSelect}
            navigate={navigate}
          />
        )}
        <OrderSection
          orderNumber={orderNumber}
          currentOrder={currentOrder}
          total={total}
          onCheckout={handleCheckout}
          onCancel={() => {
            setCurrentOrder([]);
            setTotal(0);
            setCurrentWorkflow(null);
            setWorkflowStep(0);
            setMenuEndpoint("/pos/menu");
            setCurrentSubitemType(null);
          }}
        />
      </div>
      <Footer 
        navigate={navigate} 
        menuEndpoint={menuEndpoint}
        onBack={() => {
          console.log(workflowStep)
          if (workflowStep > 0) {
            const updatedSubitems = [...currentWorkflow.subitems];
            const updatedSteps = [...currentWorkflow.steps];
            updatedSubitems.pop();
            setCurrentWorkflow({
              ...currentWorkflow,
              subitems: updatedSubitems,
              steps: updatedSteps
            });
            setWorkflowStep(workflowStep - 1);
            setMenuEndpoint(`/pos/${currentWorkflow.steps[workflowStep - 1]}`);
          } 
          else {
            setCurrentWorkflow(null);
            setMenuEndpoint("/pos/menu");
          }
        }} 
      />
    </div>
  );
}

export default PosMain;