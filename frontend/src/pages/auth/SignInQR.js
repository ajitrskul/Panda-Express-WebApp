import React, { useEffect, useRef } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import { NavBar } from "../kiosk/components/NavBar";
import "../../styles/signin/SignInQR.css";


export default function SignInQR() {
  const videoRef = useRef(null);
  let stream = null;

  const getVideo = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        // Wait until the video is ready before playing
        video.oncanplay = () => {
          video.play().catch((error) => {
            console.error('Error playing the video:', error);
          });
        };
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  useEffect(() => {
    getVideo();

    // Clean up the stream when the component unmounts or visibility changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });

  const handleVisibilityChange = () => {
    if (document.hidden && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.srcObject = null; // Detach the stream
    } else if (!document.hidden) {
      // Reinitialize the video when the page is visible again
      getVideo();
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  return (
    <>
      <NavBar />
      <Routes>
        <Route
        path="/"
        element={
          <>
            <div className="qr-bg"></div>
            <div className="qr-container">
              <div className="fluid-container qr-video-container">
                <h1 className="row text-center">
                  <p className="col-12 qr-title">Login with QR-Code</p>
                </h1>
                <div className="row justify-content-center">
                  <video ref={videoRef} className="col-12 qr-video" autoPlay playsInline />
                </div>
                <div className="qr-return text-center">
                  <p className="qr-margin">Return to <Link to="/kiosk">Kiosk</Link></p>
                  <p style={{fontWeight: 'bold'}}>OR</p>
                  <p>Login with Username and Password <Link to="/auth/signin">Here.</Link></p>
                </div>
              </div>
            </div>
          </>
        }>
        </Route>
      </Routes>
    </>
  );
}