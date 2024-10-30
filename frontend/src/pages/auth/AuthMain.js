import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function AuthMain() {
  const [authData, setAuthData] = useState(null); // State to hold data

  // Fetch data from /auth
  const fetchAPI = async () => {
    try {
      const response = await api.get("/api/auth"); 
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
    <div className="container-fluid">
      <h1>Auth</h1>
      {authData ? (
        <p>{authData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default AuthMain;
