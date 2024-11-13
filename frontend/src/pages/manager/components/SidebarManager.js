
import '../../../styles/sidebar-manager.css';
import { useNavigate } from "react-router-dom";
import beastLogo from "./beastLogo.png";

export function SidebarManager(){
    const navigate = useNavigate();

    const SidebarClick = (event) =>{
      const id=event.target.id;
      console.log(id);
        switch(id){
          case "manager":
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
    
    return (
      <div>
        <div class="manager-sidebar" id="manager-sidebar">
          <div class="logo-display" id="manager" onClick={SidebarClick}>
            <img className="logo-image" src={beastLogo} alt="Beastmode logo"></img>
            <div class="manager-sidebar-text">Manager View</div>
          </div>
          
          <hr class="divider"></hr>
  
          <a class="sidebar-item" id="login" onClick={SidebarClick}>
            <i class="bi bi-person-circle sidebar-icon"></i>
            <div class="manager-sidebar-text2">Login</div>
          </a>
    
          <hr class="divider"></hr>
        
          <a class="sidebar-item" id="pos" onClick={SidebarClick}>
            <i class="bi bi-columns-gap sidebar-icon"></i>
            <div class="manager-sidebar-text2">POS</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </a>
    
          <a class="sidebar-item" id="kiosk" onClick={SidebarClick}>
            <i class="bi bi-shop sidebar-icon"></i>
            <div class="manager-sidebar-text2">Kiosk</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </a>
          
          <a class="sidebar-item" id="menu" onClick={SidebarClick}>
            <i class="bi bi-card-heading sidebar-icon"></i>
            <div class="manager-sidebar-text2">Menu Boards</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </a>

          <a class="sidebar-item" id="kitchen" onClick={SidebarClick}>
            <i class="bi bi-menu-button-wide sidebar-icon"></i>
            <div class="manager-sidebar-text2">Kitchen View</div>
            {/*<i class="bi bi-lock-fill sidebar-icon-right"></i>*/}
          </a>

          <hr class="divider"></hr>

          <a class="sidebar-item" onClick={dropdownFunction}>
            <i class="bi bi-bar-chart sidebar-icon"></i>
            <div class="manager-sidebar-text2">Reports</div>
            <i id="dropdown-icon" class="bi bi-chevron-down sidebar-dropdown-icon" ></i>
            <i id="dropup-icon" class="bi bi-chevron-up sidebar-dropup-icon" ></i>
          </a>
    
          <a class="sidebar-drop-items" id="sidebar-drop">

            <div class="sidebar-drop-item" id="xreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">X Reports</div>
            </div>

            <div class="sidebar-drop-item" id="zreports" onClick={SidebarClick}>
              <div class="manager-sidebar-text3">Z Reports</div>
            </div>

            <div class="sidebar-drop-item">
              <div class="manager-sidebar-text3">Restock Reports</div>
            </div>

          </a>

          <a class="sidebar-item">
            <i class="bi bi-people-fill sidebar-icon"></i>
            <div class="manager-sidebar-text2">Employees</div>
          </a>
          
          <a class="sidebar-item">
            <i class="bi bi-cup-straw sidebar-icon"></i>
            <div class="manager-sidebar-text2">Products</div>
          </a>
          
          <a class="sidebar-item">
            <i class="bi bi-box-seam sidebar-icon"></i>
            <div class="manager-sidebar-text2">Inventory</div>
          </a>
        
        </div>
      </div>
    );
};

export default SidebarManager;