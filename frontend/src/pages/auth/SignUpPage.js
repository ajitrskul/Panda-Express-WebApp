import { Route, Routes, Link } from "react-router-dom";
import { useState } from 'react';
import "../../styles/SignUpPage.css";

//function that handles signup page logic & frontend
export function SignUpPage() {
  //set up useState object and functions to hold current input states
  const [signupInput, setSignUpInput] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: ""
  });

  //set up useState object and functions to hold error states
  const [signupError, setSignUpError] = useState({
    email: "",
    name: "",
    password: "",
    confirm_password: "",
    emailValid: "",
    first_nameValid: "",
    last_nameValid: "",
    passwordValid: "",
    confirm_passwordValid:""
  });

  //when an input is changed, set the usestate object to that state
  const handleSignUpInput = (name, value) => {
    setSignUpInput({
      ...signupInput,
      [name]: value
    });
  };

  const validateSignUpInput = (event) => {
    console.log(signupInput);
    console.log(signupError);

    let isInvalid = false;

    //prevents reloading the page when handling form data
    event.preventDefault();

    //tracks current error from form
    let currentError = {
      email: "",
      name: "",
      password: "",
      confirm_password: "",
      emailValid: "",
      first_nameValid: "",
      last_nameValid: "",
      passwordValid: "",
      confirm_passwordValid: ""
    };

    if (!signupInput.email) {
      currentError.email = "Email is required";
      isInvalid = true;
    }
    else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupInput.email))){
      currentError.email = "Please enter a valid email"
    }
    
    if (!signupInput.first_name || !signupInput.last_name) {
      currentError.name = "First and last name are required";
      isInvalid = true;
    }

    if (!signupInput.password) {
      currentError.password = "Password is required";
      isInvalid = true;
    }

    if (!signupInput.confirm_password) {
      currentError.confirm_password = "Password confirmation is required";
      isInvalid = true;
    }
    else if (signupInput.password !== signupInput.confirm_password) {
      currentError.confirm_password = "Passwords should match";
      isInvalid = true;
    }

    if (signupInput.password && (!(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{10,}$/.test(signupInput.password)))) {
      currentError.password = "Password must contain at least one upper case letter, one special character, and be at least 10 characters long";
      isInvalid = true;
    }

    setSignUpError(currentError);
    if (!isInvalid) {
      
    }
    return;
  }

  return (
    <Routes>
      <Route 
        path="/"
        element={
        <>
          <div className="signup-bg"></div>
          <div className="container-fluid signup-bg2-container">
            <div className="row signup-bg2-row justify-content-center">
              <div className="col-sm-6 signup-bg2"></div>
            </div>
          </div>
          <div className="container-fluid signup-form">
            <h1 className="text-center display-1 signup-title">Sign Up</h1>
            <form method="POST" onSubmit={validateSignUpInput}>
              <div className="row justify-content-center align-items-end">
                <label className="col-6 col-sm-2 signup-label signup-remove-padding" htmlFor="signup-email">Email:</label>
                <p className="col-6 col-sm-3 text-end signup-required-fields">*All fields are required</p>
              </div>
              <div className="row justify-content-center">
                <input value={signupInput.email} className="col-sm-5 p-2 signup-input" id="signup-email" name="email" placeholder="Email" tabIndex="1" onChange={({ target }) => {
                  handleSignUpInput(target.name, target.value);
                }}></input>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signup-remove-padding error-message">{signupError.email}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-xs-5 col-sm-2 signup-remove-padding">
                  <div>
                    <label className="signup-label" htmlFor="signup-firstname">First Name:</label>
                    <input value={signupInput.first_name} className="p-2 signup-input signup-names" id="signup-firstname" name="first_name" placeholder="First Name" tabIndex="2" onChange={({ target }) => {
                      handleSignUpInput(target.name, target.value);
                    }}></input>
                  </div>
                </div>
                <div className="col-xs-5 col-sm-3 signup-last-name">
                  <div>
                    <label className="signup-label" htmlFor="signup-lastname">Last Name:</label>
                    <input value={signupInput.last_name} className="p-2 signup-input signup-names" id="signup-lastname" name="last_name" placeholder="Last Name" tabIndex="3" onChange={({ target }) => {
                      handleSignUpInput(target.name, target.value);
                    }}></input>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signup-remove-padding error-message">{signupError.name}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-5 signup-remove-padding">
                  <label className="text-start signup-label" htmlFor="signup-password">Password:</label>
                </div>
              </div>
              <div className="row justify-content-center">
                <input value={signupInput.password} className="col-sm-5 p-2 signup-input" type="password" id="signup-password" name="password" placeholder="Password" tabIndex="4" onChange={({ target }) => {
                  handleSignUpInput(target.name, target.value);
                }}></input>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signup-remove-padding error-message">{signupError.password}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-5 signup-remove-padding">
                  <label className="col-5 signup-label" htmlFor="signup-confirm-password">Confirm Password:</label>
                </div>
              </div>
              <div className="row justify-content-center">
                <input value={signupInput.confirm_password} className="col-sm-5 p-2 signup-input" type="password" id="signup-confirm-password" name="confirm_password" placeholder="Confirm Password" tabIndex="5" onChange={({ target }) => {
                  handleSignUpInput(target.name, target.value);
                }}></input>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signup-remove-padding error-message">{signupError.confirm_password}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-5 text-center">
                  <p className="signup-navigate-login">
                    Already have an account? <Link to="/auth" tabIndex="6">Log in.</Link>
                  </p>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-5 text-center">
                  <button type="submit" className="signup-submit" tabIndex="7">SUBMIT</button>
                </div>
              </div>
            </form>
          </div>
        </>
        }
      />
    </Routes>
  );
};

