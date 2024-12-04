import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/pos.css";
import MenuSection from "./components/MenuSection";
import OrderSection from "./components/OrderSection";
import Footer from "./components/Footer";
import SizeSelection from "./components/SizeSelection";
import { Modal, Button } from "react-bootstrap";

function PosMain() {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [total, setTotal] = useState(0);
  const [menuEndpoint, setMenuEndpoint] = useState("/pos/menu");
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [currentSubitemType, setCurrentSubitemType] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
  const [halfSideActivated, setHalfSideActivated] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const disableActions = currentWorkflow !== null || currentOrder.length === 0;

  useEffect(() => {
    const fetchNextOrderNumber = async () => {
      try {
        const response = await api.get("/pos/next-order-id");
        if (response.status === 200) {
          setOrderNumber(response.data.next_order_id);
        }
      } catch (error) {
        console.error("Failed to fetch the next order number:", error);
      }
    };

    fetchNextOrderNumber();
  }, []);

  const resetCurrentWorkflow = () => {
    setCurrentWorkflow(null);
    setWorkflowStep(0);
    setMenuEndpoint("/pos/menu");
    setCurrentSubitemType(null);
    setIsHalfAndHalf(false);
    setHalfSideActivated(false);
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
    if (isHalfAndHalf && subitem.type === "side") {
      const subitems = [...currentWorkflow.subitems, { ...subitem, quantity: 0.5 }];
      setCurrentWorkflow({ ...currentWorkflow, subitems });

      if (workflowStep > 0 && currentWorkflow.steps[workflowStep] === "sides") {
        setIsHalfAndHalf(false); 
        if (workflowStep < currentWorkflow.steps.length - 1) {
          setWorkflowStep(workflowStep + 1);
          setMenuEndpoint(`/pos/${currentWorkflow.steps[workflowStep + 1]}`);
        } 
        else {
          finalizeItem(subitems);
          setHalfSideActivated(false);
        }
      } 
      else {
        setWorkflowStep(workflowStep + 1);
        setMenuEndpoint(`/pos/${currentWorkflow.steps[workflowStep + 1]}`);
      }
    } 
    else {
      const subitems = [...currentWorkflow.subitems, { ...subitem, quantity: 1 }];

      if (
        ["fountaindrink", "dessert", "appetizer"].includes(formatNames(subitem.type)) ||
        (currentWorkflow.name === "aLaCarteSideMedium" && ["entree", "side"].includes(subitem.type))
      ) {
        setCurrentWorkflow({ ...currentWorkflow, subitems });
        currentWorkflow.steps.push("size-selection");
        setWorkflowStep(1);
        setCurrentSubitemType(subitem.type);
        setMenuEndpoint("/pos/size-selection");
      } else {
        const currentSteps = currentWorkflow.steps || [];

        if (workflowStep < currentSteps.length - 1) {
          setCurrentWorkflow({ ...currentWorkflow, subitems });
          setWorkflowStep(workflowStep + 1);
          setMenuEndpoint(`/pos/${currentSteps[workflowStep + 1]}`);
        } else {
          finalizeItem(subitems);
          setHalfSideActivated(false);
        }
      }
    }
  }

  const finalizeItem = (subitems) => {
    const finalizedItem = {
      quantity: 1,
      name: currentWorkflow.name,
      subitems,
      price:
        parseFloat(currentWorkflow.price) +
        subitems.reduce((sum, si) => sum + (parseFloat(si.premium_addition) || 0) * (si.quantity || 1), 0),
    };

    setCurrentOrder((prevOrder) => [...prevOrder, finalizedItem]);
    setTotal((prevTotal) => prevTotal + finalizedItem.price);
    resetCurrentWorkflow();
  };

  const handleHalfAndHalf = () => {
    if (currentWorkflow && currentWorkflow.steps[workflowStep] === "sides") {
      const updatedSteps = [...currentWorkflow.steps];
      updatedSteps.splice(workflowStep + 1, 0, "sides");

      setCurrentWorkflow({
        ...currentWorkflow,
        steps: updatedSteps,
      });

      setIsHalfAndHalf(true); 
    }
  };

  const handleCancelHalfSide = () => {
      const updatedSteps = [...currentWorkflow.steps];
      const firstSidesIndex = updatedSteps.indexOf("sides");
      const filteredSteps = updatedSteps.filter((step, index) => step !== "sides" || index === firstSidesIndex);
      
      setCurrentWorkflow({
        ...currentWorkflow,
        steps: filteredSteps,
        subitems: []
      });
  
      if (filteredSteps[firstSidesIndex] === "sides") {
        setWorkflowStep(firstSidesIndex);
        setMenuEndpoint(`/pos/${filteredSteps[firstSidesIndex]}`);
        setIsHalfAndHalf(false);
        setHalfSideActivated(false);
      } 
      else {
        resetCurrentWorkflow();
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

      const finalizedItem = {
        quantity: 1,
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

  const handleIncreaseQuantity = (index) => {
    const updatedOrder = [...currentOrder];
    updatedOrder[index].quantity += 1;
    setCurrentOrder(updatedOrder);
    setTotal((prevTotal) => prevTotal + updatedOrder[index].price);
  };

  const handleDecreaseQuantity = (index) => {
    if (currentOrder[index].quantity === 1) {
      setItemToDelete(index);
      setShowDeleteModal(true);
    } else {
      const updatedOrder = [...currentOrder];
      updatedOrder[index].quantity -= 1;
      setCurrentOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal - updatedOrder[index].price);
    }
  };

  const handleChangeQuantity = (index, newQuantity) => {
    const updatedOrder = [...currentOrder];
    if (newQuantity > 0) {
      const oldQuantity = updatedOrder[index].quantity;
      updatedOrder[index].quantity = newQuantity;
      const priceDifference = updatedOrder[index].price * (newQuantity - oldQuantity);
      setCurrentOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal + priceDifference);
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete !== null) {
      const updatedOrder = [...currentOrder];
      const itemPrice = updatedOrder[itemToDelete].price * updatedOrder[itemToDelete].quantity;
      updatedOrder.splice(itemToDelete, 1);
      setCurrentOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal - itemPrice);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDeleteItem = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const confirmCheckout = async () => {
    try {
      const response = await api.post("/pos/checkout/confirm", {
        items: currentOrder,
        total: (total*1.0625).toFixed(2),
      });

      if (response.status === 201) {
        setCurrentOrder([]);
        setTotal(0);
        setOrderNumber(orderNumber + 1);
        resetCurrentWorkflow();
        setShowCheckoutModal(false);
      } 
      else {
        throw new Error("Failed to finalize the order");
      }
    } catch (error) {
      console.error("Failed to finalize the order:", error);
      alert("Error during checkout. Please try again.");
      setShowCheckoutModal(false);
    }
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
            onHalfSide={handleHalfAndHalf}
            onCancelHalfSide={handleCancelHalfSide}
            halfSideActivated={halfSideActivated}
            setHalfSideActivated={setHalfSideActivated}
            currentWorkflow={currentWorkflow}
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
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onChangeQuantity={handleChangeQuantity}
          disableActions={disableActions}
        />
      </div>
      <Footer 
        navigate={navigate} 
        menuEndpoint={menuEndpoint}
        onBack={() => {
          if (workflowStep > 0) {
            const updatedSubitems = [...currentWorkflow.subitems];
            updatedSubitems.pop();
            const updatedSteps = [...currentWorkflow.steps];
      
            if (
              isHalfAndHalf &&
              updatedSteps[workflowStep] === "sides" &&
              updatedSteps[workflowStep - 1] === "sides"
            ) {
              updatedSteps.splice(workflowStep, 1);
              setIsHalfAndHalf(false);
              setHalfSideActivated(false);
              setWorkflowStep(workflowStep - 1);
              setMenuEndpoint(`/pos/${updatedSteps[workflowStep - 1]}`);
            } else {
              setCurrentWorkflow({
                ...currentWorkflow,
                subitems: updatedSubitems,
                steps: updatedSteps,
              });
      
              setWorkflowStep(workflowStep - 1);
              setMenuEndpoint(`/pos/${updatedSteps[workflowStep - 1]}`);
            }
          } 
          else {
            resetCurrentWorkflow();
          }
        }}
      />

      <Modal show={showDeleteModal} onHide={cancelDeleteItem}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this item from the order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteItem}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteItem}>
            Yes, Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to finalize Order #{orderNumber}?
          <br />
          <strong>Total Amount: ${(total*1.0625).toFixed(2)}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmCheckout}>
            Confirm Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PosMain;