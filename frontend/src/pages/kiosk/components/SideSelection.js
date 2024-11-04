import React from 'react';
import MenuItemCard from './MenuItemCard'; 

import ChowMein from '../../../assets/chow-mein.png';
import FriedRice from '../../../assets/fried-rice.png';
import WhiteRice from '../../../assets/white-rice.png';
import SuperGreens from '../../../assets/super-greens.png';

const SideSelection = () => {
  const sides = [
    { name: "Chow Mein", image: ChowMein, description: "600 Calories" },
    { name: "Fried Rice", image: FriedRice, description: "620 Calories" },
    { name: "White Rice", image: WhiteRice, description: "520 Calories" },
    { name: "Super Greens", image: SuperGreens, description: "130 Calories" }
  ];

  const handleSideSelect = (sideName) => {
    alert(`You selected ${sideName}`);
  };

  return (
    <div className="side-selection container-fluid">
      <h2 className="text-center mb-4">Select a Side</h2>
      <div className="row justify-content-center">
        {sides.map((side, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={side.name} 
              image={side.image} 
              description={side.description}
              onClick={() => handleSideSelect(side.name)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideSelection;
