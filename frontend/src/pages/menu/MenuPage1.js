import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL
import '../../styles/menu.css';

//components
import MenuBoardHowTo from "./components/MenuBoardHowTo";
import MenuBoardSide from "./components/MenuBoardSide";

// images
import BowlImage from '../../assets/bowl.png';

function MenuMain() {
  // const [menuData, setMenuData] = useState([]); // Step 1: State to hold data
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
    return formattedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container-fluid" /*style={{ width: "1400px"}}*/>
      <div className="row">
        <div className="col-5">
          <div className="row row-style-1">
            <h1>Pick Your Meal</h1>
          </div>
          <div className="row">
            {/* <h1>Bowl</h1> */}
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
            <div className="col">
              <MenuBoardSide name={"Super Greens"} image={<img src ={BowlImage}/>} calories={"130 cal"}/>
            </div>
            <div className="col">
              <MenuBoardSide name={"Chow Mein"} image={<img src ={BowlImage}/>} calories={"600 cal"}/>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <MenuBoardSide name={"Fried Rice"} image={<img src ={BowlImage}/>} calories={"620 cal"}/>
            </div>
            <div className="col">
              <MenuBoardSide name={"White Steamed Rice"} image={<img src ={BowlImage}/>} calories={"520 cal"}/>
            </div>
          </div>

          <div className="row row-style-1">
            <h1>A La Carte Sizes</h1>
          </div>
          <div className="row">
            <div className="col-5">
              <img className="a-la-carte-image" src ={BowlImage}/>
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
                  <td> $5.20 </td>
                  <td> $6.70 </td>
                  <td> $4.40 </td>
                </tr>
                <tr>
                  <th scope="row"> Med </th>
                  <td> $8.50 </td>
                  <td> $11.50 </td>
                  <td>  </td>
                </tr>
                <tr>
                  <th scope="row"> Lg </th>
                  <td> $11.20 </td>
                  <td> $15.70 </td>
                  <td> $5.40 </td>
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
