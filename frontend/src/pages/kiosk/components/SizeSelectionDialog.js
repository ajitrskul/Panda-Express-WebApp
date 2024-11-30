import React from 'react';
import '../../../styles/kiosk/sizeSelectionDialog.css'; 

const SizeSelectionDialog = ({ drink, sizeOptions, onSizeSelect, onClose }) => {
  return (
    <div className="size-selection-overlay">
      <div className="size-selection-dialog">
        <h2>Select Size for {formatProductName(drink.product_name)}</h2>
        <div className="size-options">
          {sizeOptions.map((sizeOption, index) => (
            <button
              key={index}
              className="size-option-button"
              onClick={() => onSizeSelect(sizeOption)}
            >
              {sizeOption.display_name} (${sizeOption.menu_item_base_price.toFixed(2)})
            </button>
          ))}
        </div>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const formatProductName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};

export default SizeSelectionDialog;
