import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function PosMain() {
  const [posData, setPosData] = useState(null); // State to hold data

  // Fetch data from /pos
  const fetchAPI = async () => {
    try {
      const response = await api.get("/api/pos"); 
      setPosData(response.data); 
    } catch (error) {
      console.error("Error fetching POS data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="container-fluid">
      <h1>Cashier POS</h1>
      {posData ? (
        <p>{posData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default PosMain;
