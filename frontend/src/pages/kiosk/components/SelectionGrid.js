import React from 'react';
import SelectionCard from './SelectionCard';

const SelectionGrid = ({ numSides, numEntrees, onSelect, selectedSides, selectedEntrees }) => {
  const handleCardClick = (type, index) => {
    onSelect(type, index);
  };

  const renderCards = (count, type) => {
    return Array.from({ length: count }, (_, index) => {
      let isSelected = false;
      let image = null;

      if (type === 'side') {
        isSelected = selectedSides[index] !== null;
        image = selectedSides[index]?.image;
      } else if (type === 'entree') {
        isSelected = selectedEntrees[index] !== null;
        image = selectedEntrees[index]?.image;
      }

      return (
        <SelectionCard
          key={`${type}-${index}`}
          type={type}
          isSelected={isSelected}
          onClick={() => handleCardClick(type, index)}
          image={image}
        />
      );
    });
  };

  return (
    <div className="selection-grid mt-4 d-flex flex-wrap justify-content-center">
      <div className="sides-section">
        {renderCards(numSides, 'side')}
      </div>
      <div className="entrees-section">
        {renderCards(numEntrees, 'entree')}
      </div>
    </div>
  );
};

export default SelectionGrid;
