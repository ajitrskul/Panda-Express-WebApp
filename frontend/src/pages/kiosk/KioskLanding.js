import { React } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/kiosk.css';
import "../../styles/translate.css";
import { NavBar } from "./components/NavBar";

function KioskLanding() { 
  const navigate = useNavigate();
  const handleStartOrdering = () => {
    navigate("/kiosk/order"); 
  };

  const initTranslate = () =>{
    window.location.reload();
  }

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 cover">
       <NavBar></NavBar>
      <div className="button-landing-container">
        <button 
          onClick={handleStartOrdering} 
          className="start-order-button p-4" 
        >
          Start Ordering
        </button>

        <button className="translate-button" >
          <div id="google_translate_element"> </div> 
          <i class="bi bi-translate translate-icon" onClick={initTranslate}></i>
        </button>
      </div>
     
     
    </div>
  );
}

export default KioskLanding;
