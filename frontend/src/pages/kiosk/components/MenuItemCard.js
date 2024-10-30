import React from 'react';
import '../../../styles/kiosk.css';

const MenuItemCard = ({ name, image }) => {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body">
        <p className="card-text text-center">{name}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;