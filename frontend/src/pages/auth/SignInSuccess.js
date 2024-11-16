import { useContext } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import { NavBar } from "../kiosk/components/NavBar";
import "../../styles/signin/SignInSuccess.css";
import { CustomerContext } from './components/CustomerContext';

export default function SignInSuccess() {
  const { customer } = useContext(CustomerContext);
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
                  <h1 className="signin-success-title">Signed In Successfully!</h1>
                  <p className="signin-success-links">
                    Welcome {customer.first_name} {customer.last_name}
                  </p>
                  <Link className="signin-success-links" to="/kiosk" tabIndex="1">Return to Kiosk</Link>
                </div>
              </div>
            </div>
          </>
        }
      />
    </Routes>
  );
}