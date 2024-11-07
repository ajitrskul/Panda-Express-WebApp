import React from 'react';
import '../../../styles/kiosk.css';

const MenuItemCard = ({ name, image, description, isPremium, isSeasonal, onInfoClick, onClick, showInfoButton = true, isAvailable = true, price, priceType = 'Premium Addition' }) => {
  return (
    <div className="card pt-3" onClick={isAvailable ? onClick : undefined}>
      {!isAvailable && (
        <div className="unavailable-overlay">
          <div className="unavailable-text">Unavailable</div>
        </div>
      )}
      {(isPremium || isSeasonal) && (
        <div className="banners-container">
          {isPremium && (
            <div className="banner premium-banner">P</div>
          )}
          {isSeasonal && (
            <div className="banner seasonal-banner">S</div>
          )}
        </div>
      )}
      {showInfoButton && (
        <button
          className="info-button"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onInfoClick === 'function') {
              onInfoClick();
            } else {
              console.error('onInfoClick is not a function');
            }
          }}
          disabled={!isAvailable} // Disable button if not available
        >
          i
        </button>
      )}
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body">
        <p className="card-text text-center">{name}</p>
        <p className="card-description text-center">{description}</p>
        <div className="price-container" style={{ fontWeight: 'bold', position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.6em' }}>
        {price && !isNaN(price) && parseFloat(price) !== 0 ? (
          priceType === 'Base Price' ? `$${parseFloat(price).toFixed(2)}+` : `+$${parseFloat(price).toFixed(2)}`
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default MenuItemCard;
