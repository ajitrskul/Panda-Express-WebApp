import React from 'react';
import '../../../styles/kiosk.css';

const MenuItemCard = ({ name, image, description, onClick }) => {
  return (
    <div className="card py-4" style={{ width: "18rem", cursor: "pointer" }} onClick={onClick}>
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body">
        <p className="card-text text-center">{name}</p>
        <p className="card-description text-center">{description}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;
