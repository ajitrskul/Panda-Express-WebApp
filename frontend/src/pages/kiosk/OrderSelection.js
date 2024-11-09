// OrderSelection.js
import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/kiosk.css';
import SelectionGrid from './components/SelectionGrid';
import SideSelection from './components/SideSelection';
import EntreeSelection from './components/EntreeSelection';

// CartContext use
import { CartContext } from './components/CartContext';

const OrderSelection = () => {
  const location = useLocation();
  const { numSides, numEntrees } = location.state;

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSideImage, setSelectedSideImage] = useState(null);
  const [selectedEntreeImage, setSelectedEntreeImage] = useState(null);

  const { cartItems, setCartItems } = useContext(CartContext); // Access cart context

  const handleSelection = (type) => {
    setSelectedSection(type);
  };

  const handleItemSelect = (item, type) => {
    if (type === 'side') {
      setSelectedSideImage(item.image); 
    } else if (type === 'entree') {
      setSelectedEntreeImage(item.image); 
    }

    // Example: Add selected item to cart
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      <div className="container-fluid align-items-center">
        <SelectionGrid 
          numSides={numSides} 
          numEntrees={numEntrees} 
          onSelect={handleSelection} 
          selectedSideImage={selectedSideImage}
          selectedEntreeImage={selectedEntreeImage}
        />
      </div>
      
      <div className="container-fluid mt-4">
        {selectedSection === "side" && (
          <SideSelection onItemSelect={(item) => handleItemSelect(item, 'side')} />
        )}
        {selectedSection === "entree" && (
          <EntreeSelection onItemSelect={(item) => handleItemSelect(item, 'entree')} />
        )}
      </div>
    </div>
  );
};

export default OrderSelection;
