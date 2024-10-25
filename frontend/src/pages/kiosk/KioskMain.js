import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function KioskMain() {
  const [kioskData, setKioskData] = useState(null); // State to hold data

  // Fetch data from /kiosk
  const fetchAPI = async () => {
    try {
      const response = await api.get("/kiosk"); 
      setKioskData(response.data); 
    } catch (error) {
      console.error("Error fetching kiosk data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <h1>Customer Kiosk</h1>
      {kioskData ? (
        <p>{kioskData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default KioskMain;