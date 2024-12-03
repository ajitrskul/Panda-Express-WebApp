
import '../../../styles/sidebar-manager.css';
import { useNavigate } from "react-router-dom";
import beastLogo from "../../../assets/beast-logo.png";
import { useLocation } from 'react-router-dom';
import api from '../../../services/api'; 
import React, { useEffect } from "react";

export function SidebarManager(){
    const navigate = useNavigate();
    const location=useLocation();

    const InitColors = async () =>{
      if ((location.pathname)==="/manager/xreports"){
        dropdownFunction();
        document.getElementById("xreports").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/zreports"){
        dropdownFunction();
        document.getElementById("zreports").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/pairreports"){
        dropdownFunction();
        document.getElementById("pairreports").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/restockreports"){
        dropdownFunction();
        document.getElementById("restockreports").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/productusage"){
        dropdownFunction();
        document.getElementById("productusage").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/salesreports"){
        dropdownFunction();
        document.getElementById("salesreports").style.backgroundColor="#77070a";
        document.getElementById("reports").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/employees"){
        document.getElementById("employees").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/products"){
        document.getElementById("products").style.backgroundColor="#8c070c";
      }
      if ((location.pathname)==="/manager/inventory"){
        document.getElementById("inventory").style.backgroundColor="#8c070c";
      }
    }
    const SidebarClick = (event) =>{
      const id=event.target.id;
      if (id!=="zreports"){
        api.post('/manager/xzreports', "LEAVE", {timeout: 60000,
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      }


        switch(id){
          default:
            navigate("/manager");
            break;
          case "pos":
            navigate("/pos");
            break;
          case "login":
            navigate("/auth");
            break;
          case "kiosk":
            navigate("/kiosk");
            window.location.reload();
            break;
          case "menu":
            navigate("/menu");
            break;
          case "kitchen":
            navigate("/kitchen");
            break;
          case "xreports":
            navigate("/manager/xreports");
            break;
          case "zreports":
            navigate("/manager/zreports");
            break;
          case "restockreports":
            navigate("/manager/restockreports");
            break;
          case "pairreports":
            navigate("/manager/pairreports");
            break;
          case "salesreports":
            navigate("/manager/salesreports");
            break;
          case "employees":
            navigate("/manager/employees");
            break;
          case "products":
            navigate("/manager/products");
            break;
          case "inventory":
            navigate("/manager/inventory");
            break;
          case "productusage":
            navigate("/manager/productusage");
            break;
          }
      };

      const dropdownFunction = () =>{
        const reportsDrop=document.getElementById("sidebar-drop");
        const dropdownIcon=document.getElementById("dropdown-icon");
        const dropupIcon=document.getElementById("dropup-icon");
        
        if(dropupIcon.style.display==="none")
        {
          dropupIcon.style.display="block";
          dropdownIcon.style.display="none";
        }
        else
        {
          dropupIcon.style.display="none";
          dropdownIcon.style.display="block";
        }
        
        if(reportsDrop.style.display==="none")
        {
          reportsDrop.style.display="block";
        }
        else
        {
          reportsDrop.style.display="none";
        }
      };
      useEffect(() => {
      InitColors(); 
      },[]);
    return (
        <div class="manager-sidebar" id="manager-sidebar">
          <div class="logo-display" id="manager" onClick={SidebarClick}>
            <img className="logo-image" src={beastLogo} alt="Beastmode logo"></img>
            <div class="manager-sidebar-text">Manager View</div>
          </div>
          
          <hr class="sidebar-divider"></hr>
  
          <div class="sidebar-item" id="login" onClick={SidebarClick}>
            <i class="bi bi-person-circle sidebar-icon"></i>
            <div class="manager-sidebar-text2">Logout</div>
          </div>
    
          <hr class="sidebar-divider"></hr>
        
          <div class="sidebar-item" id="pos" onClick={SidebarClick}>
            <i class="bi bi-columns-gap sidebar-icon"></i>
            <div class="manager-sidebar-text2">POS</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </div>
    
          <div class="sidebar-item" id="kiosk" onClick={SidebarClick}>
            <i class="bi bi-shop sidebar-icon"></i>
            <div class="manager-sidebar-text2">Kiosk</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </div>
          
          <div class="sidebar-item" id="menu" onClick={SidebarClick}>
            <i class="bi bi-card-heading sidebar-icon"></i>
            <div class="manager-sidebar-text2">Menu Boards</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </div>

          <div class="sidebar-item" id="kitchen" onClick={SidebarClick}>
            <i class="bi bi-menu-button-wide sidebar-icon"></i>
            <div class="manager-sidebar-text2">Kitchen View</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </div>

          <hr class="sidebar-divider"></hr>

          <div class="sidebar-item" id="reports" onClick={dropdownFunction}>
            <i class="bi bi-bar-chart sidebar-icon"></i>
            <div class="manager-sidebar-text2">Reports</div>
            <i id="dropdown-icon" class="bi bi-chevron-down sidebar-dropdown-icon" ></i>
            <i id="dropup-icon" class="bi bi-chevron-up sidebar-dropup-icon" ></i>
          </div>
    
          <div class="sidebar-drop-items" id="sidebar-drop">

            <div class="sidebar-drop-item" id="xreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">X Reports</div>
            </div>

            <div class="sidebar-drop-item" id="zreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Z Reports</div>
            </div>

            <div class="sidebar-drop-item"  id="restockreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Restock Reports</div>
            </div>

            <div class="sidebar-drop-item"  id="pairreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Paired Products Report</div>
            </div>
        
            <div class="sidebar-drop-item"  id="productusage" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Product Usage</div>
            </div>
            
            <div class="sidebar-drop-item"  id="salesreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Sales Reports</div>
            </div>

          </div>

          <div class="sidebar-item" id="employees" onClick={SidebarClick}>
            <i class="bi bi-people-fill sidebar-icon"></i>
            <div class="manager-sidebar-text2">Employees</div>
          </div>
          
          <div class="sidebar-item" id="products" onClick={SidebarClick}>
            <i class="bi bi-cup-straw sidebar-icon"></i>
            <div class="manager-sidebar-text2">Products</div>
          </div>
          
          <div class="sidebar-item" id="inventory" onClick={SidebarClick}>
            <i class="bi bi-box-seam sidebar-icon"></i>
            <div class="manager-sidebar-text2">Inventory</div>
          </div>
        
        </div>
    );
};

export default SidebarManager;