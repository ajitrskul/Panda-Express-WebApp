import React from 'react';

const InfoCard = ({ 
  title, 
  image, 
  description, 
  allergens, 
  servingSize, 
  calories, 
  saturatedFat, 
  carbohydrate, 
  protein, 
  onClose 
}) => {
  return (
    <div style={popupStyles}>
      <div style={popupContentStyles}>
        <h3>{title}</h3>
        <img src={image} alt={title} style={imageStyles} />
        <p>{description}</p>
        <hr />
        <p><strong>Allergens:</strong> {allergens}</p>
        <p><strong>Serving Size:</strong> {servingSize}</p>
        <p><strong>Calories:</strong> {calories} kcal</p>
        <p><strong>Saturated Fat:</strong> {saturatedFat} g</p>
        <p><strong>Carbohydrate:</strong> {carbohydrate} g</p>
        <p><strong>Protein:</strong> {protein} g</p>
        <button onClick={onClose} style={closeButtonStyles}>
          Close
        </button>
      </div>
    </div>
  );
};

const popupStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
};

const popupContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '400px',
  textAlign: 'center',
};

const closeButtonStyles = {
  marginTop: '10px',
  padding: '5px 10px',
  backgroundColor: '#a3080c',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const imageStyles = {
  width: '100%',
  maxWidth: '300px',
};

export default InfoCard;
