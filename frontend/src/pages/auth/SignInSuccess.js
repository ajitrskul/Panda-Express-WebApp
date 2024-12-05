import { useContext, useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { NavBar } from "../kiosk/components/NavBar";
import "../../styles/signin/SignInSuccess.css";
import { AccountContext } from './components/AccountContext';

export default function SignInSuccess() {
  const { customer } = useContext(AccountContext);
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up an interval to increment the counter every second
    const interval = setInterval(() => {
      setTimer(timer-1);
      if (timer === 1) {
        navigate('/kiosk/order');
        window.location.reload();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Routes>
      <Route
        path="/"
        element = {
          <>
            <NavBar></NavBar>
            <div className="signin-success-bg"></div>
            <div className="col-sm-12 container-fluid signin-success-text align-items-center">
              <div className="row justify-content-center">
                <div className="col-sm-8">
                  <div className="signin-success-check"></div>
                </div> 
              </div>
              <div className="row justify-content-center">
                <div className="col-6 text-center">
                  <h1 className="signin-success-title">Signed In </h1>
                  <h1 className="signin-success-title" style={{marginTop:"-30px"}}>Successfully!</h1>
                  <p className="signin-success-links">
                    Welcome <span style={{fontWeight:"bold"}}>{customer.first_name} {customer.last_name}</span>
                  </p>
                  <Link className="signin-success-links" to="/kiosk" tabIndex="1">Returning to Kiosk...{timer}</Link>
                </div>
              </div>
            </div>
          </>
        }
      />
    </Routes>
  );
}