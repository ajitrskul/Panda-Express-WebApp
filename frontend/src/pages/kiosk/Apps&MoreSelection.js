// AppsAndMoreSelection.js
import React, { useState, useEffect, useContext } from 'react';
import '../../styles/kiosk.css';
import MenuItemCard from './components/MenuItemCard'; 
import InfoCard from './components/InfoCard'; 
import api from '../../services/api';
import { CartContext } from './components/CartContext'; // Import CartContext
import { NavBar } from "./components/NavBar";

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

const AppsAndMoreSelection = () => {
  const [appetizers, setAppetizers] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const { cartItems, setCartItems } = useContext(CartContext); // Access cart context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appetizerResponse, dessertResponse] = await Promise.all([
          api.get('/kiosk/appetizers'),
          api.get('/kiosk/desserts')
        ]);
        setAppetizers(appetizerResponse.data);
        setDesserts(dessertResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleItemSelect = (item) => {
    console.log('Selected item:', item);
  
    // Manage quantities in the cart
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.product_name === item.product_name
    );
  
    if (existingItemIndex !== -1) {
      // If item exists, update quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // If item doesn't exist, add to cart with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };
  
  const handleInfoClick = (item) => {
    setSelectedInfo(item);
  };

  const handleCloseInfo = () => {
    setSelectedInfo(null);
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      <NavBar></NavBar>
      {/* Appetizers Section */}
      <div className="row pt-4 px-3 justify-content-center">
        <h2 className="text-center mb-4" style={{ color: "white", fontWeight: "bold" }}>Appetizers</h2>
        {appetizers.map((appetizer, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={formatProductName(appetizer.product_name)} 
              image={appetizer.image}
              description={appetizer.calories + " Calories"}
              price={appetizer.premium_addition }
              isPremium={appetizer.is_premium } 
              isSeasonal={appetizer.is_seasonal }
              isAvailable={appetizer.is_available}
              onClick={() => handleItemSelect(appetizer)}
              onInfoClick={() => handleInfoClick(appetizer)}
            />
          </div>
        ))}
      </div>

      {/* Desserts Section */}
      <div className="row pt-4 px-3 justify-content-center">
        <h2 className="text-center mb-4" style={{ color: "white", fontWeight: "bold" }}>Desserts</h2>
        {desserts.map((dessert, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={formatProductName(dessert.product_name)} 
              image={dessert.image}
              price={dessert.premium_addition }
              isPremium={dessert.is_premium } 
              isSeasonal={dessert.is_seasonal }
              isAvailable={dessert.is_available}
              description={dessert.calories + " Calories"}
              onClick={() => handleItemSelect(dessert)}
              onInfoClick={() => handleInfoClick(dessert)}
            />
          </div>
        ))}
      </div>

      {selectedInfo && (
        <InfoCard 
          title={formatProductName(selectedInfo.product_name)} 
          image={selectedInfo.image}
          description={selectedInfo.product_description}
          allergens={selectedInfo.allergens || 'None'} 
          servingSize={selectedInfo.serving_size}
          calories={selectedInfo.calories}
          saturatedFat={selectedInfo.saturated_fat}
          carbohydrate={selectedInfo.carbohydrate}
          protein={selectedInfo.protein}
          onClose={handleCloseInfo} 
        />
      )}
    </div>
  );
};

export default AppsAndMoreSelection;
