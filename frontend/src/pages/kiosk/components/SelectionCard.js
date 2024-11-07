import React from 'react';
import '../../../styles/kiosk.css';

const SelectionCard = ({ type, onClick, isSelected, image }) => {
  return (
    <div 
      className={`card selection-card ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      {image && <img src={image} alt={`Selected ${type}`} className="selection-card-image" />}
      {!image && (
        <div className="selection-card-content">
          <span className="plus-sign">+</span>
          <p className="selection-text">Choose {type}</p>
        </div>
      )}
    </div>
  );
};


export default SelectionCard;
