import { React } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/kiosk.css';

function KioskLanding() { 
  const navigate = useNavigate();

  const handleStartOrdering = () => {
    navigate("/kiosk/order"); 
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 cover">
      <div>
        <button 
          onClick={handleStartOrdering} 
          className="start-order-button p-4" 
        >
          Start Ordering
        </button>
      </div>
    </div>
  );
}

export default KioskLanding;
