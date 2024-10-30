import React from "react";
import '../../styles/kiosk.css';
import CheckoutButton from './components/CheckoutButton';
import MenuItemCard from './components/MenuItemCard';
import BowlImage from '../../assets/bowl.png';
import PlateImage from '../../assets/plate.png';
import BiggerPlateImage from '../../assets/bigger-plate.png';
import ALaCarteImage from '../../assets/a-la-carte.png';
import AppetizerImage from '../../assets/appetizer.png';
import DrinksImage from '../../assets/drinks.png';
import FamilyMealImage from '../../assets/family-meal.png';

function KioskMain() {
  const menuItems = [
    { name: "Bowl", image: BowlImage },
    { name: "Plate", image: PlateImage },
    { name: "Bigger Plate", image: BiggerPlateImage },
    { name: "A La Carte", image: ALaCarteImage },
    { name: "Appetizer", image: AppetizerImage },
    { name: "Drinks", image: DrinksImage },
    { name: "Family Meal", image: FamilyMealImage }
  ];

  return (
    <div className="kiosk-landing-order container-fluid">
      {/* Menu Items Grid */}
      <div className="row px-3">
        {menuItems.map((item, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 col-xxl-2 d-flex justify-content-center mb-4" key={index}>
            <MenuItemCard name={item.name} image={item.image} />
          </div>
        ))}
      </div>

      {/* CheckoutButton component */}
      <CheckoutButton price="$XXX.XX" />
    </div>
  );
}

export default KioskMain;
