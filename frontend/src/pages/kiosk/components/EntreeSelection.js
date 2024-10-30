import React from 'react';
import MenuItemCard from './MenuItemCard';

import OrangeChicken from '../../../assets/orange-chicken.png';
import BroccoliBeef from '../../../assets/broccoli-beef.png';
import SuperGreens from '../../../assets/super-greens.png';
import BeijingBeef from '../../../assets/beijing-beef.png';
import GrilledTeriyakiChicken from '../../../assets/grilled-teriyaki-chicken.png';
import HoneyWalnutShrimp from '../../../assets/honey-walnut-shrimp.png';
import KungPaoChicken from '../../../assets/kung-pao-chicken.png';

const EntreeSelection = () => {
  const entrees = [
    { name: "Orange Chicken", image: OrangeChicken, description: "510 Calories" },
    { name: "Broccoli Beef", image: BroccoliBeef, description: "150 Calories" },
    { name: "Super Greens", image: SuperGreens, description: "130 Calories" },
    { name: "Beijing Beef", image: BeijingBeef, description: "480 Calories" },
    { name: "Grilled Teriyaki Chicken", image: GrilledTeriyakiChicken, description: "275 Calories" },
    { name: "Honey Walnut Shrimp", image: HoneyWalnutShrimp, description: "430 Calories" },
    { name: "Kung Pao Chicken", image: KungPaoChicken, description: "320 Calories" }
  ];

  const handleEntreeSelect = (entreeName) => {
    alert(`You selected ${entreeName}`);
  };

  return (
    <div className="entree-selection container-fluid">
      <h2 className="text-center mb-4">Select an Entree</h2>
      <div className="row justify-content-center">
        {entrees.map((entree, index) => (
          <div className="col-sm-6 col-md-3 col-lg-2 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={entree.name} 
              image={entree.image} 
              description={entree.description}
              onClick={() => handleEntreeSelect(entree.name)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntreeSelection;
