import { Route, Routes, Link } from "react-router-dom";
import { NavBar } from "../kiosk/components/NavBar";
import "../../styles/signin/SignInError.css";

export default function SignInError() {
  return (
    <Routes>
      <Route
        path="/"
        element = {
          <>
            <NavBar></NavBar>
            <div className="signin-error-bg"></div>
            <div className="col-sm-4 container-fluid signin-error-container">
              <div className="row justify-content-center">
                <h1 className="col-sm-8 text-center signin-error-title">
                  Oh no!
                </h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-8">
                  <div className="signin-error-image"></div>
                </div> 
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-9 text-center">
                  <p className="signin-error-text">
                    There was an error processing your request.
                  </p>
                  <p className="signin-error-text">
                    Please try again later.
                  </p>
                  <Link className="signin-error-text" to="/kiosk" tabIndex="1">Return to Kiosk</Link>
                </div>
              </div>
            </div>
          </>
        }
      />
    </Routes>
  );
}