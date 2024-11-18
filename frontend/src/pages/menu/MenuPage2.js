import { React, useState, useEffect } from "react";
import api from '../../services/api' // Axios instance with base URL
import '../../styles/menu.css';

//components
import MenuBoardHowTo from "./components/MenuBoardHowTo";
import MenuBoardSide from "./components/MenuBoardSide";
import MenuBoardEntree from "./components/MenuBoardEntree";

// images
import BowlImage from '../../assets/bowl.png';
// import PlateImage from '../../assets/plate.png';
// import BiggerPlateImage from '../../assets/bigger-plate.png';
// import ALaCarteImage from '../../assets/a-la-carte.png';
// import AppetizerImage from '../../assets/appetizer.png';
// import DrinksImage from '../../assets/drinks.png';
// import FamilyMealImage from '../../assets/family-meal.png';

function MenuMain() {
  const [entrees, setEntrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntrees = async () => {
      try {
        const response = await api.get('/menu/entrees'); 
        setEntrees(response.data);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrees();
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
    <div className="container-fluid">
      <div className="row">
        <div className="row row-style-1">
          <h1>Entrees</h1>
        </div>
        <div className="row entree-row">
            {/* {entrees.map((item, index) => (
              
              <div className="col-2">
                <MenuBoardEntree
                name={formatProductName(item.product_name)}
                image={<img src ={item.image} />} 
                calories={item.calories} 
                isPremium={item.is_premium} 
                isSeasonal={item.is_seasonal}
                />
              </div>
            ))} */}
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(0).product_name)}
                  image={<img src ={entrees[0].image} />} 
                  calories={entrees[0].calories + " cal"} 
                  isPremium={entrees[0].is_premium} 
                  isSeasonal={entrees[0].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(1).product_name)}
                  image={<img src ={entrees[1].image} />} 
                  calories={entrees[1].calories + " cal"} 
                  isPremium={entrees[1].is_premium} 
                  isSeasonal={entrees[1].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(2).product_name)}
                  image={<img src ={entrees[2].image} />} 
                  calories={entrees[2].calories + " cal"} 
                  isPremium={entrees[2].is_premium} 
                  isSeasonal={entrees[2].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(3).product_name)}
                  image={<img src ={entrees[3].image} />} 
                  calories={entrees[3].calories + " cal"} 
                  isPremium={entrees[3].is_premium} 
                  isSeasonal={entrees[3].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(4).product_name)}
                  image={<img src ={entrees[4].image} />} 
                  calories={entrees[4].calories + " cal"} 
                  isPremium={entrees[4].is_premium} 
                  isSeasonal={entrees[4].is_seasonal}
                  />
          </div>
        </div>
        <div className="row entree-row">
        <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(5).product_name)}
                  image={<img src ={entrees[5].image} />} 
                  calories={entrees[5].calories + " cal"} 
                  isPremium={entrees[5].is_premium} 
                  isSeasonal={entrees[5].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(6).product_name)}
                  image={<img src ={entrees[6].image} />} 
                  calories={entrees[6].calories + " cal"} 
                  isPremium={entrees[6].is_premium} 
                  isSeasonal={entrees[6].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(7).product_name)}
                  image={<img src ={entrees[7].image} />} 
                  calories={entrees[7].calories + " cal"} 
                  isPremium={entrees[7].is_premium} 
                  isSeasonal={entrees[7].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(8).product_name)}
                  image={<img src ={entrees[8].image} />} 
                  calories={entrees[8].calories + " cal"} 
                  isPremium={entrees[8].is_premium} 
                  isSeasonal={entrees[8].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(9).product_name)}
                  image={<img src ={entrees[9].image} />} 
                  calories={entrees[9].calories + " cal"} 
                  isPremium={entrees[9].is_premium} 
                  isSeasonal={entrees[9].is_seasonal}
                  />
          </div>
        </div>
        <div className="row entree-row">
        <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(10).product_name)}
                  image={<img src ={entrees[10].image} />} 
                  calories={entrees[10].calories + " cal"} 
                  isPremium={entrees[10].is_premium} 
                  isSeasonal={entrees[10].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(11).product_name)}
                  image={<img src ={entrees[11].image} />} 
                  calories={entrees[11].calories + " cal"} 
                  isPremium={entrees[11].is_premium} 
                  isSeasonal={entrees[11].is_seasonal}
                  />
          </div>
          <div className="col">
            <MenuBoardEntree
                  name={formatProductName(entrees.at(12).product_name)}
                  image={<img src ={entrees[12].image} />} 
                  calories={entrees[12].calories + " cal"} 
                  isPremium={entrees[12].is_premium} 
                  isSeasonal={entrees[12].is_seasonal}
                  />
          </div>
          <div className="col">
            {MenuBoardEntree[13] ? (
              <div>
            <MenuBoardEntree
                  name={formatProductName(entrees.at(13).product_name)}
                  image={<img src ={entrees[13].image} />} 
                  calories={entrees[13].calories + " cal"} 
                  isPremium={entrees[13].is_premium} 
                  isSeasonal={entrees[13].is_seasonal}
                  />
             </div>
                  ) :
                  (<div></div>)

                }
          </div>
          <div className="col">
          {MenuBoardEntree[14] ? (
              <div>
            <MenuBoardEntree
                  name={formatProductName(entrees.at(14).product_name)}
                  image={<img src ={entrees[14].image} />} 
                  calories={entrees[14].calories + " cal"} 
                  isPremium={entrees[14].is_premium} 
                  isSeasonal={entrees[14].is_seasonal}
                  />
              </div>
                  ) :
                  (<div></div>)

                }
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuMain;
