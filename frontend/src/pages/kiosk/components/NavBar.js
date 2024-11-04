import axios from "axios";
import beastLogo from "./beastLogo.png";
import "../../../styles/kiosk.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";




export function NavBar(){
  const [temp, setTemp] = useState();
  const [iconSrc, setIconSrc] = useState();
  const getWeather = async () =>{
    try {
      const resp = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather?q=College%20Station&units=imperial&appid=388a91292a2c36e2dc2582a04576599a"
      );
      setTemp(Math.round(resp.data.main.temp));
      setIconSrc(`https://openweathermap.org/img/wn/${resp.data.weather[0].icon}@2x.png`);
      console.log(resp.data);
    }
    catch(error){
      console.error("no return");
    }
  };

  useEffect(() => {
    getWeather();
  }, [] );


    return (
    <nav className="navbar">
      <div className="left-elem">
      <nav><Link to="../../kiosk">
      <button className="home-button">
      
      <img className="logo" src={beastLogo} alt="Beastmode logo"></img>
      
      </button>
      </Link></nav>
  
      </div>
      <div className="right-elem">

      <button className="translate-button">
      
      
      <div id="google_translate_element"></div>
     
      </button>
      <button className="weather-button">
      {temp} °F
      <img className="weather-icon" src={iconSrc}></img>
      </button>

      
      
      <button className="login-button">
      <nav><Link to="../../auth">
      <i class="bi bi-person-circle login-icon"></i>
      </Link></nav>
      </button>
      </div>
      </nav>
    );
}

