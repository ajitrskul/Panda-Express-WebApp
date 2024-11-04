import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function KitchenMain() {
  const [kitchenData, setKitchenData] = useState(null); // State to hold data

  // Fetch data from /kitchen
  const fetchAPI = async () => {
    try {
      const response = await api.get("/kitchen"); 
      setKitchenData(response.data); 
    } catch (error) {
      console.error("Error fetching kitchen data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="container-fluid">
      <h1>Kitchen View</h1>
      {kitchenData ? (
        <p>{kitchenData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default KitchenMain;
