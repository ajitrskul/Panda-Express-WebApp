import axios from "axios";
import beastLogo from "./beastLogo.png";
import "../../../styles/navbar.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../../auth/components/AccountContext";

export function NavBar(){
  const { customer, customerSignOut } = useContext(AccountContext);
  const [loginBar, setLoginBar] = useState(false);

  const navigate = useNavigate();
  const [temp, setTemp] = useState();
  const [iconSrc, setIconSrc] = useState();

  //Fetch weather from OpenWeather API
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

  //Handle button clicks and navigate to the correct page, reload if needed
  const navHome = () => {
     navigate(`/kiosk`);
    window.location.reload();
    document.cookie="googtrans=/en/en;"
  }

  const navSignIn = () => {
    navigate(`/auth/signin`);
    window.location.reload();
  }

  const navSignUp = () => {
    navigate(`/auth/signup`);
    window.location.reload();
  }

  //Login Dropdown
  useEffect(() => {
    // Function to handle the click event
    const closeLoginBar = (event) => {
      //setLoginBar(true);
      if (event.target.classList.contains('login-button') || event.target.classList.contains('login-icon') || event.target.classList.contains('nav-signin-name')) {
        setLoginBar(!loginBar);
      }
      else if (loginBar) {
        setLoginBar(false); // or toggle state with `setClicked(prev => !prev)`
      }
    };

    // Add event listener for clicks on the whole document
    document.addEventListener('click', closeLoginBar);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', closeLoginBar);
    };
  }); 

    return (
      <div class="row">
        <nav className="navbar fixed-top">

          {/*home button*/}
          <div class="col">
            <button className="home-button" id="home-button" onClick={navHome}>
              <img className="logo" src={beastLogo} alt="Beastmode logo"></img>
            </button>
          </div>

           {/*display weather*/}
          <div className="col-auto">
            <button className="weather-button">
              <div className="notranslate" id="weather-text">
                {temp} °F
                <img className="weather-icon" src={iconSrc} alt="icon displaying the current weather"></img>
              </div>
            </button>
          </div>

           {/*login button*/}
          {!customer.isSignedIn && <div className="col-auto navbar-login">
            <button className="login-button">
              <i className="bi bi-person-circle login-icon"></i>
            </button>
            {
            loginBar &&
              <div className="navbar-drop text-start">
                <div className="navbar-drop-option" onClick={navSignIn}>
                  <i className="bi bi-box-arrow-in-right nav-drop-icon"></i>
                  Login
                </div>
                <div className="navbar-drop-option" onClick={navSignUp}>
                  <i className="bi bi-pencil-square nav-drop-icon"></i>
                    Signup
                </div>
              </div>
            }
          </div>}
          {customer.isSignedIn && 
          <div className="col-auto text-center nav-signin-text-container" style={{borderLeft:"solid", borderLeftColor:"white", borderLeftWidth:"2px"}}>
            <p className="nav-signin-text">{customer.beast_points} <span style={{fontWeight:"600"}}>pts</span></p>
          </div>}

          {customer.isSignedIn && 
            <div className="col-auto text-center nav-signin-text-container" style={{borderLeft:"solid", borderLeftColor:"white", borderLeftWidth:"2px"}}>
              <p className="nav-signin-text nav-signin-name">{customer.first_name} {customer.last_name}</p>
              {
              loginBar &&
              <div className="navbar-drop-signedin text-start">
                <div className="navbar-drop-logout" onClick={customerSignOut}>
                  <i className="bi bi-box-arrow-in-left nav-drop-icon"></i>
                  Log Out
                </div>
              </div>
              }
            </div>}

        </nav>
      </div>
    
    );
}

export default NavBar;