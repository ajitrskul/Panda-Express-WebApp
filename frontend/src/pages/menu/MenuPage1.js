import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL
import '../../styles/menu.css';

//components
import MenuBoardHowTo from "./components/MenuBoardHowTo";
import MenuBoardSide from "./components/MenuBoardSide";

// images
import BowlImage from '../../assets/bowl.png';

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

function MenuMain() {
  // const [menuData, setMenuData] = useState([]); // Step 1: State to hold data
  const [menuItems, setMenuItems] = useState([]);
  const [sides, setSides] = useState([]);
  const [aLaCarte, setALaCarte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {

        const [menuResponse, sideResponse, aLaCarteResponse] = await Promise.all([
          api.get('/menu/menu'),
          api.get('/menu/sides'),
          api.get('/menu/alacarte')
        ]);
        setMenuItems(menuResponse.data);
        setSides(sideResponse.data);
        setALaCarte(aLaCarteResponse.data);
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

    formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
    return formattedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
        <div className="col-5">
          <div className="row row-style-1">
            <h1>Pick Your Meal</h1>
          </div>
          <div className="row">
            
            {menuItems.map((item) => (
              
                <div>
                  <MenuBoardHowTo
                  name={formatItemName(item.item_name)}
                  image={<img src ={item.image} />} 
                  calories={item.calories} 
                  description={item.menu_item_description || 'No description available'} 
                  price={"$"+item.menu_item_base_price}

                  />
                </div>
              ))}
          </div>
        </div>
        <div className="col-7">
          <div className="row row-style-1">
            <h1>Sides</h1>
          </div>
          {/* <div className="row">
            <MenuBoardSide name={"Super Greens"} image={<img src ={BowlImage} style={{ width: '110%'}}/>} calories={"130 cal"}/>
          </div> */}
          <div className="row">

          {sides.map((side) => (
            
              
              <div className="col-6">
                <MenuBoardSide
                name={formatProductName(side.product_name)}
                image={<img src ={side.image} />} 
                calories={side.calories + " cal"} 

                />
              </div>
            ))}
            {/* <div className="col">
              <MenuBoardSide name={"Super Greens"} image={<img src ={BowlImage}/>} calories={"130 cal"}/>
            </div>
            <div className="col">
              <MenuBoardSide name={"Chow Mein"} image={<img src ={BowlImage}/>} calories={"600 cal"}/>
            </div> */}
          </div>

          <div className="row">
            {/* <div className="col">
              <MenuBoardSide name={"Fried Rice"} image={<img src ={BowlImage}/>} calories={"620 cal"}/>
            </div>
            <div className="col">
              <MenuBoardSide name={"White Steamed Rice"} image={<img src ={BowlImage}/>} calories={"520 cal"}/>
            </div> */}
          </div>

          <div className="row row-style-1">
            <h1>A La Carte Sizes</h1>
          </div>
          <div className="row">
            <div className="col-5">
              <img className="a-la-carte-image" src ={aLaCarte.at(0).image}/>
            </div>
            <table className="col table a-la-carte-table">
              <thead>
                <tr>
                  <th scope="col">  </th>
                  <th scope="col"> Entrees </th>
                  <th scope="col"> Premium </th>
                  <th scope="col"> Sides </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"> Sm </th>
                  <td> {"$" + aLaCarte.at(2).menu_item_base_price} </td>
                  <td> {"$" + (aLaCarte.at(2).menu_item_base_price + 1.5*aLaCarte.at(2).premium_multiplier)} </td>
                  <td> {"$" + aLaCarte.at(0).menu_item_base_price} </td>
                </tr>
                <tr>
                  <th scope="row"> Med </th>
                  <td> {"$" + aLaCarte.at(3).menu_item_base_price} </td>
                  <td> {"$" + (aLaCarte.at(3).menu_item_base_price + 1.5*aLaCarte.at(3).premium_multiplier)} </td>
                  <td>  </td>
                </tr>
                <tr>
                  <th scope="row"> Lg </th>
                  <td> {"$" + aLaCarte.at(4).menu_item_base_price} </td>
                  <td> {"$" + (aLaCarte.at(4).menu_item_base_price + 1.5*aLaCarte.at(4).premium_multiplier)} </td>
                  <td> {"$" + aLaCarte.at(1).menu_item_base_price} </td>
                </tr>
              </tbody>
            </table>
            <div className="col-3">

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MenuMain;
