import React, { useState, useEffect } from 'react';
import MenuItemCard from './MenuItemCard';
import api from '../../../services/api';

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
    onItemSelect(entree); 
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
              onInfoClick={() => handleInfoClick(entree)}
              onClick={() => handleEntreeSelect(entree)} 
            />
          </div>
        ))}
      </div>

      {selectedInfo && (
        <div className="info-popup" style={popupStyles}>
          <div className="popup-content" style={popupContentStyles}>
            <h3>{formatProductName(selectedInfo.product_name)}</h3>
            <p>{selectedInfo.calories} Calories</p>
            <p>Additional information can go here...</p>
            <button onClick={handleCloseInfo} style={closeButtonStyles}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const popupStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '400px',
  textAlign: 'center',
};

const closeButtonStyles = {
  marginTop: '10px',
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default EntreeSelection;