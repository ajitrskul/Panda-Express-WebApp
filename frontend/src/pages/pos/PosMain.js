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

  const formatNames = (item) => {
    const name = item.item_name || item.product_name || item.name || "Unknown Item";

    let formattedName = name.replace(/Small|Medium|Side|Entree/g, "");
    if (formattedName.toLowerCase() === "appetizer") return "Apps & More";

    formattedName = formattedName.replace(/([A-Z])/g, " $1").trim(); 
    return formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");
  };

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

  const generateWorkflowSteps = (item) => {
    const steps = [];
    for (let i = 0; i < item.max_sides; i++) steps.push("sides");
    for (let i = 0; i < item.max_entrees; i++) steps.push("entrees");
    return steps;
  };

  const handleAddToOrder = (item) => {
    if (item.item_name === "drink") {
      setCurrentWorkflow({
        quantity: 1,
        name: item.item_name,
        price: parseFloat(item.menu_item_base_price) || 0,
        multiplier: parseFloat(item.premium_multiplier),
        steps: ["/pos/drinks"],
        subitems: [],
      });
      setMenuEndpoint("/pos/drinks");
    } else if (item.item_name === "appetizerSmall") {
      setCurrentWorkflow({
        quantity: 1,
        name: item.item_name,
        price: parseFloat(item.menu_item_base_price) || 0,
        multiplier: parseFloat(item.premium_multiplier),
        steps: ["/pos/apps-and-more"],
        subitems: [],
      });
      setMenuEndpoint("/pos/apps-and-more");
    } else if (item.item_name === "aLaCarteSideMedium") {
      setCurrentWorkflow({
        quantity: 1,
        name: item.item_name,
        price: parseFloat(item.menu_item_base_price) || 0,
        multiplier: parseFloat(item.premium_multiplier),
        steps: ["/pos/a-la-carte"],
        subitems: [],
      });
      setMenuEndpoint("/pos/a-la-carte");
    } 
    else {
      const workflowSteps = generateWorkflowSteps(item);
      setCurrentWorkflow({
        quantity: 1,
        name: item.item_name,
        price: parseFloat(item.menu_item_base_price) || 0,
        multiplier: parseFloat(item.premium_multiplier),
        steps: workflowSteps,
        subitems: [],
      });
      setWorkflowStep(0);
      setMenuEndpoint(`/pos/${workflowSteps[0]}`);
    } 
  };

  const handleSubitemSelect = (subitem) => {
    const subitems = [...currentWorkflow.subitems, subitem];

    if (["fountainDrink", "dessert", "appetizer"].includes(subitem.type.replace(/Small|Medium|Side/g, ""))) {
      setCurrentWorkflow({ ...currentWorkflow, subitems });
      setCurrentSubitemType(subitem.type);
      setMenuEndpoint("/pos/size-selection");
    } 
    else if (currentWorkflow.name === "aLaCarteSideMedium" && ["entree", "side"].includes(subitem.type)) {
      setCurrentWorkflow({ ...currentWorkflow, subitems });
      setCurrentSubitemType(subitem.type);
      setMenuEndpoint("/pos/size-selection");
    } 
    else if (currentWorkflow) {
      const currentSteps = currentWorkflow.steps || [];
  
      if (workflowStep < currentSteps.length - 1) {
        setCurrentWorkflow({ ...currentWorkflow, subitems });
        setWorkflowStep(workflowStep + 1);
        setMenuEndpoint(`/pos/${currentSteps[workflowStep + 1]}`);
      } else {
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
        setCurrentWorkflow(null);
        setWorkflowStep(0);
        setMenuEndpoint("/pos/menu");
      }
    }
    else {
      const finalizedItem = {
        name: currentWorkflow.name,
        subitems,
        price:
          parseFloat(currentWorkflow.price) +
          subitems.reduce((sum, si) => sum + (parseFloat(si.price) || 0), 0),
      };

      setCurrentOrder((prevOrder) => [...prevOrder, finalizedItem]);
      setTotal((prevTotal) => prevTotal + finalizedItem.price);
      setCurrentWorkflow(null);
      setWorkflowStep(0);
      setMenuEndpoint("/pos/menu");
    }
  };

  const handleSizeSelect = async (size) => {
    try {
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
      setCurrentWorkflow(null);
      setMenuEndpoint("/pos/menu");
    } catch (error) {
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
    setMenuEndpoint("/pos/menu");
    setCurrentWorkflow(null);
    setWorkflowStep(0);
    setCurrentSubitemType(null);
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
            formatNames={formatNames}
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
          formatNames={formatOrderNames}
        />
      </div>
      <Footer 
        navigate={navigate} 
        onBack={() => {
          if (workflowStep > 0) {
            const previousStep = workflowStep - 1;
            setWorkflowStep(previousStep);
            setMenuEndpoint(`/pos/${currentWorkflow.steps[previousStep]}`);
          } else {
            setCurrentWorkflow(null);
            setMenuEndpoint("/pos/menu");
          }
        }} 
      />
    </div>
  );
}

export default PosMain;