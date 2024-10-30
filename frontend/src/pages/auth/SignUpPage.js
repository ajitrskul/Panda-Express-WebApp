import { Route, Routes, Link } from "react-router-dom";
import "../../styles/SignUpPage.css";


export function SignUpPage() {
  return (
    <Routes>
      <Route 
        path="/"
        element={
        <>
          <div className="signup-bg"></div>
          <div className="container-fluid overflow-hidden signup-form">
            <h1 className="text-center display-1 signup-title">Sign Up</h1>
            <form method="post" onSubmit={(sign_up_data) => {
              
            }}>
              <div className="row">
                <div className="col-sm"></div>
                <input className="col-sm-5 p-2 signup-input" placeholder="Email"></input>
                <div className="col-sm"></div>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-2 signup-first-name">
                  <div>
                    <input className="p-2 signup-input" placeholder="First Name"></input>
                  </div>
                </div>
                <div className="col-sm-3 signup-last-name">
                  <div>
                    <input className="p-2 signup-input" placeholder="Last Name"></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <input className="col-sm-5 p-2 signup-input" placeholder="Password"></input>
                <div className="col-sm"></div>
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <input className="col-sm-5 p-2 signup-input" placeholder="Retype Password"></input>
                <div className="col-sm"></div> 
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm-3"></div>
                <p className="col-sm-2 text-end signup-required-fields">*All fields are required</p>
                <div className="col-sm"></div>
              </div>
              <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm-4"></div>
                <button type="submit" className="col-1 signup-submit">SUBMIT</button>
                <div className="col-sm"></div>
              </div>
            </form>
            <Link to="/auth">Go Back!</Link>
          </div>
        </>
        }
      />
    </Routes>
  );
}

