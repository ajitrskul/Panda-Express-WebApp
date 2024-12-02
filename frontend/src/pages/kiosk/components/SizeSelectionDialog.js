// SizeSelectionDialog.js
import React from 'react';
import '../../../styles/kiosk/sizeSelectionDialog.css'; // Ensure this file exists and has appropriate styles

const SizeSelectionDialog = ({ item, sizeOptions, onSizeSelect, onClose }) => {
  const formatProductName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };

  return (
    <div className="size-selection-overlay">
      <div className="size-selection-dialog">
        <h2>Select Size for {formatProductName(item.product_name)}</h2>
        <img src={item.image} alt={item.product_name} className="item-image" />
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

export default SizeSelectionDialog;
