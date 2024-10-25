import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function ManagerMain() {
  const [managerData, setManagerData] = useState(null); // State to hold data

  // Fetch data from /manager
  const fetchAPI = async () => {
    try {
      const response = await api.get("/manager"); 
      setManagerData(response.data); 
    } catch (error) {
      console.error("Error fetching manager data:", error);
    }
  };

  // Fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <h1>Manager View</h1>
      {managerData ? (
        <p>{managerData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default ManagerMain;
