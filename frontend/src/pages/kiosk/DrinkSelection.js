import React, { useState, useEffect } from 'react';
import '../../styles/kiosk.css';
import MenuItemCard from './components/MenuItemCard'; 
import InfoCard from './components/InfoCard'; 
import api from '../../services/api';
import CheckoutButton from './components/CheckoutButton'; 

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

const DrinkSelection = () => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null); 

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await api.get('/kiosk/drinks'); 
        setDrinks(response.data);
      } catch (err) {
        setError('Failed to fetch drinks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDrinkSelect = (drink) => {
    console.log('Selected drink:', drink);
  };

  const handleInfoClick = (drink) => {
    setSelectedInfo(drink);
  };

  const handleCloseInfo = () => {
    setSelectedInfo(null);
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      <div className="row pt-4 px-3 justify-content-center">
        {drinks.map((drink, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={formatProductName(drink.product_name)} 
              image={drink.image}
              price={drink.premium_addition }
              description={drink.calories + " Calories"}
              onClick={() => handleDrinkSelect(drink)}
              onInfoClick={() => handleInfoClick(drink)}
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

      <CheckoutButton />
    </div>
  );
};

export default DrinkSelection;
