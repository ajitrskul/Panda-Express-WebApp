import beastLogo from "./beastLogo.png";
import "../../../styles/kiosk.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";


export function NavBar(){
    return (
    <nav class="navbar">

      <img class="logo" src={beastLogo} alt="Beastmode logo"></img>
      
      <button class="cart-button">
      <i class="bi bi-cart4 cart-icon"></i>
      <button class="cart-num"> 0 </button>
      </button>

      
      
      <button class="login-button">
      <nav><Link to="../../auth">
      <i class="bi bi-person-circle login-icon"></i>
      </Link></nav>
      </button>
      </nav>
    );
}
