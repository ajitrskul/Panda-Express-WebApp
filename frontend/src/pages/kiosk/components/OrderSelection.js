import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../styles/kiosk.css';
import SelectionGrid from './SelectionGrid';
import SideSelection from './SideSelection';
import EntreeSelection from './EntreeSelection';
import CheckoutButton from "./CheckoutButton";

const OrderSelection = () => {
  const location = useLocation();
  const { numSides = 1, numEntrees = 1 } = location.state || {}; // Default to 1 side and 1 entree if no state provided

  const [selectedSection, setSelectedSection] = useState(null);

  const handleSelection = (type) => {
    setSelectedSection(type);
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      <div className="container-fluid align-items-center">
        <SelectionGrid numSides={numSides} numEntrees={numEntrees} onSelect={handleSelection} />
      </div>
      
      <div className="container-fluid mt-4">
        {selectedSection === "side" && <SideSelection />}
        {selectedSection === "entree" && <EntreeSelection />}
      </div>

      <CheckoutButton />
    </div>
  );
};

export default OrderSelection;
