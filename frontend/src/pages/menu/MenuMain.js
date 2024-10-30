import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL

function MenuMain() {
  const [menuData, setMenuData] = useState(null); // Step 1: State to hold data

  // how to fetch api
  const fetchAPI = async () => {
    // Step 2: Fetch data when component loads
    const response = await api.get("/api/menu"); 
    setMenuData(response.data); 
  };

  // fetch data on component load
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="container-fluid">
      <h1>Menu Board</h1>
      {menuData ? (
        <p>{menuData.message}</p> // Display the "message" from the API response
      ) : (
        <p>Loading...</p> // Show loading text while data is being fetched
      )}
    </div>
  );
}

export default MenuMain;
