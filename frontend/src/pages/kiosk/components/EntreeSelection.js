import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import MenuItemCard from './MenuItemCard';
import InfoCard from './InfoCard'; 

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

const EntreeSelection = ({ onItemSelect }) => {
  const [entrees, setEntrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const fetchEntrees = async () => {
      try {
        const response = await api.get('/kiosk/entrees'); 
        setEntrees(response.data);
      } catch (err) {
        setError('Failed to fetch entrees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntrees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleInfoClick = (entree) => {
    setSelectedInfo(entree); 
  };
  
  const handleCloseInfo = () => {
    setSelectedInfo(null);
  };

  const handleEntreeSelect = (entree) => {
    onItemSelect(entree, 'entree'); 
  };

  return (
    <div className="entree-selection container-fluid">
      <h2 className="text-center mb-4" style={{color: "white", fontWeight: "bold"}}>Select an Entree</h2>
      <div className="row justify-content-center">
        {entrees.map((entree, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={formatProductName(entree.product_name)} 
              image={entree.image}
              description={entree.calories + " Calories"}
              isPremium={entree.is_premium } 
              isSeasonal={entree.is_seasonal }
              isAvailable={entree.is_available}
              price={entree.premium_addition }
              onInfoClick={() => handleInfoClick(entree)}
              onClick={() => handleEntreeSelect(entree)} 
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

export default EntreeSelection;
