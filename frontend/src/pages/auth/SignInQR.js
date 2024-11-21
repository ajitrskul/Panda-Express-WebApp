import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "../kiosk/components/NavBar";
import { QrReader } from 'react-qr-reader';
import api from '../../services/api';
import "../../styles/signin/SignInQR.css";
import { AccountContext } from './components/AccountContext';


export default function SignInQR() {
  const { customerSignIn } = useContext(AccountContext);
  
  const [QRStatus, setQRStatus] = useState({
    isLoading: false,
    loadingVisual: false,
    videoClass: "col-12 qr-video",
    errorMsg: "",
    QRFrame: "qr-frame"
  });

  const navigate = useNavigate();

  const leavePage = ((event) => {
    switch (event.target.id) {
      case 'qr-kiosk':
        navigate('/kiosk');
        window.location.reload();
        break;
      case 'qr-login':
        navigate('/auth/signin');
        window.location.reload();
        break
      default:
        break;
    }
  });

  const testSignIn = async (customerLogin) => {
    const signinSuccess = await api.post("/auth/signin/qr", customerLogin);
    if (signinSuccess.data) {
      customerSignIn(signinSuccess.data);
      navigate("/auth/signin/success");
      window.location.reload()
      return;
    }
    else {
      setQRStatus({
        isLoading: true,
        loadingVisual: false,
        videoClass: "col-12 qr-video qr-video-error",
        errorMsg: 'Invalid QR Code',
        QRFrame: "qr-frame qr-frame-error"});

      setTimeout(() => { //delay before resetting to no error frame
        setQRStatus({
          isLoading: false,
          loadingVisual: false,
          videoClass: "col-12 qr-video",
          errorMsg: "",
          QRFrame: 'qr-frame'
        });
      },2000)
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
              if (QRStatus.isLoading || !result) { //return immediately if function already running or there is no qr code
                return;
              }
              else { //there is a qr code & function not running
                setQRStatus({ //set loading & visuals
                  isLoading: true,
                  loadingVisual: true,
                  videoClass: "col-12 qr-video qr-video-loading",
                  errorMsg: "",
                  QRFrame: 'qr-frame qr-frame-loading',
                })
                let customerLogin  = {}
                try { //attempt to parse QR code into JSON
                  const scannedInfo = JSON.parse(result.text);
                  
                  //check that all fields are present before setting customerLogin
                  if (
                    scannedInfo.email != null &&
                    scannedInfo.password != null
                  ) {
                    customerLogin = {
                      email: scannedInfo.email,
                      password: scannedInfo.password,
                    };

                    try { //all fields were present -> authenticate user
                      testSignIn(customerLogin);
                    } catch(err) { //error authenticating user
                      navigate("/auth/signin/error");
                      window.location.reload();
                    } 
                  }
                  else { //if not all fields are present end function immediately
                    setQRStatus({
                      isLoading: true,
                      loadingVisual: false,
                      videoClass: "col-12 qr-video qr-video-error",
                      errorMsg: 'Invalid QR Code',
                      QRFrame: 'qr-frame qr-frame-error'
                    });

                    setTimeout(() => { //delay before resetting to no error frame
                      setQRStatus({
                        isLoading: false,
                        loadingVisual: false,
                        videoClass: "col-12 qr-video",
                        errorMsg: "",
                        QRFrame: 'qr-frame'
                      });
                    },2000)
                    return;
                  }
                } catch(err) { //error parsing Login (invalid QR code most likely)
                  setQRStatus({
                    isLoading: true,
                    loadingVisual: false,
                    videoClass: "col-12 qr-video qr-video-error",
                    errorMsg: 'Invalid QR Code',
                    QRFrame: 'qr-frame qr-frame-error'});

                  setTimeout(() => { //delay before resetting to no error frame
                    setQRStatus({
                      isLoading: false,
                      loadingVisual: false,
                      videoClass: "col-12 qr-video",
                      errorMsg: "",
                      QRFrame: 'qr-frame'
                    });
                  },2000)
                  return;
                }

                setQRStatus({ //function done running
                  isLoading: false,
                  loadingVisual: false,
                  videoClass: "col-12 qr-video",
                  errorMsg: "",
                  QRFrame: 'qr-frame'
                });
              }
              }}
              className={QRStatus.videoClass}
            />
            <p className="qr-error-msg text-center">{QRStatus.errorMsg}</p>
            {QRStatus.loadingVisual && <div className="spinner-border qr-loading" role="status"></div>}
            {QRStatus.loadingVisual && <div className="qr-loading-bg"></div>} 
            <div className={QRStatus.QRFrame}></div>
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