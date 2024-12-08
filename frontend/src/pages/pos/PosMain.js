import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/pos.css";
import MenuSection from "./components/MenuSection";
import OrderSection from "./components/OrderSection";
import Footer from "./components/Footer";
import SizeSelection from "./components/SizeSelection";
import { Modal, Button } from "react-bootstrap";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";

function PosMain() {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [originalTotal, setOriginalTotal] = useState(0);
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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const isProcessingQRRef = useRef(false);
  const [QRStatus, setQRStatus] = useState({
    isLoading: false,
    loadingVisual: false,
    videoClass: "col-12 qr-video",
    errorMsg: "",
    QRFrame: "qr-frame"
  });
  const [customerId, setCustomerId] = useState(0);
  const [beastPoints, setBeastPoints] = useState(0);
  const [beastPointsUsed, setBeastPointsUsed] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");

  const applyDiscount = (discountType, discountCost) => {
    if (selectedDiscount === discountType) {
      setTotal(originalTotal); 
      setSelectedDiscount(null); 
    } 
    else if (beastPoints >= discountCost) {
      let discountMultiplier = 1;
      if (discountType === "20%") discountMultiplier = 0.8;
      if (discountType === "45%") discountMultiplier = 0.55;
      if (discountType === "75%") discountMultiplier = 0.25;
  
      const newTotal = originalTotal * discountMultiplier;
  
      setTotal(newTotal); 
      setSelectedDiscount(discountType);
      setBeastPointsUsed(discountCost); 
    } else {
      alert(`Not enough Beast Points for ${discountType} discount.`);
    }
  };
  

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

  useEffect(() => {
    const calculateOriginalTotal = currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setOriginalTotal(calculateOriginalTotal);
    setTotal(calculateOriginalTotal);
  }, [currentOrder]);

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
        subitems.reduce((sum, si) => sum + (parseFloat(si.premium_addition)) * (parseFloat(currentWorkflow.multiplier))  * (si.quantity || 1), 0),
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
      const checkoutResponse = await api.post("/pos/checkout/confirm", {
        items: currentOrder,
        total: (total * 1.0825).toFixed(2),
        customer_id: customerId,
        beast_points_used: beastPointsUsed,
      });
  
      if (checkoutResponse.status === 201) {
        toast.success("Order successfully processed!");
        if (recipientEmail) {
          try {
            const newOrderNumber = checkoutResponse.data.order_number || orderNumber;
            const emailResponse = await api.post(`/manager/orders/${newOrderNumber}/email`, {
              email: recipientEmail,
            });
  
            if (emailResponse.status === 200) {
              toast.success("Receipt emailed successfully!");
            } 
            else {
              console.error("Email Error:", emailResponse.data);
              toast.error("Failed to send receipt email.");
            }
          } catch (emailError) {
            console.error("Email Error:", emailError);
            toast.error("Failed to send receipt email.");
          }
        }

        setTimeout(() => {
          window.location.reload();
        }, 5000); 
      } 
      else {
        console.error("Checkout Error:", checkoutResponse.data);
        toast.error("Error during checkout. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setShowCheckoutModal(false);
    }
  };
  

  const testSignIn = async (customerLogin) => {
    const signinSuccess = await api.post("/auth/signin/qr", customerLogin);
    console.log(signinSuccess);
    if (signinSuccess.data) {
      setShowQRScanner(false);
      setQRStatus({
        isLoading: false,
        loadingVisual: false,
        videoClass: "col-12 qr-video",
        errorMsg: "",
        QRFrame: 'qr-frame'});
      setCustomerId(signinSuccess.data.customer_id);
      setFirstName(signinSuccess.data.first_name); 
      setLastName(signinSuccess.data.last_name); 
      setBeastPoints(signinSuccess.data.beast_points); 
      return;
    }
    else {
      setQRStatus({
        isLoading: true,
        loadingVisual: false,
        videoClass: "col-12 qr-video qr-video-error",
        errorMsg: 'Invalid QR Code',
        QRFrame: "qr-frame qr-frame-error"});

      setTimeout(() => { //delay before resetting to no error frame
        setQRStatus({
          isLoading: false,
          loadingVisual: false,
          videoClass: "col-12 qr-video",
          errorMsg: "",
          QRFrame: 'qr-frame'
        });
      },2000)
    }
  };

  const handleQRClose = () => {
    setShowQRScanner(false);
    isProcessingQRRef.current = false; 
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
            window.location.reload();
          }}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onChangeQuantity={handleChangeQuantity}
          disableActions={disableActions}
          customerId={customerId}
          onQRSignInToggle={() => setShowQRScanner(true)}
        />
      </div>
      <Footer 
        firstName={firstName}
        lastName={lastName}
        beastPoints={beastPoints}
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
    <Modal.Title>Submit Order #{orderNumber}?</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {beastPoints > 0 && (
      <div>
        <p>
          {firstName} has <strong>{beastPoints}</strong> Beast Points!
        </p>
        <div className="d-flex flex-column">
          <Button
            variant={selectedDiscount === "20%" ? "success" : "outline-success"}
            className="mb-2"
            onClick={() => applyDiscount("20%", 3000)}
            disabled={beastPoints < 3000}
          >
            20% Discount (3000 BPs)
          </Button>
          <Button
            variant={selectedDiscount === "45%" ? "success" : "outline-success"}
            className="mb-2"
            onClick={() => applyDiscount("45%", 5000)}
            disabled={beastPoints < 5000}
          >
            45% Discount (5000 BPs)
          </Button>
          <Button
            className="mb-2"
            variant={selectedDiscount === "75%" ? "success" : "outline-success"}
            onClick={() => applyDiscount("75%", 8000)}
            disabled={beastPoints < 8000}
          >
            75% Discount (8000 BPs)
          </Button>
        </div>
      </div>
    )}
    {customerId !== 0 && <hr />}
    <div style={{ textAlign: "right" }}>
      <p style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Subtotal:</span>
        <span>${originalTotal.toFixed(2)}</span>
      </p>

      {selectedDiscount && (
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "green",
          }}
        >
          <span>
            <strong>Discount ({selectedDiscount}):</strong>
          </span>
          <span>- ${Math.abs(originalTotal - total).toFixed(2)}</span>
        </p>
      )}

      <p style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Tax:</span>
        <span>${(total * 0.0825).toFixed(2)}</span>
      </p>

      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "1.2em",
          color: "black",
          marginBottom: "0px",
        }}
      >
        <span>Total:</span>
        <span>${(total * 1.0825).toFixed(2)}</span>
      </p>
    </div>

    {/* Email Input Field */}
    <div className="mt-4">
      <label htmlFor="emailInput" className="form-label">
        Email Receipt (optional):
      </label>
      <input
        type="email"
        id="emailInput"
        className="form-control"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="example@example.com"
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
      Cancel
    </Button>
    <Button variant="success" onClick={confirmCheckout}>
      Checkout
    </Button>
  </Modal.Footer>
</Modal>


      <Modal show={showQRScanner} onHide={handleQRClose}>
        <Modal.Header closeButton>
          <Modal.Title>Scan QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrReader onResult={(result) => {
              if (QRStatus.isLoading || !result) { //return immediately if function already running or there is no qr code
                return;
              }
              else { //there is a qr code & function not running
                setQRStatus({ //set loading & visuals
                  isLoading: true,
                  loadingVisual: true,
                  videoClass: "col-12 qr-video qr-video-loading",
                  errorMsg: "",
                  QRFrame: 'qr-frame qr-frame-loading',
                })
                let customerLogin  = {}
                console.log(result.text);
                try { //attempt to parse QR code into JSON
                  const scannedInfo = JSON.parse(result.text);
                  
                  //check that all fields are present before setting customerLogin
                  if (
                    scannedInfo.email != null &&
                    scannedInfo.password != null
                  ) {
                    customerLogin = {
                      email: scannedInfo.email,
                      password: scannedInfo.password,
                    };

                    try { //all fields were present -> authenticate user
                      testSignIn(customerLogin);
                    } catch(err) { //error authenticating user
                      navigate("/auth/signin/error");
                      window.location.reload();
                    } 
                  }
                  else { //if not all fields are present end function immediately
                    setQRStatus({
                      isLoading: true,
                      loadingVisual: false,
                      videoClass: "col-12 qr-video qr-video-error",
                      errorMsg: 'Invalid QR Code',
                      QRFrame: 'qr-frame qr-frame-error'
                    });

                    setTimeout(() => { //delay before resetting to no error frame
                      setQRStatus({
                        isLoading: false,
                        loadingVisual: false,
                        videoClass: "col-12 qr-video",
                        errorMsg: "",
                        QRFrame: 'qr-frame'
                      });
                    },2000)
                    return;
                  }
                } catch(err) { //error parsing Login (invalid QR code most likely)
                  setQRStatus({
                    isLoading: true,
                    loadingVisual: false,
                    videoClass: "col-12 qr-video qr-video-error",
                    errorMsg: 'Invalid QR Code',
                    QRFrame: 'qr-frame qr-frame-error'});

                  setTimeout(() => { //delay before resetting to no error frame
                    setQRStatus({
                      isLoading: false,
                      loadingVisual: false,
                      videoClass: "col-12 qr-video",
                      errorMsg: "",
                      QRFrame: 'qr-frame'
                    });
                  },2000)
                  return;
                }

                setQRStatus({ //function done running
                  isLoading: false,
                  loadingVisual: false,
                  videoClass: "col-12 qr-video",
                  errorMsg: "",
                  QRFrame: 'qr-frame'
                });
              }
              }}
              className={QRStatus.videoClass}
            />
            <p className="qr-error-msg text-center">{QRStatus.errorMsg}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleQRClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PosMain;