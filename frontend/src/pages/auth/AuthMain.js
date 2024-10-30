import { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { SignUpPage } from "./SignUpPage.js";
import api from '../../services/api'; // Axios instance with base URL

export default function AuthMain() {
  const [authData, setAuthData] = useState(null); // State to hold data

  // Fetch data from /auth
  const fetchAPI = async () => {
    try {
      const response = await api.get("/auth"); 
      setAuthData(response.data); 
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return ( 
    <Routes>
      <Route 
        path="/"
        element = {
        <>
          <div className="container-fluid">
            <h1>Auth</h1>
            {authData ? (
              <p>{authData.message}</p> // Display the "message" from the API response
            ) : (
              <p>Loading...</p> // Show loading text while data is being fetched
            )}
            <nav>
              <Link to="SignUp">No Account? Sign Up.</Link>
            </nav>
            <nav>
              <Link to="/">Go Home!</Link>
            </nav>
          </div>
        </>
        }
      />
      <Route path="SignUp" element={<SignUpPage />} />
    </Routes>
  );
}


