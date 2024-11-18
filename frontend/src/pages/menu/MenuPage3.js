import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL
import '../../styles/menu.css';

//components
import MenuBoardHowTo from "./components/MenuBoardHowTo";
import MenuBoardSide from "./components/MenuBoardSide";
import MenuBoardEntree from "./components/MenuBoardEntree";
import MenuBoardAppetizer from "./components/MenuBoardAppetizer";
import MenuBoardDrinks from "./components/MenuBoardDrinks";

// images
import Pepsi from '../../assets/pepsi_logo.png';
import Brisk from '../../assets/brisk.png';
import MtnDew from '../../assets/mtn_dew.png';
import Tropicana from '../../assets/tropicana.png';

import BCkn from '../../assets/burboun_ckn.png';
import ApplePie from '../../assets/apple_pie.png';

import BowlImage from '../../assets/bowl.png';
// import PlateImage from '../../assets/plate.png';
// import BiggerPlateImage from '../../assets/bigger-plate.png';
// import ALaCarteImage from '../../assets/a-la-carte.png';
// import AppetizerImage from '../../assets/appetizer.png';
// import DrinksImage from '../../assets/drinks.png';
// import FamilyMealImage from '../../assets/family-meal.png';

function MenuMain() {
  const [appdess, setAppDess] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {

        const [appResponse, drinkResponse, itemResponse] = await Promise.all([
          api.get('/menu/appdessert'),
          api.get('/menu/drink'),
          api.get('/menu/allitems')
        ]);
        setAppDess(appResponse.data);
        setDrinks(drinkResponse.data);
        setMenuItems(itemResponse.data);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const formatProductName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-fluid" /*style={{ width: "1400px"}}*/>
<div className="row">
  <div className="col-3">
    <div className="row row-style-1">
      <h1>Drinks</h1>
    </div>
    <div className="card my-2 drinks-card">
      <h1>Fountain Drinks</h1>

      <table className="col table drinks-table">
        <thead>
          <tr>
            <th scope="col">  </th>
            <th scope="col">  </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"> Sm </th>
            <td> {"$" + menuItems[17].menu_item_base_price} </td>
          </tr>
          <tr>
            <th scope="row"> Med </th>
            <td> {"$" + menuItems[14].menu_item_base_price} </td>
          </tr>
          <tr>
            <th scope="row"> Lg </th>
            <td> {"$" + menuItems[15].menu_item_base_price} </td>
          </tr>
        </tbody>
      </table>

      <div className="row">
        <div className="col">
          <img className="drink-image" src ={Pepsi}/>
        </div>
        <div className="col">
          <img className="drink-image" src ={MtnDew}/>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <img className="drink-image" src ={Brisk}/>
        </div>
        <div className="col">
          <img className="drink-image" src ={Tropicana}/>
        </div>
      </div>
    </div>
      {drinks.map((drink) => (
        <div className="row">
          <div className="col">
            <MenuBoardDrinks name={formatProductName(drink.product_name)} price={"$" + (menuItems[16].menu_item_base_price + drink.premium_addition)}/>
          </div>
        </div>
        ))}
  </div>
  <div className="col-6">
    <div className="row row-style-1">
      <h1>Appetizers</h1>
    </div>
    <div className="row">
      <div className="col">
        <MenuBoardAppetizer 
        name={formatProductName(appdess.at(0).product_name)}
        smPrice = {"4.5"}
        mdPrice = {"4.5"}
        lgPrice = {"4.5"}
        isPremium = {appdess[0].is_premium}
        isSeasonal = {appdess[0].is_seasonal}
        image={<img src ={appdess[0].image}/>}/>
      </div>
      <div className="col">
        <MenuBoardAppetizer 
        name={formatProductName(appdess.at(1).product_name)}
        smPrice = {"4.5"}
        mdPrice = {"4.5"}
        lgPrice = {"4.5"}
        isPremium = {appdess[1].is_premium}
        isSeasonal = {appdess[1].is_seasonal}
        image={<img src ={appdess[1].image}/>}/>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <MenuBoardAppetizer 
        name={formatProductName(appdess.at(2).product_name)}
        smPrice = {"4.5"}
        mdPrice = {"4.5"}
        lgPrice = {"4.5"}
        isPremium = {appdess[2].is_premium}
        isSeasonal = {appdess[2].is_seasonal}
        image={<img src ={appdess[2].image}/>}/>
      </div>
      <div className="col">
        {appdess[3] ? (
          <div>
            <MenuBoardAppetizer 
            name={formatProductName(appdess.at(3).product_name)}
            smPrice = {"4.5"}
            mdPrice = {"4.5"}
            lgPrice = {"4.5"}
            isPremium = {appdess[3].is_premium}
            isSeasonal = {appdess[3].is_seasonal}
            image={<img src ={appdess[3].image}/>}/>
          </div>) : (
          <div> </div>
        )}
      </div>
    </div>

    <div className="row">
    <div className="col">
        {appdess[4] ? (
          <div>
            <MenuBoardAppetizer 
            name={formatProductName(appdess.at(4).product_name)}
            smPrice = {"4.5"}
            mdPrice = {"4.5"}
            lgPrice = {"4.5"}
            isPremium = {appdess[4].is_premium}
            isSeasonal = {appdess[4].is_seasonal}
            image={<img src ={appdess[4].image}/>}/>
          </div>) : (
          <div> </div>
        )}
      </div>
      <div className="col">
        {appdess[5] ? (
          <div>
            <MenuBoardAppetizer 
            name={formatProductName(appdess.at(5).product_name)}
            smPrice = {"4.5"}
            mdPrice = {"4.5"}
            lgPrice = {"4.5"}
            isPremium = {appdess[5].is_premium}
            isSeasonal = {appdess[5].is_seasonal}
            image={<img src ={appdess[5].image}/>}/>
          </div>) : (
          <div> </div>
        )}
      </div>
    </div>
    

    <div className="row">
      <div className='col card my-2 icon-card'>
        <div className="row">
        <div className="col-1">
          <div className="banner premium-banner banners-container-display">P</div>
        </div>
        <div className="col-7">
          
          <h3 className="text-desc"> Premium </h3>
          <h6> $1.50 upcharge on Entree  |  $4.50 upcharge on Family Meal Entree </h6>
        </div>
        <div className="col-1">
        <div className="banner seasonal-banner banners-container-display">S</div>
        </div>
        <div className="col-3 text-desc">
          
          <h3 className="text-desc"> Seasonal </h3>
        </div>
        </div>
        
      </div>
    </div>
    
    


  </div>
  <div className="col-3">
    <div className="row row-style-1">
      <h1>Seasonal</h1>
    </div>
    
    <div className="row">
      <div className='card my-2 ad-card'>
        <img className="card-img-top" src ={BCkn}/>
      </div>
      <div className='card my-2 ad-card'>
        <img className="card-img-top" src ={ApplePie}/>
      </div>
    </div>
    
  </div>
</div>
</div>
  );
}

export default MenuMain;
