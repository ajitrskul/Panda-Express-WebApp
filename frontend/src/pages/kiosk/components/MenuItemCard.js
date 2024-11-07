import React from 'react';
import '../../../styles/kiosk.css';

const MenuItemCard = ({ name, image, description,isPremium, isSeasonal, onInfoClick, onClick }) => {
  return (
    <div className="card pt-3" style={{ width: "18rem", cursor: "pointer" }} onClick={onClick}>
      {(isPremium || isSeasonal) && (
        <div className={`banner ${isPremium ? 'premium-banner' : 'seasonal-banner'}`}>
          {isPremium ? 'P' : 'S'}
        </div>
      )}
      <button
        className="info-button"
        onClick={(e) => {
          e.stopPropagation(); 
          if (typeof onInfoClick === 'function') {
            onInfoClick(); 
          } 
          else {
            console.error('onInfoClick is not a function'); 
          }
        }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '25px',
          height: '25px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        i
      </button>
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body">
        <p className="card-text text-center">{name}</p>
        <p className="card-description text-center">{description}</p>
      </div>  
    </div>
  );
};

export default MenuItemCard;
