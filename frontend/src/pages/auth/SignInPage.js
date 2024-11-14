import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { NavBar } from "../kiosk/components/NavBar";
import QRCode from "../../assets/qr-code.webp"
import "../../styles/signin/SignInPage.css";
import api from '../../services/api';

//function that handles signup page logic & frontend
export default function SignInPage() {
  //set up useState object and functions to hold current input states
  const navigate = useNavigate();

  const [signinInput, setSignInInput] = useState({
    email: "",
    password: ""
  });

  //set up useState object and functions to hold error states
  const [signinError, setSignInError] = useState({
    email: "",
    password: "",
    correct_login: "",
    valid_email: {
      email_class: "col-sm-5 p-2 signin-input",
      isHighlighted: false
    },
    valid_password: {
      password_class: "col-sm-5 p-2 signin-input",
      isHighlighted: false
    }
  });

  const [signinClass, setSignInClass] = useState({
    button_class: "signin-submit",
    loading_class: "spinner-border signin-spinning-loader"
  });

  //when an input is changed, set the usestate object to that state
  const handleSignInInput = (name, value) => {
    setSignInInput({
      ...signinInput,
      [name]: value
    });
  };

  const clear = () => {
    setSignInInput({
      email: "",
      password: ""
    });
  }

  const signinUser = async () => {
    try {
      const response = await api.post("/auth/signin/email", signinInput.email);
      if (!response.data) { //email does not exist in database
        setSignInError({
          password: "",
          correct_login: "Username or password incorrect",
          valid_email: {
            email_class: "col-sm-5 p-2 signin-input invalid-input",
            isHighlighted: true
          },
          valid_password: {
            password_class: "col-sm-5 p-2 signin-input invalid-input",
            isHighlighted: true
          }
        });
      }
      else { //email does exist in database (valid email)
        const hashResponse = await fetch(`${process.env.REACT_APP_HASH_API_KEY}validate?plain=${signinInput.password}&hashed=${response.data}`);

        const validPassword = await hashResponse.json();
        if (validPassword.valid) { //correct password

          //signin user
          clear();
          navigate("/auth/signup/success");
        }
        else { //incorrect password
          setSignInError({
            password: "",
            correct_login: "Username or password incorrect",
            valid_email: {
              email_class: "col-sm-5 p-2 signin-input invalid-input",
              isHighlighted: true
            },
            valid_password: {
              password_class: "col-sm-5 p-2 signin-input invalid-input",
              isHighlighted: true
            }
          });
        }
      }
    } catch (error) {
      //Issue from API Call
      clear();
      navigate("/auth/signup/error");
    }
  }

  const validateSignInInput = async (event) => {
    setSignInClass({
      ...signinClass,
      button_class: "signin-submit signin-submission-loading",
      loading_class: "spinner-border signin-spinning-loader signin-loader-opacity"
    });

    let isInvalid = false;

    //prevents reloading the page when handling form data
    event.preventDefault();

    //tracks current error from form
    let currentError = {
      email: "",
      password: "",
      valid_email: {
        email_class: "col-sm-5 p-2 signin-input",
        isHighlighted: false
      },
      valid_password: {
        password_class: "col-sm-5 p-2 signin-input",
        isHighlighted: false
      }
    };

    if (!signinInput.email) {
      currentError.email = "Email field is empty";
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (signinInput.email.length > 50){
      currentError.email= "Email length cannot exceed 50 characters"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }
    else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinInput.email))){
      currentError.email = "Please enter a valid email"
      if (!currentError.valid_email.isHighlighted) {
        currentError.valid_email.email_class += " invalid-input";
      }
      currentError.valid_email.isHighlighted = true;
      isInvalid = true;
    }

    if (!signinInput.password) {
      currentError.password = "Password field is empty";
      if (!currentError.valid_password.isHighlighted) {
        currentError.valid_password.password_class += " invalid-input";
      }
      currentError.valid_password.isHighlighted = true;
      isInvalid = true;
    }
    else if (signinInput.password && signinInput.password.length > 50) {
      currentError.password = "Password may not exceed 50 characters"
      if (!currentError.valid_password.isHighlighted) {
        currentError.valid_password.password_class += " invalid-input";
      }
      currentError.valid_password.isHighlighted = true;
      isInvalid = true;
    }
    
    //should only be not equal when there is an error present
    if (currentError !== signinError){ 
      setSignInError(currentError);
    }
    
    if (!isInvalid) {
      //send request to server
      await signinUser();
    }
    setSignInClass({
      ...signinClass,
      button_class: "signin-submit",
      loading_class: "spinner-border signin-spinning-loader"
    });
  }

  return (
    <Routes>
      <Route 
        path="/"
        element={
        <>
          <div className="signin-bg"></div>
          <div className="container-fluid signin-bg2-container">
            <NavBar></NavBar>
            <div className="row signin-bg2-row justify-content-center">
              <div className="col-sm-6 signin-bg2"></div>
            </div>
          </div>
          <div className="container-fluid signin-form">
            <h1 className="text-center display-1 signin-title">Log In</h1>
            <form method="POST" onSubmit={validateSignInInput}>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-5 signin-remove-padding">
                  {signinError.correct_login && <div className="alert alert-danger text-center">{signinError.correct_login}</div>}
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-5 signin-remove-padding">
                  <label className="col-6 signin-label signin-remove-padding" htmlFor="signin-email">Email:</label>
                </div>
              </div>
              <div className="row justify-content-center">
                <input value={signinInput.email} className={signinError.valid_email.email_class} id="signin-email" name="email" placeholder="Email" tabIndex="1" onChange={({ target }) => {
                  handleSignInInput(target.name, target.value);
                }}></input>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signin-remove-padding error-message">{signinError.email}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-5 signin-remove-padding">
                  <label className="text-start signin-label" htmlFor="signin-password">Password:</label>
                </div>
              </div>
              <div className="row justify-content-center">
                <input value={signinInput.password} className={signinError.valid_password.password_class} type="password" id="signin-password" name="password" placeholder="Password" tabIndex="2" onChange={({ target }) => {
                  handleSignInInput(target.name, target.value);
                }}></input>
              </div>
              <div className="row justify-content-center">
                <p className="col-sm-5 signin-remove-padding error-message">{signinError.password}</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-5 text-center">
                  <p className="signin-navigate-login">
                    Don't have an account? <Link to="/auth/signup" tabIndex="3">Sign Up.</Link>
                  </p>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-sm-5 text-center">
                  <button type="submit" className={signinClass.button_class} tabIndex="4">
                    LOGIN
                    <div class={signinClass.loading_class} role="status"></div>
                  </button>
                </div>
              </div>
              <div className="row justify-content-center signin-or">
                OR
              </div>
            </form>
            <div className="row justify-content-center">
              <div className="col-sm-5 text-center">
                <Link to="/auth/signin/QR" tabIndex="4">
                  <button className="signin-QR">
                    <img src={QRCode} className="signin-qr-img" alt="QR code icon"/> 
                    Login with QR Code 
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
        }
      />
    </Routes>
  );
};