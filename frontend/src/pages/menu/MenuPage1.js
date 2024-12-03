import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL
import '../../styles/menu.css';

//components
import MenuBoardHowTo from "./components/MenuBoardHowTo";
import MenuBoardSide from "./components/MenuBoardSide";

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

function MenuMain1() {
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
    <div className="container-fluid fullscreen-menu">
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
                  image={<img src ={item.image} alt="Menu Board Item Image"/>} 
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
          <div className="row">

          {(sides.slice(0,4)).map((side) => (
              <div className="col-6">
                <MenuBoardSide
                name={formatProductName(side.product_name)}
                image={<img src ={side.image} alt="Side Item Image"/>} 
                calories={side.calories + " cal"} 
                />
              </div>
            ))}
          </div>

          <div className="row row-style-1">
            <h1>A La Carte Sizes</h1>
          </div>
          <div className="row">
            <div className="col-5">
              <img className="a-la-carte-image" src ={aLaCarte.at(0).image} alt="A La Carte Item Image"/>
            </div>
            <table className="col table a-la-carte-table">
              <thead>
                <tr>
                  <th scope="col">  </th>
                  <th scope="col"> <h3> Entrees </h3> </th>
                  <th scope="col"> <h3> Premium </h3> </th>
                  <th scope="col"> <h3> Sides </h3> </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row"> <h3> Sm </h3> </th>
                  <td> <h4> {"$" + aLaCarte.at(2).menu_item_base_price} </h4> </td>
                  <td> <h4> {"$" + (parseFloat(aLaCarte.at(2).menu_item_base_price) + parseFloat(1.5*aLaCarte.at(2).premium_multiplier)).toFixed(2)} </h4> </td>
                  <td> <h4> {"$" + aLaCarte.at(0).menu_item_base_price} </h4> </td>
                </tr>
                <tr>
                  <th scope="row"> <h3> Med </h3> </th>
                  <td> <h4> {"$" + aLaCarte.at(3).menu_item_base_price} </h4> </td>
                  <td> <h4> {"$" + (parseFloat(aLaCarte.at(3).menu_item_base_price) + parseFloat(1.5*aLaCarte.at(3).premium_multiplier)).toFixed(2)} </h4> </td>
                  <td>  </td>
                </tr>
                <tr>
                  <th scope="row"> <h3> Lg </h3> </th>
                  <td> <h4> {"$" + aLaCarte.at(4).menu_item_base_price} </h4> </td>
                  <td> <h4> {"$" + (parseFloat(aLaCarte.at(4).menu_item_base_price) + parseFloat(1.5*aLaCarte.at(4).premium_multiplier)).toFixed(2)} </h4> </td>
                  <td> <h4> {"$" + aLaCarte.at(1).menu_item_base_price} </h4> </td>
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

export default MenuMain1;
