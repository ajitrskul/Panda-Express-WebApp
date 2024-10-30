import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/kiosk.css';
import SelectionGrid from './components/SelectionGrid';
import SideSelection from './components/SideSelection';

function BowlMain() {
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
      </div>
    </div>
  );
}
  
export default BowlMain;