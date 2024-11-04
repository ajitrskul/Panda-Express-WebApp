import React from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/kiosk.css';

// components 
import CheckoutButton from './components/CheckoutButton';
import MenuItemCard from './components/MenuItemCard';

// images
import BowlImage from '../../assets/bowl.png';
import PlateImage from '../../assets/plate.png';
import BiggerPlateImage from '../../assets/bigger-plate.png';
import ALaCarteImage from '../../assets/a-la-carte.png';
import AppetizerImage from '../../assets/appetizer.png';
import DrinksImage from '../../assets/drinks.png';
import FamilyMealImage from '../../assets/family-meal.png';

function KioskMain() {
  const menuItems = [
    { name: "Bowl", image: BowlImage, description: "1 Side & 1 Entree", numSides: 1, numEntrees: 1 },
    { name: "Plate", image: PlateImage, description: "1 Side & 2 Entree", numSides: 1, numEntrees: 2 },
    { name: "Bigger Plate", image: BiggerPlateImage, description: "1 Side & 3 Entree", numSides: 1, numEntrees: 3 },
    { name: "A La Carte", image: ALaCarteImage, description: "Individual Entrees & Sides", numSides: 1, numEntrees: 1 },
    { name: "Appetizer", image: AppetizerImage, description: "Something Extra with Your Meal", numSides: 0, numEntrees: 0 },
    { name: "Drinks", image: DrinksImage, description: "Add a Refreshing Beverage", numSides: 0, numEntrees: 0 },
    { name: "Family Meal", image: FamilyMealImage, description: "2 Large Sides & 3 Large Entrees", numSides: 2, numEntrees: 3 }
  ];
  
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    const formattedName = item.name.toLowerCase().replace(/\s+/g, '-');

    if (item.name === "Drinks") {
      navigate(`/kiosk/drinks`);
    } 
    else if (item.name === "Appetizer") {
      navigate(`/kiosk/appetizer`);
    } 
    else {
      navigate(`/kiosk/order/${formattedName}`, {
        state: { numSides: item.numSides, numEntrees: item.numEntrees }
      });
    }
  };

  return (
    <div className="kiosk-landing-order container-fluid">
      {/* Menu Items Grid */}
      <div className="row pt-4 px-3 justify-content-center">
        {menuItems.map((item, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 col-xxl-2 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard 
              name={item.name} 
              image={item.image} 
              description={item.description} 
              onClick={() => handleItemClick(item)}
            />
          </div>
        ))}
      </div>

      {/* CheckoutButton component */}
      <CheckoutButton price="$XXX.XX" />
    </div>
  );
}

export default KioskMain;
