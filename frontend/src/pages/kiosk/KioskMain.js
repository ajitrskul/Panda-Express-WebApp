// KioskMain.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/kiosk.css';

// Components
import MenuItemCard from './components/MenuItemCard';
import { NavBar } from "./components/NavBar";

// images
/*import BowlImage from '../../assets/bowl.png';
import PlateImage from '../../assets/plate.png';
import BiggerPlateImage from '../../assets/bigger-plate.png';
import ALaCarteImage from '../../assets/a-la-carte.png';
import AppetizerImage from '../../assets/appetizer.png';
import DrinksImage from '../../assets/drinks.png';
import FamilyMealImage from '../../assets/family-meal.png';*/
import api from '../../services/api'; 
import { CartContext } from './components/CartContext'; // Import CartContext

function KioskMain() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access cartItems and setCartItems from the CartContext
  const { cartItems, setCartItems } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/kiosk/menu'); 
        setMenuItems(response.data);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const formatItemName = (name) => {
    let formattedName = name.replace(/Small|Medium|Side/g, '');
    if (formattedName === 'appetizer') {
      return 'Appetizers & More';
    }
    formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
    return formattedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleItemClick = (item) => {
    let formattedName = formatItemName(item.item_name)
      .toLowerCase()
      .replace(/\s+/g, '-');
    console.log(formattedName);
  
    if (formattedName === "drinks") {
      navigate(`/kiosk/order/drink`);
    } 
    else if (formattedName === "appetizers-&-more") {
      navigate(`/kiosk/order/appetizers-&-more`);
    } 
    else {
      navigate(`/kiosk/order/${formattedName}`, {
        state: { 
          numSides: item.max_sides, 
          numEntrees: item.max_entrees,
          itemName: formatItemName(item.item_name) 
        }
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="kiosk-landing-order container-fluid">
       <NavBar></NavBar>
      {/* Menu Items Grid */}
      <div className="row pt-4 px-3 justify-content-center">
        {menuItems.map((item, index) => (
          <div
            className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
            key={index}
          >
            <MenuItemCard
              name={formatItemName(item.item_name)}
              image={item.image}
              description={item.menu_item_description || 'No description available'}
              price={item.menu_item_base_price}
              priceType={'Base Price'}
              onClick={() => handleItemClick(item)}
              showInfoButton={false}
            />
          </div>
        ))}
      </div>
        
      {/* CheckoutButton component */}
      <CheckoutButton />
    </div>
  );
}

export default KioskMain;
