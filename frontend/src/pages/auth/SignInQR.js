import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "../kiosk/components/NavBar";
import { QrReader } from 'react-qr-reader';
import api from '../../services/api';
import "../../styles/signin/SignInQR.css";
import { CustomerContext } from './components/CustomerContext';


export default function SignInQR() {
  const { signIn } = useContext(CustomerContext);

  const [data, setData] = useState({
    customer_id: null,
    email: "",
    first_name: "",
    last_name: "",
    beast_points: null
  });
  
  const [error, setError] = useState({
    videoClass: "col-12 qr-video",
    errorMsg: "",
    errorFrame: "qr-frame"
  });

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const leavePage = ((event) => {
    switch (event.target.id) {
      case 'qr-kiosk':
        navigate('/kiosk')
        window.location.reload();
        break;
      case 'qr-login':
        navigate('/auth/signin')
        window.location.reload();
        break
      default:
        break;
    }
  });

  const testSignIn = async () => {
    const signinSuccess = await api.post("auth/signin/qr", data);
    if (signinSuccess) {
      signIn(data);
      // navigate("/auth/signin/success");
      setTimeout(() => {
        navigate("/auth/signin/success");
        window.location.reload()}, 1000);
    }
    else {
      setError({
        videoClass: "col-12 qr-video qr-video-error",
        errorMsg: 'Invalid QR Code',
        errorFrame: "qr-frame qr-frame-error"});
    }
  };

  return (
    <>
      <NavBar />
      <div className="qr-bg"></div>
      <div className="qr-container">
        <div className="fluid-container qr-video-container">
          <h1 className="row text-center">
            <p className="col-12 qr-title">Login with QR-Code</p>
          </h1>
          <div className="row justify-content-center qr-row">
            <QrReader onResult={(result) => {
              if (result) {
                try {
                  setLoading(true);
                  setError({
                    ...error,
                    errorFrame: 'qr-frame qr-frame-loading',
                    videoClass: "col-12 qr-video qr-video-loading"
                  })
                  const scannedInfo = JSON.parse(result.text);
                  setData({
                    customer_id: scannedInfo.customer_id,
                    email: scannedInfo.email,
                    first_name: scannedInfo.first_name,
                    last_name: scannedInfo.last_name,
                    beast_points: scannedInfo.beast_points
                  });
                } catch(err) {
                  setLoading(false);
                  setError({
                    videoClass: "col-12 qr-video qr-video-error",
                    errorMsg: 'Invalid QR Code',
                    errorFrame: 'qr-frame qr-frame-error'});

                    setTimeout(() => {
                      setError({
                        videoClass: "col-12 qr-video",
                        errorMsg: "",
                        errorFrame: 'qr-frame'
                      });
                    },2000)
                  return;
                }   

                try {
                  testSignIn();
                } catch(err) {
                  navigate("/auth/signin/error");
                  window.location.reload();
                }
              }
            }}
            className={error.videoClass}
            />
            {error && <p className="qr-error-msg text-center">{error.errorMsg}</p>}
            {loading && <div className="spinner-border qr-loading" role="status"></div>}
            {loading && <div className="qr-loading-bg"></div>} 
            <div className={error.errorFrame}></div>
          </div>
          <div className="row justify-content-center">
            <button className="qr-navigate col-6" id="qr-kiosk" onClick={leavePage}>Return to Kiosk</button>
          </div>
          <div className="row text-center qr-or">
            <p style={{fontWeight: 'bold'}} className="qr-or">OR</p>
          </div>
          <div className="row text-center">
            <button className="qr-navigate" id="qr-login" onClick={leavePage}>Login with Username and Password</button>
          </div>
        </div>
      </div>
    </>
  );
}