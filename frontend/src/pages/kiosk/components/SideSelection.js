import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import MenuItemCard from './MenuItemCard'; 
import InfoCard from './InfoCard'; 

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

const SideSelection = ({ onItemSelect }) => {
  const [sides, setSides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null); 

  useEffect(() => {
    const fetchSides = async () => {
      try {
        const response = await api.get('/kiosk/sides'); 
        setSides(response.data);
      } catch (err) {
        setError('Failed to fetch sides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSides();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSideSelect = (side) => {
    onItemSelect(side); 
  };

  const handleInfoClick = (side) => {
    setSelectedInfo(side);
  };

  const handleCloseInfo = () => {
    setSelectedInfo(null);
  };

  return (
    <div className="side-selection container-fluid">
      <h2 className="text-center mb-4" style={{color: "white", fontWeight: "bold"}}>Select a Side</h2>
      <div className="row justify-content-center">
        {sides.map((side, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={formatProductName(side.product_name)} 
              image={side.image}
              description={side.calories + " Calories"}
              price={side.premium_addition }
              onClick={() => handleSideSelect(side)}
              onInfoClick={() => handleInfoClick(side)} 
            />
          </div>
        ))}
      </div>

      {selectedInfo && (
        <InfoCard 
          title={formatProductName(selectedInfo.product_name)} 
          image={selectedInfo.image}
          description={selectedInfo.description}
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

export default SideSelection;
