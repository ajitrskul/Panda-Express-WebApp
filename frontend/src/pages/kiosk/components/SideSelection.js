import React from 'react';
import MenuItemCard from './MenuItemCard'; 

const SideSelection = () => {
  // Define the available sides
  const sides = [
    { name: "Fried Rice", image: "/path/to/fried-rice.jpg", description: "A classic side" },
    { name: "Chow Mein", image: "/path/to/chow-mein.jpg", description: "Stir-fried noodles" },
    { name: "White Rice", image: "/path/to/white-rice.jpg", description: "Steamed white rice" },
    { name: "Brown Rice", image: "/path/to/brown-rice.jpg", description: "Healthy brown rice" },
    { name: "Super Greens", image: "/path/to/super-greens.jpg", description: "Mixed vegetables" }
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
