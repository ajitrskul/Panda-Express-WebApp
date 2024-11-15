import React, { useEffect, useRef } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import { NavBar } from "../kiosk/components/NavBar";
import "../../styles/signin/SignInQR.css";


export default function SignInQR() {
  const videoRef = useRef(null);

  //   let stream = null;
  //   const getVideo = async () => {
  //   try {
  //     stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     if (videoRef.current) {
  //       const video = videoRef.current;
  //       video.srcObject = stream;

  //       // Wait until the video is ready before playing
  //       video.oncanplay = () => {
  //         video.play().catch((error) => {
  //           console.error('Error playing the video:', error);
  //         });
  //       };
  //     }
  //   } catch (err) {
  //     console.error('Error accessing media devices:', err);
  //   }
  // };

  // if (location.path === '/auth/signin/QR') {
  //   getVideo();
  // }



  // useEffect(() => {
  //   getVideo();

  //   // Clean up the stream when the component unmounts or visibility changes
  //   return () => {
  //     if (stream) {
  //       stream.getTracks().forEach(track => track.stop());
  //     }
  //   };
  // });

  const stopCamera = () => {
    if (videoRef.current) {
      // Pause and reset the video element
      // videoRef.current.pause();
      // videoRef.current.currentTime = 0;
  
      // Get the media stream and stop all its tracks
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject).getTracks().forEach(track => {
          track.stop(); // Stops each media track, including video and audio
        });
        videoRef.current.srcObject = null; // Detach the stream from the video element
      }
    }
  
    // Check if any streams are still active and remove them if necessary
    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then(stream => {
    //     stream.getTracks().forEach(track => track.stop());
    //   })
    //   .catch(error => {
    //     console.warn("Error stopping additional media streams:", error);
    //   });
  };



  useEffect(() => {
    let stream;
    const getVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          //const video = videoRef.current;
          videoRef.current.srcObject = stream;
          // Wait until the video is ready before playing
          videoRef.current.oncanplay = () => {
            videoRef.current.play().catch((error) => {
              console.error('Error playing the video:', error);
            });
          };
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };
    getVideo();

    // const stopCamera = () => {
    //   if (videoRef.current) {
    //     videoRef.current.pause();
    //     videoRef.current.currentTime = 0;
  
    //     //stream = videoRef.current.srcObject;
    //     if (videoRef.current.srcObject) {
    //       videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop the camera
    //       videoRef.current.srcObject = null; // Detach the stream
    //     }
    //   }
    // };
    return () => {
      // if (videoRef.current.srcObject) {
      // // Pause and reset the video element
      // // videoRef.current.pause();
      // // videoRef.current.currentTime = 0;
  
      // // Get the media stream and stop all its tracks
      //   if (videoRef.current.srcObject) {
      //     (videoRef.current.srcObject).getTracks().forEach(track => {
      //       track.stop(); // Stops each media track, including video and audio
      //     });
      //     videoRef.current.srcObject = null; // Detach the stream from the video element
      //   }
      // }
      //stopCamera();
    };
  }, [])

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
                  <button onClick={stopCamera}>STOP CAMERA</button>
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