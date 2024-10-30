import { React, useState } from "react";
import '../../styles/kiosk.css';
import SelectionGrid from './components/SelectionGrid';
import SideSelection from './components/SideSelection';
import EntreeSelection from './components/EntreeSelection';
import CheckoutButton from "./components/CheckoutButton";

function PlateMain() {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSelection = (type) => {
    if (type === 'side') {
      setSelectedSection('side');
    } else if (type === 'entree') {
      setSelectedSection('entree');
    }
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      <div className="container-fluid align-items-center">
        <SelectionGrid numSides={1} numEntrees={2} onSelect={handleSelection} />
      </div>
      
      <div className="container-fluid mt-4">
        {selectedSection === "side" && <SideSelection />}
        {selectedSection === "entree" && <EntreeSelection />}
      </div>

      <CheckoutButton price="$XXX.XX" />
    </div>
  );
}

export default PlateMain;
